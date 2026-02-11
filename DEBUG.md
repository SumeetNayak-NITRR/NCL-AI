# Debugging Blank Page Issue

## Steps to Debug:

### 1. Open Browser Developer Tools
- Open http://localhost:5173/ in your browser
- Press F12 to open Developer Tools
- Go to the **Console** tab

### 2. Check for Errors
Look for any red error messages. Common errors:

#### If you see: "createClient is not a function" or Supabase errors
**Solution**: You need to set up your Supabase project first.

#### If you see: "Failed to fetch" or network errors
**Solution**: Check your internet connection or Supabase URL.

#### If you see: React Router errors
**Solution**: There might be a routing issue.

### 3. Quick Fix - Set Up Supabase

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy your:
   - Project URL
   - anon/public key

5. Update your `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_ADMIN_PIN=1234
```

6. **IMPORTANT**: After updating `.env`, restart the dev server:
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

### 4. Set Up Database Tables

In Supabase Dashboard:
- Go to SQL Editor
- Copy and paste the contents from `src/lib/schema.sql`
- Click "Run"

### 5. Create Storage Bucket

In Supabase Dashboard:
- Go to Storage
- Create a new bucket named `player-photos`
- Make it **public**

## What to Report Back

Please check your browser console and tell me:
1. What error messages you see (if any)
2. Whether the page is completely blank or shows partial content
3. If you've set up Supabase yet
