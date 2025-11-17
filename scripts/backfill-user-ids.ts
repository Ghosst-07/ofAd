// One-time script to backfill counselors.user_id based on phone_number.
// Run with: npx ts-node scripts/backfill-user-ids.ts (add ts-node if needed)
// Prerequisites: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL set in env.

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const admin = createClient(url, serviceRole, { auth: { persistSession: false } });

async function run() {
  console.log('Fetching counselors without user_id...');
  const { data: counselors, error } = await admin
    .from('counselors')
    .select('*')
    .is('user_id', null);

  if (error) {
    console.error('Error fetching counselors:', error.message);
    process.exit(1);
  }

  if (!counselors || counselors.length === 0) {
    console.log('No counselors need backfill. Done.');
    return;
  }

  for (const c of counselors) {
    const phone = c.phone_number;
    if (!phone) {
      console.warn(`Skipping counselor ${c.id} (no phone_number).`);
      continue;
    }

    // Attempt to find existing auth user by phone
    const existing = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      // Supabase does not provide direct phone filter; fallback create below
    });

    let userId: string | null = null;

    // Try naive match from returned users (limited) - if not found, create.
    // In real scenario, you would iterate through pages or maintain a mapping.
    if (existing.data?.users) {
      const match = existing.data.users.find(u => u.phone === phone);
      if (match) {
        userId = match.id;
        console.log(`Matched existing auth user for phone ${phone}: ${userId}`);
      }
    }

    if (!userId) {
      console.log(`Creating auth user for phone ${phone} ...`);
      const createRes = await admin.auth.admin.createUser({
        phone,
        email: c.email || undefined,
        phone_confirm: true,
        email_confirm: false,
        user_metadata: { full_name: c.full_name }
      });
      if (createRes.error || !createRes.data?.user) {
        console.error(`Failed to create auth user for counselor ${c.id}:`, createRes.error?.message);
        continue;
      }
      userId = createRes.data.user.id;
    }

    const { error: updateError } = await admin
      .from('counselors')
      .update({ user_id: userId })
      .eq('id', c.id);

    if (updateError) {
      console.error(`Failed to update counselor ${c.id}:`, updateError.message);
    } else {
      console.log(`Backfilled counselor ${c.id} with user_id ${userId}`);
    }
  }

  console.log('Backfill complete. You can now add NOT NULL + FK constraints.');
}

run().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
