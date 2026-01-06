# Site Features ✨

## Core Experience

### 🎸 Horizontal Scrolling
The entire site scrolls **horizontally** instead of vertically - a unique, cinematic experience where each section is a full-screen "room" you move through.

- Smooth snap scrolling to each section
- Mouse wheel automatically converts to horizontal movement
- Elegant progress indicator (vertical dots in top right)
- Works on all devices (swipe on mobile)

## Sections

### 1. Hero
- Full-screen video background
- Massive, viewport-sized band name
- **Countdown timer** - Shows time until next release (days, hours, minutes)
- Fades out elegantly as you scroll

### 2. Releases
- **One full screen per release** - each album/EP gets its moment
- Large album cover on the left
- Title, year, and streaming links on the right
- Subtle hover effects on cover (gradient overlay)
- Animated arrows on link hover

### 3. Gallery
- **6-photo grid** of band photos
- Square aspect ratio for consistency
- Hover effects for interactivity
- Easy to add your own photos (see `ADDING_PHOTOS.md`)

### 4. Tour Dates
- **Refined layout** with perfect spacing
- Date block → Venue info → Ticket button
- Shows: weekday, month, day, year
- Ticket buttons that transform on hover
- Sold out indicator
- **Easter egg**: Shows tour stats at bottom (number of shows, countries)
- Graceful "No upcoming shows" state

### 5. Contact
- Bio and social links
- Clean two-column layout
- Hover animations on links (arrows appear)
- Copyright notice

## Delightful Details

### ✨ Easter Eggs

1. **Hidden message** - Hover bottom-left corner of any page for 2 seconds to see a secret message
2. **Tour stats** - Automatically calculates and displays number of shows and countries
3. **Animated arrows** - All external links reveal arrows on hover that slide in
4. **Progress indicator** - Active section shows longer bar with smooth animation

### 🎨 Design Refinements

- **Perfect spacing**: 
  - 32px padding on mobile
  - 128px padding on desktop
  - Consistent 16-24px gaps throughout
  
- **Typography hierarchy**:
  - Hero: 15vw (viewport-scaled)
  - Section titles: text-7xl
  - Body: text-xl
  - Small text: text-sm
  
- **Color system**:
  - Pure black (#000000)
  - Zinc-950 for variation
  - White with opacity: /60, /50, /40, /30, /20
  - Borders: white/5, white/10, white/20
  
- **Hover states**:
  - Smooth color transitions
  - Border intensity changes
  - Arrow slide-ins
  - Scale/translation micro-interactions

### 📱 Responsive Design

- Stacks to single column on mobile
- Touch-friendly swipe gestures
- Adjusted font sizes for smaller screens
- Optimized spacing for all breakpoints

### ⚡ Performance

- Smooth 60fps animations
- Lazy loading for images
- Optimized scroll handling
- Minimal JavaScript overhead

## Upcoming Release Countdown

When you add a future release date in the admin panel:
- Countdown appears on the hero section
- Shows days, hours, and minutes remaining
- Updates in real-time
- Automatically changes to "Out now!" on release day

## Admin Panel

All content is manageable through the `/admin` interface:
- Update band info and social links
- Add/edit/delete releases
- Manage tour dates
- Changes reflect immediately on the site

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)  
✅ Safari (latest)
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile

---

**This is a genuinely unique band website that stands out!** 🚀
