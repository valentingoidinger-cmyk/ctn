export type TourDate = {
  id: string
  date: string
  venue: string
  address?: string
  city: string
  country: string
  ticket_url?: string
  sold_out: boolean
  supporting_act?: string
  created_at: string
}

export type BandInfo = {
  id: string
  bio: string
  hero_tagline?: string
  hero_description?: string
  accent_color?: string
  press_kit_url?: string
  contact_email?: string
  social_instagram?: string
  social_facebook?: string
  social_spotify?: string
  social_apple_music?: string
  social_youtube?: string
  updated_at: string
}

export type Release = {
  id: string
  title: string
  type: 'EP' | 'Single' | 'Album'
  cover_url: string
  release_date: string
  spotify_url?: string
  apple_music_url?: string
  youtube_url?: string
  order: number
  is_featured?: boolean
  created_at: string
}

export type GalleryImage = {
  id: string
  image_url: string
  caption?: string
  order: number
  created_at: string
}
