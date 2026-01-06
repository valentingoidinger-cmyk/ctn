import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import TourDateClient from './TourDateClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: show } = await supabase
    .from('tour_dates')
    .select('*')
    .eq('id', id)
    .single()
  
  if (!show) {
    return { title: 'Show Not Found' }
  }
  
  const date = new Date(show.date)
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  
  return {
    title: `${show.venue} - ${formattedDate} | color the night`,
    description: `color the night live at ${show.venue}, ${show.city}, ${show.country} on ${formattedDate}`,
  }
}

export default async function TourDatePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const [{ data: show }, { data: bandInfo }, { data: galleryImages }] = await Promise.all([
    supabase.from('tour_dates').select('*').eq('id', id).single(),
    supabase.from('band_info').select('*').single(),
    supabase.from('gallery_images').select('*').order('order', { ascending: true })
  ])
  
  if (!show) {
    notFound()
  }

  // Pick a random gallery image for the background
  const randomImage = galleryImages && galleryImages.length > 0
    ? galleryImages[Math.floor(Math.random() * galleryImages.length)]
    : null

  return <TourDateClient show={show} bandInfo={bandInfo} backgroundImage={randomImage?.image_url} />
}
