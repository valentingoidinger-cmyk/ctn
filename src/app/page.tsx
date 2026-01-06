import HorizontalScroll from '@/components/HorizontalScroll'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch all data
  const [
    { data: releases },
    { data: tourDates },
    { data: bandInfo },
    { data: galleryImages }
  ] = await Promise.all([
    supabase.from('releases').select('*').order('order', { ascending: true }),
    supabase.from('tour_dates').select('*').order('date', { ascending: true }),
    supabase.from('band_info').select('*').single(),
    supabase.from('gallery_images').select('*').order('order', { ascending: true })
  ])

  return (
    <HorizontalScroll 
      releases={releases || []}
      tourDates={tourDates || []}
      bandInfo={bandInfo}
      galleryImages={galleryImages || []}
    />
  )
}
