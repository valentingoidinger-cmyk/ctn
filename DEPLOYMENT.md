# Deployment Guide 🚀

This guide covers deploying your "color the night" band website to production.

## Pre-Deployment Checklist

- [ ] Test the site locally (`npm run dev`)
- [ ] Add your band video to `public/videos/band-video.mp4`
- [ ] Configure Supabase with the SQL schema
- [ ] Add initial content through the admin panel
- [ ] Test on mobile devices
- [ ] Verify all links work (social media, streaming platforms, tickets)
- [ ] Check that images load properly
- [ ] Review and update SEO metadata in `src/app/layout.tsx`

## Deploying to Vercel (Recommended)

Vercel is the easiest deployment option as it's made by the creators of Next.js.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/color-the-night.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy"

Your site will be live in ~2 minutes at a URL like `color-the-night.vercel.app`

### Step 3: Add Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain (e.g., `colorthenight.band`)
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (~24 hours max)

## Deploying to Netlify

### Step 1: Build Settings

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Add environment variables in Netlify settings
6. Deploy!

## Deploying to Your Own Server

### Requirements
- Node.js 18+ installed
- A server with SSH access (VPS, dedicated server, etc.)
- A domain name pointed to your server

### Step 1: Build the Application

```bash
npm run build
```

### Step 2: Upload to Server

```bash
# Using SCP
scp -r .next package.json package-lock.json public src user@your-server.com:/var/www/color-the-night/

# Or using rsync
rsync -avz --exclude 'node_modules' ./ user@your-server.com:/var/www/color-the-night/
```

### Step 3: Set Up on Server

SSH into your server:

```bash
ssh user@your-server.com
cd /var/www/color-the-night
npm install --production
```

Create `.env.local` with your Supabase credentials.

### Step 4: Run with PM2

```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start npm --name "color-the-night" -- start

# Set up auto-restart on server reboot
pm2 startup
pm2 save
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/color-the-night`:

```nginx
server {
    listen 80;
    server_name yourband.com www.yourband.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/color-the-night /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourband.com -d www.yourband.com
```

## Post-Deployment

### 1. Secure the Admin Panel

**Important**: The admin panel is currently public. Secure it by:

#### Option A: Simple Password Protection (Quick)

Add this to `src/app/admin/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
// ... other imports

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') setIsAuthenticated(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'your-secure-password') {
      sessionStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Wrong password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-xl">
          <h2 className="text-2xl text-white mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
            placeholder="Password"
          />
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  // ... rest of the component
}
```

#### Option B: Supabase Auth (Recommended)

Implement Supabase authentication following their [auth documentation](https://supabase.com/docs/guides/auth).

### 2. Set Up Row Level Security

Update your Supabase RLS policies to require authentication for write operations:

```sql
-- Replace the permissive policies with:

-- Tour Dates
CREATE POLICY "Anyone can read tour dates" ON tour_dates FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert tour dates" ON tour_dates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update tour dates" ON tour_dates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete tour dates" ON tour_dates FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for band_info and releases tables
```

### 3. Performance Optimization

#### Enable Image Optimization

Upload images to Supabase Storage and use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src={release.cover_url}
  alt={release.title}
  width={500}
  height={500}
  className="w-full h-full object-cover"
/>
```

#### Compress Your Video

Reduce video file size for faster loading:

```bash
# Using ffmpeg
ffmpeg -i original-video.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k public/videos/band-video.mp4
```

### 4. Set Up Analytics

#### Google Analytics

1. Create a Google Analytics property
2. Add the tracking code to `src/app/layout.tsx`:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 5. Set Up Monitoring

Use Vercel Analytics or set up error tracking with:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)

### 6. Configure Supabase for Production

1. Review and tighten Row Level Security policies
2. Set up database backups
3. Monitor database usage in Supabase dashboard
4. Consider upgrading to a paid plan for higher limits

## Updating Your Site

### On Vercel
Simply push to GitHub and Vercel will auto-deploy:

```bash
git add .
git commit -m "Update content"
git push
```

### On Your Own Server

```bash
# On your local machine
git push

# On your server
ssh user@your-server.com
cd /var/www/color-the-night
git pull
npm install
npm run build
pm2 restart color-the-night
```

## Troubleshooting

### Site is slow
- Compress your video file
- Optimize images
- Enable Vercel/Netlify CDN
- Consider lazy loading for images

### Database errors
- Check Supabase dashboard for connection limits
- Verify environment variables are correct
- Check RLS policies aren't blocking requests

### Video not loading
- Ensure video file is under 10MB
- Check video format is MP4
- Verify the file path is correct
- Consider hosting video on YouTube/Vimeo as backup

## Maintenance

### Regular Tasks
- [ ] Update tour dates through admin panel
- [ ] Add new releases when they drop
- [ ] Monitor Supabase usage
- [ ] Check analytics for traffic patterns
- [ ] Update band info and social links
- [ ] Backup your database monthly

### Monthly Updates
```bash
# Update dependencies
npm update
npm audit fix

# Test locally
npm run dev

# Deploy updates
git commit -am "Update dependencies"
git push
```

## Support

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

**Congrats on deploying your band website! 🎉🎸**
