# Itunes Beauty site (Next.js + Supabase + Vercel)
1. supabase.com > New project. SQL Editor > paste supabase.sql > Run.
2. Authentication > Users > Add user (your email + password). Authentication > Sign In / Providers > turn OFF "Allow new users to sign up".
3. Project Settings > API: copy Project URL and anon public key.
4. Upload this folder to a GitHub repo, then vercel.com > Add New Project > import it.
   Add env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Deploy.
5. Open yoursite/admin and log in to edit details, services (with prices), and gallery photos.
Until you add your own services/photos, the site shows the starter ones in public/photos.

All tables start with ib_ and the photo bucket is ib-photos, so this can share a Supabase project without touching other sites.
