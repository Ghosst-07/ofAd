import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Accepts TWO possible payload shapes for flexibility:
// 1. Flat shape (what the current frontend sends):
//    {
//      full_name: string,
//      email: string,
//      phone_number: string,
//      bio?, avatar_url?, date_of_birth?, license_number?,
//      specializations?, languages?, years_of_experience?
//    }
// 2. Nested shape (planned future shape):
//    {
//      phone: string,
//      email: string,
//      profile: { full_name: string, bio?, avatar_url?, ... }
//    }
// Broad type for flexible incoming JSON; refine minimally to satisfy linter.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IncomingPayload = { [key: string]: any };

// Ensure SUPABASE_SERVICE_ROLE_KEY is set in Vercel (NOT prefixed with NEXT_PUBLIC)
// NEVER expose service role key to the client.

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // public anon URL ok
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // secret

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let payload: IncomingPayload | null = null;
  try {
    payload = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Extract values supporting both shapes
  const rawPhone = (payload?.phone || payload?.phone_number || '').trim();
  const email = (payload?.email || '').trim();
  const profile = payload?.profile && typeof payload.profile === 'object' ? payload.profile : payload;
  const full_name = (profile?.full_name || '').trim();
  const phone = rawPhone;
  
  // Extract rate fields if present (for rates JSONB)
  const rate_voice_per_minute = profile?.rate_voice_per_minute;
  const rate_video_per_minute = profile?.rate_video_per_minute;
  const rate_chat_per_minute = profile?.rate_chat_per_minute;

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }
  if (!full_name) {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: 'phone or phone_number is required' }, { status: 400 });
  }
  // Basic email format check
  if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid email format' }, { status: 400 });
  }
  
  // Strip prefixes: +91, 91, + and keep only digits
  const strippedPhone = phone.replace(/^\+?91/, '').replace(/\D/g, '');
  
  if (!strippedPhone || strippedPhone.length < 10) {
    return NextResponse.json({ error: 'invalid phone number (must have at least 10 digits)' }, { status: 400 });
  }

  // E.164 format: +91 prefix for all phone numbers
  const e164Phone = `+91${strippedPhone}`;

  // A. Create Auth user (E.164 format)
  const createUserRes = await admin.auth.admin.createUser({
    phone: e164Phone,
    email,
    phone_confirm: true,
    email_confirm: false,
    user_metadata: { full_name }
  });

  if (createUserRes.error || !createUserRes.data?.user) {
    return NextResponse.json({ error: createUserRes.error?.message || 'Failed to create auth user' }, { status: 400 });
  }

  const newUser = createUserRes.data.user;

  // B. Insert counselor row (schema has both auth_user_id and user_id)
  const counselorInsert = await admin
    .from('counselors')
    .insert([
      {
        auth_user_id: newUser.id, // required FK
        user_id: newUser.id, // also set user_id for query compatibility
        full_name,
        email,
        phone_number: e164Phone, // E.164 format
        bio: profile.bio || null,
        avatar_url: profile.avatar_url || null,
        date_of_birth: profile.date_of_birth || null,
        license_number: profile.license_number || null,
        specializations: profile.specializations || [],
        languages: profile.languages || ['en'],
        years_of_experience: profile.years_of_experience ?? 0,
        rate_video_per_minute: rate_video_per_minute ?? 2.0,
        rate_voice_per_minute: rate_voice_per_minute ?? 1.5,
        rate_chat_per_minute: rate_chat_per_minute ?? 0.5,
        accepts_chat: profile.accepts_chat ?? true,
        accepts_voice: profile.accepts_voice ?? true,
        accepts_video: profile.accepts_video ?? true,
        is_active: profile.is_active ?? true,
        is_accepting_calls: profile.is_accepting_calls ?? true
        // id auto-generated, created_at/updated_at use defaults
      }
    ])
    .select()
    .single();

  if (counselorInsert.error) {
    // Rollback auth user to avoid orphan account
    await admin.auth.admin.deleteUser(newUser.id);
    
    // Check for constraint errors
    if (counselorInsert.error.message.includes('counselors_auth_user_id') || counselorInsert.error.message.includes('counselors_user_id') || counselorInsert.error.message.includes('duplicate')) {
      return NextResponse.json({ 
        error: 'Counselor profile already exists for this auth user' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: counselorInsert.error.message }, { status: 400 });
  }

  // C. Respond (return counselor; user object optional)
  return NextResponse.json({ counselor: counselorInsert.data }, { status: 200 });
}
