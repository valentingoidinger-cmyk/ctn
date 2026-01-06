# Quick Setup Guide 🚀

## Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great!)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be ready (~2 minutes)

#### Get Your API Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://...supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (another long string)

#### Set Up Database
1. In Supabase, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-setup.sql` from this project
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci0iJI... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci0iJI... (your service role key)
```

### 4. Add Your Band Video

1. Create the videos folder:
   ```bash
   mkdir -p public/videos
   ```

2. Add your video file as `public/videos/band-video.mp4`

**Don't have a video yet?** 
- Comment out the video section in `src/components/VideoHero.tsx` temporarily
- Or use a solid color background for now

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

### 6. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)

## Initial Content Setup

### Add Band Info
1. Go to `/admin`
2. Click "Band Info" tab
3. Fill in:
   - Bio
   - Contact email
   - Social media links
4. Click "Save Changes"

### Add Your First Release
1. Go to "Releases" tab
2. Click "+ Add Release"
3. Fill in the details:
   - **Title**: Your EP/Album name
   - **Type**: EP, Single, or Album
   - **Cover URL**: Upload your album art to Supabase Storage (or use an external URL like Imgur)
   - **Release Date**: When it was released
   - **Spotify/Apple Music URLs**: Links to streaming platforms
   - **Display Order**: 0 for first, 1 for second, etc.
4. Click "Add Release"

**Tip**: To upload album art:
- Go to Supabase → Storage
- Create a bucket called "album-covers"
- Make it public
- Upload images
- Copy the public URL

### Add Your First Tour Date
1. Go to "Tour Dates" tab
2. Click "+ Add Tour Date"
3. Fill in:
   - Date & Time
   - Venue name
   - City & Country
   - Ticket URL (if available)
   - Check "Sold Out" if applicable
4. Click "Add Tour Date"

## Testing

1. Visit the home page (`http://localhost:3000`)
2. Scroll down to see the animations
3. Hover over album covers to see them expand
4. Click on streaming links or tour date buttons
5. Check that everything looks good on mobile (use browser dev tools)

## Common Issues

### "Error loading band info"
- Check your `.env.local` file has correct Supabase credentials
- Make sure you ran the SQL setup script
- Restart the dev server (`Ctrl+C` then `npm run dev`)

### Video not showing
- Make sure the video file is at `public/videos/band-video.mp4`
- Check the video format is MP4
- Try with a different video file

### Can't see releases/tour dates
- Go to `/admin` and add some content
- Check browser console for errors
- Verify Supabase tables were created correctly

### Animations not working
- Clear your browser cache
- Try in an incognito/private window
- Check browser console for JavaScript errors

## Next Steps

1. **Add Authentication** to the admin panel (optional but recommended)
2. **Customize Colors** in `src/app/globals.css`
3. **Add More Content** through the admin panel
4. **Deploy** to Vercel or your preferred hosting platform

## Need Help?

- Check the main `README.md` for more detailed information
- Look at the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

---

Enjoy your new band website! 🎸✨
