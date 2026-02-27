'use client'

import Link from 'next/link'
import { Moon, MapPin, Calendar, Clock, Users, Ticket, ArrowLeft, Share2 } from 'lucide-react'
import type { TourDate, BandInfo } from '@/types/database'

interface Props {
  show: TourDate
  bandInfo: BandInfo | null
  backgroundImage?: string
}

export default function TourDateClient({ show, bandInfo, backgroundImage }: Props) {
  const date = new Date(show.date)
  const tz = 'Europe/Vienna'
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: tz
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: tz
  })
  
  const isPast = date < new Date()
  
  // Generate Google Maps link
  const mapsQuery = encodeURIComponent(
    `${show.venue}${show.address ? ', ' + show.address : ''}, ${show.city}, ${show.country}`
  )
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

  const handleShare = async () => {
    const shareData = {
      title: `${show.venue} - color the night`,
      text: `color the night live at ${show.venue}, ${show.city}`,
      url: window.location.href
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative">
      {/* Background Image - top third with grainy fade */}
      {backgroundImage && (
        <div className="absolute inset-x-0 top-0 h-[35vh] overflow-hidden pointer-events-none">
          {/* The image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Grainy overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />
          {/* Gradient fade: 50% opacity at top to fully transparent at bottom */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(5, 5, 7, 0.66) 0%, 
                rgba(5, 5, 7, 0.88) 60%,
                rgba(5, 5, 7, 1) 100%
              )`
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-[var(--accent)]/50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="text-sm font-medium text-white">color the night</span>
          </Link>
          
          <Link
            href="/#tour"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors text-white/70 hover:text-white text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Shows</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Event Header */}
          <div className="mb-6">
            {/* Status + Band name */}
            <div className="flex items-center gap-3 mb-3">
              {show.sold_out ? (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium tracking-wide">
                  SOLD OUT
                </span>
              ) : isPast ? (
                <span className="px-3 py-1 bg-white/10 text-white/50 rounded-full text-xs font-medium tracking-wide">
                  PAST EVENT
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  UPCOMING
                </span>
              )}
            </div>

            {/* "color the night @" header */}
            <p className="text-[var(--accent)] text-sm font-medium tracking-wide mb-1">
              color the night @
            </p>
            
            {/* Venue Name */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {show.venue}
            </h1>

            {/* Location */}
            <p className="text-[var(--text-secondary)] text-lg">
              {show.city}, {show.country}
            </p>
          </div>

          {/* Date/Time + Venue Card */}
          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-white/5 overflow-hidden mb-4">
            {/* Date & Time */}
            <div className="p-4 flex items-center gap-4 border-b border-white/5">
              <div className="p-2.5 bg-[var(--accent)]/10 rounded-xl">
                <Calendar className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{formattedDate}</p>
                <p className="text-[var(--accent)] text-sm font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formattedTime}
                </p>
              </div>
            </div>

            {/* Venue Address */}
            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
            >
              <div className="p-2.5 bg-[var(--accent)]/10 rounded-xl">
                <MapPin className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{show.venue}</p>
                {show.address && (
                  <p className="text-[var(--text-secondary)] text-sm truncate">{show.address}</p>
                )}
                <p className="text-[var(--accent)] text-xs mt-1 group-hover:underline">
                  Open in Maps →
                </p>
              </div>
            </a>
          </div>

          {/* Supporting Act */}
          {show.supporting_act && (
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-white/5 p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Support</p>
                  <p className="text-white font-medium">{show.supporting_act}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8">
            {!isPast && !show.sold_out && show.ticket_url && (
              <a
                href={show.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-xl hover:brightness-110 transition-all"
              >
                <Ticket className="w-5 h-5" />
                Get Tickets
              </a>
            )}
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-white/10 rounded-xl hover:border-white/20 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-[var(--text-muted)] text-xs mb-3">Follow for updates</p>
            <div className="flex flex-wrap gap-2">
              {bandInfo?.social_instagram && (
                <a
                  href={bandInfo.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-full border border-white/5 hover:border-white/20 hover:text-white transition-colors text-xs"
                >
                  Instagram
                </a>
              )}
              {bandInfo?.social_spotify && (
                <a
                  href={bandInfo.social_spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded-full border border-white/5 hover:border-white/20 hover:text-white transition-colors text-xs"
                >
                  Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
