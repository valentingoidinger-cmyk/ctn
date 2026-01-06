# Adding Band Photos to the Gallery 📸

The gallery section displays 6 photos in a beautiful grid layout. Here's how to add your photos:

## Quick Steps

1. **Prepare your photos**
   - Square format (1:1 aspect ratio) works best
   - Recommended size: 1000x1000px or larger
   - Format: JPG or PNG
   - Optimize for web (keep under 500KB each)

2. **Add photos to the project**
   ```bash
   # Place your photos in the public/images folder
   public/images/band-1.jpg
   public/images/band-2.jpg
   public/images/band-3.jpg
   public/images/band-4.jpg
   public/images/band-5.jpg
   public/images/band-6.jpg
   ```

3. **Uncomment the image code**
   
   Open `src/components/HorizontalScroll.tsx` and find the Gallery section (around line 283).
   
   **Replace this:**
   ```tsx
   {/* Placeholder - replace with actual images */}
   <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
     Add photo {i + 1}
   </div>
   {/* When you have images, use this:
   <img
     src={img}
     alt={`Band photo ${i + 1}`}
     className="w-full h-full object-cover"
   />
   */}
   ```

   **With this:**
   ```tsx
   <img
     src={img}
     alt={`Band photo ${i + 1}`}
     className="w-full h-full object-cover"
   />
   ```

4. **Refresh your browser** and scroll to the Gallery section!

## Tips for Great Gallery Photos

✅ **Mix it up**: Live shots, studio photos, behind-the-scenes
✅ **Consistent style**: Similar lighting/editing for a cohesive look
✅ **High quality**: Sharp, well-lit images
✅ **Square crops**: Crop your images to 1:1 before uploading
✅ **Web optimization**: Use tools like TinyPNG to compress

## Changing the Number of Photos

Want more or fewer than 6 photos?

In `src/components/HorizontalScroll.tsx`, find the `galleryImages` array (around line 86) and add/remove entries:

```tsx
const galleryImages = [
  '/images/band-1.jpg',
  '/images/band-2.jpg',
  '/images/band-3.jpg',
  '/images/band-4.jpg',
  '/images/band-5.jpg',
  '/images/band-6.jpg',
  '/images/band-7.jpg',  // Add more!
  '/images/band-8.jpg',
]
```

The grid will automatically adjust!

---

**Don't have professional photos yet?** No problem! You can:
- Use iPhone/smartphone photos (good lighting is key)
- Take photos at your next rehearsal or gig
- Commission a photographer for a proper shoot
- Use AI-generated placeholder images temporarily
