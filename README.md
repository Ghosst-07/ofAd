This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Counselor Creation (API Route)

Counselor creation is handled via the Next.js API route `/api/create-counselor` (no Supabase CLI or Edge Functions required). It:

- Creates a Supabase Auth user (phone + optional email)
- Inserts a linked row into the `counselors` table
- Cleans up (deletes the auth user) if the DB insert fails

Environment variables (set in `.env.local` and hosting platform like Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` MUST NOT be exposed client-side (no NEXT_PUBLIC prefix).

Client code automatically POSTs the full form payload to `/api/create-counselor` when adding a new counselor—no user_id field needed.

### Adding user_id Column & Backfilling

If you created `counselors` before introducing auth linkage you must:

1. Add the column (nullable first):

```
ALTER TABLE counselors ADD COLUMN user_id uuid;
```

2. Backfill mapping (script creates/matches auth users by phone):

```
npx ts-node scripts/backfill-user-ids.ts
```

3. Enforce constraints after successful backfill:

```
ALTER TABLE counselors ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE counselors ADD CONSTRAINT counselors_user_id_fk FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX counselors_user_id_idx ON counselors(user_id);
```

4. (Optional) Add RLS policy:

```
CREATE POLICY select_own_counselor ON counselors FOR SELECT USING ( user_id = auth.uid() );
```

If you do NOT want the `user_id` linkage, keep the column nullable or skip adding it; but you lose clean RLS and stable identity mapping.

### Using Schema Without user_id (Simplified Mode)

Current provided schema does NOT include `user_id`. In this simplified mode:

- We create an Auth user (phone + email) then insert counselor row with the same email/phone.
- Linking relies on matching by `email` (unique) or `phone_number` (recommend making unique).
- RLS policies based on `auth.uid()` are not available without adding a `user_id` column.

Optional: make phone unique for safer lookups:

```
ALTER TABLE counselors
	ADD CONSTRAINT counselors_phone_unique UNIQUE (phone_number);
```

Login mapping idea (later): when a user logs in, fetch counselor via:

```
select * from counselors where email = session.user.email;
```

or (if phone-only user):

```
select * from counselors where phone_number = session.user.phone;
```

### Primary Key = Auth User ID Mode

If you choose to make `counselors.id` equal the Auth user's `id`:

1. Ensure `counselors.id` is `uuid` (your schema already does this).
2. On creation, insert row with `id: newUser.id`.
3. (Optional but recommended) Add FK constraint for automatic cleanup:

```
ALTER TABLE counselors
	ADD CONSTRAINT counselors_id_fk FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

4. Delete flow: deleting the auth user deletes the counselor row (with FK).
5. Lookups become trivial: `select * from counselors where id = auth.uid();`

Trade-offs:

- Cannot create a counselor row before auth user exists.
- Changing auth user id (rare) would require recreating the counselor row.

This repository now uses this mode (API route sets `id = newUser.id`).

You can migrate away later by adding a separate surrogate key if needed.

## Editing Counselors

Editing keeps existing logic: direct `update` queries on the `counselors` table using the anon key (subject to your RLS policies).

## Security Notes

- Only the API route uses the service role key.
- Never expose the service role key to the client.
- Consider adding rate limiting or admin checks (e.g. verifying an admin session) to `/api/create-counselor`.

## Optional: Reintroducing Edge Functions

If you ever want to revert to a Supabase Edge Function, you can restore the previous implementation, but it's not needed for the current flow.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
