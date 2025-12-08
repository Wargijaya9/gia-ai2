# Supabase Setup Guide for Gia AI

## 📋 Setup Steps

### 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email

### 2. Create New Project
1. Click "New Project"
2. Fill in project details:
   - **Name**: `gia-ai` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Wait for project initialization (~2 minutes)

### 3. Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

### 4. Update Environment Variables
1. Open `.env.local` file (create if doesn't exist)
2. Add these lines:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Create Database Tables
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy the entire content from `supabase/schema.sql`
4. Paste and click "Run"
5. You should see: "Success. No rows returned"

### 6. Verify Tables
1. Go to **Table Editor**
2. You should see 3 tables:
   - ✅ `tasks`
   - ✅ `reports`
   - ✅ `chat_sessions`

### 7. Install Supabase Package
```bash
npm install @supabase/supabase-js
```

### 8. Restart Development Server
```bash
npm run dev
```

## 🎯 Testing

### Test Task Planner
1. Go to `http://localhost:3000/dashboard/tasks`
2. Click "+ Add Task"
3. Create a test task
4. Verify it appears in the list
5. Check Supabase Table Editor - task should be there!

### Test from Supabase Dashboard
1. Go to **Table Editor** → **tasks**
2. Click "+ Insert row"
3. Add a task manually
4. Refresh your app - it should appear!

## 🔒 Security Notes

### Row Level Security (RLS)
The schema includes basic RLS policies that allow public access. For production:

1. **Enable Authentication** (optional but recommended)
2. **Update RLS Policies** to restrict by user:
```sql
-- Example: Only show user's own tasks
CREATE POLICY "Users can only see own tasks" 
ON tasks FOR SELECT 
USING (auth.uid() = user_id);
```

### API Keys
- **NEVER commit** `.env.local` to git (already in `.gitignore`)
- **anon key** is safe for public use
- **service_role key** should NEVER be exposed to client

## 📊 Database Schema Overview

### Tasks Table
```
- id: UUID (auto-generated)
- title: TEXT (required)
- description: TEXT
- status: ENUM ('todo', 'in-progress', 'done')
- priority: ENUM ('low', 'medium', 'high')
- due_date: TIMESTAMP
- category: TEXT
- created_at: TIMESTAMP (auto)
- updated_at: TIMESTAMP (auto)
- user_id: UUID (for future auth)
```

### Reports Table
```
- id: UUID (auto-generated)
- title: TEXT (required)
- content: TEXT (required)
- author: TEXT
- doc_number: TEXT
- template_type: TEXT
- work_category: TEXT
- created_at: TIMESTAMP (auto)
- updated_at: TIMESTAMP (auto)
- user_id: UUID (for future auth)
```

### Chat Sessions Table
```
- id: UUID (auto-generated)
- title: TEXT (required)
- messages: JSONB (array of messages)
- created_at: TIMESTAMP (auto)
- updated_at: TIMESTAMP (auto)
- user_id: UUID (for future auth)
```

## 🚀 Next Steps

### Migrate Existing Data
If you have data in localStorage:

1. **Tasks**: Export from localStorage, import to Supabase
2. **Reports**: Save new reports will auto-save to DB
3. **Chat Sessions**: Can migrate using custom script

### Enable More Features
- [ ] User authentication (Supabase Auth)
- [ ] Real-time updates (Supabase Realtime)
- [ ] File uploads (Supabase Storage)
- [ ] Scheduled reports automation

## 🆘 Troubleshooting

### "Failed to fetch" error
- Check internet connection
- Verify SUPABASE_URL is correct
- Check API key is correct

### "relation does not exist" error
- Run the schema.sql again
- Check table names are lowercase
- Verify in Table Editor

### CORS errors
- Supabase automatically handles CORS
- Check if using correct URL (https not http)

### Data not appearing
- Check browser console for errors
- Verify in Supabase Table Editor
- Check RLS policies aren't blocking

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 💡 Tips

1. **Use Table Editor** for manual data management
2. **SQL Editor** for custom queries
3. **Logs** section for debugging
4. **API Docs** auto-generated from your schema
5. **Database** section for performance monitoring

---

✨ **Your database is now production-ready!**

Data persists across devices, automatic backups, and scales to millions of rows.
