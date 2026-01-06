# Quick Reference Guide 📋

Quick commands and information for working with the project.

## 🚀 Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
# Run SQL in Supabase dashboard to set up tables
```

## 🔗 Important URLs

- **Local Dev**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Supabase Dashboard**: https://app.supabase.com

## 📁 Key Files to Edit

### Styling & Branding
- `src/app/globals.css` - Global styles, colors, animations
- `src/app/layout.tsx` - Fonts, metadata, SEO

### Content Components
- `src/components/VideoHero.tsx` - Hero section with video
- `src/components/ReleasesCarousel.tsx` - Album carousel
- `src/components/TourDates.tsx` - Tour dates list
- `src/components/Footer.tsx` - Footer & bio

### Admin Components
- `src/components/admin/BandInfoManager.tsx` - Band info form
- `src/components/admin/ReleaseManager.tsx` - Releases management
- `src/components/admin/TourDateManager.tsx` - Tour dates management

### API Routes
- `src/app/api/band-info/route.ts` - Band info endpoints
- `src/app/api/releases/route.ts` - Releases endpoints
- `src/app/api/tour-dates/route.ts` - Tour dates endpoints

### Configuration
- `.env.local` - Environment variables (create from `.env.example`)
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `supabase-setup.sql` - Database schema

## 🎨 Color Palette

Current gradient colors used throughout:

```css
/* Purples */
purple-400: #c084fc
purple-500: #a855f7
purple-600: #9333ea
purple-900: #581c87

/* Pinks */
pink-400: #f472b6
pink-500: #ec4899
pink-600: #db2777

/* Cyans */
cyan-400: #22d3ee
cyan-500: #06b6d4

/* Yellows */
yellow-400: #facc15
yellow-500: #eab308

/* Oranges */
orange-500: #f97316

/* Others */
green-500: #22c55e (Spotify button)
red-500: #ef4444 (sold out tags)
blue-500: #3b82f6 (edit buttons)
```

## 🗄️ Database Quick Reference

### Get all tour dates
```typescript
const { data } = await supabase
  .from('tour_dates')
  .select('*')
  .order('date', { ascending: true })
```

### Get all releases
```typescript
const { data } = await supabase
  .from('releases')
  .select('*')
  .order('order', { ascending: true })
```

### Get band info
```typescript
const { data } = await supabase
  .from('band_info')
  .select('*')
  .single()
```

### Add a tour date
```typescript
const { data, error } = await supabase
  .from('tour_dates')
  .insert([{
    date: '2024-12-31T20:00:00',
    venue: 'The Venue',
    city: 'Los Angeles',
    country: 'USA',
    ticket_url: 'https://...',
    sold_out: false
  }])
```

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## 🎬 Video Specifications

Recommended video specs:
- **Format**: MP4 (H.264)
- **Size**: < 10MB (5MB ideal)
- **Resolution**: 1920x1080 or 1280x720
- **Aspect Ratio**: 16:9
- **Location**: `public/videos/band-video.mp4`

Compress video with ffmpeg:
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k output.mp4
```

## 🖼️ Image Specifications

Album covers:
- **Format**: JPG or PNG
- **Size**: < 500KB each
- **Resolution**: 1000x1000px minimum
- **Aspect Ratio**: 1:1 (square)

## 🔧 Common Customizations

### Change main gradient colors
`src/app/globals.css`:
```css
.animate-gradient {
  background: linear-gradient(to right, #your-color-1, #your-color-2, #your-color-3);
}
```

### Change fonts
`src/app/layout.tsx`:
```typescript
import { YourFont } from "next/font/google"

const yourFont = YourFont({
  variable: "--font-your-font",
  subsets: ["latin"],
})
```

### Adjust animation speeds
In components, modify `transition` props:
```typescript
transition={{ duration: 1.0 }} // slower
transition={{ duration: 0.3 }} // faster
```

### Change background colors
`src/components/` files, look for:
```typescript
style={{ backgroundColor: useTransform(...) }}
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Error loading data" | Check `.env.local` has correct Supabase credentials |
| Video not showing | Verify file exists at `public/videos/band-video.mp4` |
| Admin can't save | Check Supabase RLS policies allow writes |
| Site is slow | Compress video file, optimize images |
| Build fails | Run `npm install` again, delete `.next` folder |
| Port 3000 in use | Use `npm run dev -- -p 3001` |

## 📦 Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Get these from: Supabase Dashboard → Settings → API

## 🔐 Security Checklist for Production

- [ ] Add authentication to `/admin` route
- [ ] Update Supabase RLS policies (require auth for writes)
- [ ] Enable Supabase database backups
- [ ] Set up error monitoring (Sentry/LogRocket)
- [ ] Add rate limiting to API routes
- [ ] Review and test all forms for validation
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerts

## 📊 Performance Checklist

- [ ] Compress video file (< 5MB)
- [ ] Optimize images with Next.js Image
- [ ] Enable caching headers
- [ ] Test on slow 3G connection
- [ ] Run Lighthouse audit
- [ ] Monitor Core Web Vitals
- [ ] Set up CDN for assets
- [ ] Minify CSS/JS (automatic in prod build)

## 🎯 Content Management Workflow

1. Go to `/admin`
2. Select appropriate tab (Band Info / Releases / Tour Dates)
3. Click "+ Add" button
4. Fill in form fields
5. Click "Add" or "Save"
6. Check main site to verify changes
7. Repeat as needed

Changes appear instantly on the main site!

## 🌐 Deployment Quick Steps

**Vercel** (Easiest):
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
# Import in Vercel dashboard, add env vars, deploy
```

**Manual**:
```bash
npm run build
npm run start
# Set up reverse proxy (nginx)
# Configure SSL (Let's Encrypt)
```

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 💡 Tips

- Use the admin panel instead of directly editing the database
- Test on mobile devices early and often
- Keep video file size under 10MB
- Backup your database before making major changes
- Use semantic commit messages
- Test in different browsers
- Monitor Supabase usage to stay within limits
- Update tour dates regularly to keep site fresh

---

**Need more help?** Check `SETUP.md`, `DEPLOYMENT.md`, or `PROJECT_SUMMARY.md`
