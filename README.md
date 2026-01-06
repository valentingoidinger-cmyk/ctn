# color the night 🎸

A creative, unique website for the indie-funk-pop band "color the night". Features a dark-to-color theme that progressively reveals vibrant colors as you scroll, matching the band's aesthetic perfectly.

## ✨ Features

### Public Site
- **Video Hero**: Immersive video background with animated band name
- **Dark-to-Color Theme**: Website starts dark and gets more colorful as you scroll
- **Horizontal Releases Carousel**: Interactive album/EP covers that expand on hover
- **Animated Tour Dates**: Colorful, funky tour date listings with ticket links
- **Smooth Animations**: Powered by Framer Motion for buttery smooth interactions
- **Responsive Design**: Looks great on all devices

### Admin Panel (`/admin`)
- **Band Info Management**: Update bio, contact info, and social media links
- **Release Management**: Add, edit, and delete EPs, albums, and singles
- **Tour Date Management**: Full CRUD operations for tour dates
- **Real-time Updates**: Changes reflect immediately on the public site

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (Animations)
- **Supabase** (Database & Real-time)
- **React 19**

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd color-the-night
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the SQL from `supabase-setup.sql` in your Supabase SQL editor to create the tables
   
   c. Copy `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Add your band video**
   - Place your band video as `public/videos/band-video.mp4`
   - Recommended: MP4 format, optimized for web (< 10MB)
   - Alternative: You can use any video format supported by HTML5 video

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🎨 Customization

### Colors
The color scheme can be customized in `src/app/globals.css` and component files. Current gradient colors:
- Purple (`purple-400`, `purple-500`)
- Pink (`pink-400`, `pink-500`)
- Cyan (`cyan-400`, `cyan-500`)
- Yellow (`yellow-400`, `yellow-500`)

### Video
Replace `public/videos/band-video.mp4` with your own video. The video should be:
- Landscape orientation
- MP4 format
- Optimized for web (consider compression)
- Ideally under 10MB for fast loading

### Fonts
Currently using the Geist font family. To change fonts, modify `src/app/layout.tsx`.

## 📊 Database Schema

### Tables
- `band_info` - Single row containing band bio and social links
- `releases` - EPs, albums, and singles
- `tour_dates` - Upcoming and past tour dates

See `supabase-setup.sql` for the complete schema and policies.

## 🔒 Security Notes

**Important**: The current setup allows public write access to the database for simplicity. Before deploying to production, you should:

1. Set up Supabase authentication
2. Update Row Level Security (RLS) policies to require authentication for write operations
3. Add authentication to the `/admin` route
4. Consider using Supabase Auth with email/password or OAuth providers

Example: Add a simple password protection to the admin page or integrate proper auth.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Cloudflare Pages
- Railway
- Your own server with Node.js

## 📝 Usage

### Admin Panel

1. Navigate to `/admin`
2. Use the tabs to switch between Band Info, Releases, and Tour Dates
3. Add, edit, or delete content as needed
4. Changes appear immediately on the public site

### Adding Releases

1. Go to Admin → Releases
2. Click "Add Release"
3. Fill in the details:
   - Title (e.g., "Midnight Colors EP")
   - Type (EP, Single, or Album)
   - Cover Image URL (upload image to Supabase Storage or use external URL)
   - Release Date
   - Streaming Links (Spotify, Apple Music)
   - Display Order (lower numbers appear first)

### Adding Tour Dates

1. Go to Admin → Tour Dates
2. Click "Add Tour Date"
3. Fill in the venue, location, date, and ticket URL
4. Toggle "Sold Out" if applicable

## 🎭 Creative Features Explained

### Dark-to-Color Theme
As you scroll down the page, background colors gradually transition from pure black to darker purples and blues, creating a "coloring the night" effect.

### Horizontal Carousel
The releases section uses a horizontal scroll effect tied to vertical scrolling, creating a unique browsing experience. Album covers expand on hover to reveal more details.

### Animated Tour Dates
Each tour date has a unique colorful accent and animates in as you scroll. The gradient colors cycle through different hues for a funky, vibrant look.

### Video Hero
The video background creates an immersive first impression, with a parallax effect as you scroll down.

## 🛠 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📄 License

This project is open source. Feel free to use it for your own band or creative project!

## 🎵 Credits

Built with ❤️ for "color the night"

---

**Need help?** Open an issue or reach out to the development team.
