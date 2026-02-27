'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Music, Image, Calendar, Mail, X, FileText, Ticket, TicketX, ChevronDown } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faApple, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { useRouter } from 'next/navigation'
import type { Release, TourDate, BandInfo, GalleryImage } from '@/types/database'

interface Props {
  releases: Release[]
  tourDates: TourDate[]
  bandInfo: BandInfo | null
  galleryImages: GalleryImage[]
}

// Floating lights component for party atmosphere
function FloatingLights() {
  // Spread lights more evenly across the screen
  const lights = useMemo(() => [
    { color: 'var(--accent)', size: 350, x: '15%', y: '20%', duration: 12 },
    { color: 'rgba(236, 72, 153, 1)', size: 300, x: '75%', y: '30%', duration: 10 }, // pink
    { color: 'rgba(147, 51, 234, 1)', size: 280, x: '25%', y: '70%', duration: 11 }, // purple
    { color: 'var(--accent)', size: 250, x: '85%', y: '75%', duration: 14 },
    { color: 'rgba(34, 211, 238, 1)', size: 270, x: '50%', y: '45%', duration: 8 }, // cyan
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      {lights.map((light: { color: string; size: number; x: string; y: string; duration: number }, i: number) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: light.size,
            height: light.size,
            left: light.x,
            top: light.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${light.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 80 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 60 * (i % 2 === 0 ? -1 : 1), 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.4, 0.85, 0.4],
          }}
          transition={{
            duration: light.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function HorizontalScroll({ releases, tourDates, bandInfo, galleryImages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [showRoadScream, setShowRoadScream] = useState(false)
  const [showPastEvents, setShowPastEvents] = useState(false)
  
  // Navigate to tour event while preserving back navigation to #tour
  const navigateToEvent = useCallback((eventId: string) => {
    // Replace current history entry with #tour so browser back goes to tour section
    window.history.replaceState(null, '', '/#tour')
    router.push(`/tour/${eventId}`)
  }, [router])
  
  // Split tour dates into upcoming and past
  const { upcomingShows, pastShows } = useMemo(() => {
    const now = new Date()
    const upcoming: TourDate[] = []
    const past: TourDate[] = []
    
    tourDates.forEach(show => {
      const showDate = new Date(show.date)
      if (showDate >= now) {
        upcoming.push(show)
      } else {
        past.push(show)
      }
    })
    
    // Past shows: most recent first
    past.reverse()
    
    return { upcomingShows: upcoming, pastShows: past }
  }, [tourDates])
  
  // Only show the latest/featured release
  const featuredRelease = releases[0] || null
  
  // Check if release is in the future
  const isUpcoming = featuredRelease 
    ? new Date(featuredRelease.release_date) > new Date() 
    : false
  
  // Sections: intro - release - tour - gallery - contact (NEW ORDER)
  const sections = [
    { id: 'intro', icon: Moon },
    ...(featuredRelease ? [{ id: 'release', icon: Music }] : []),
    { id: 'tour', icon: Calendar },
    { id: 'gallery', icon: Image },
    { id: 'connect', icon: Mail }
  ]
  const totalSections = sections.length

  // Handle scroll to update current index
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPos = container.scrollLeft
      const sectionWidth = window.innerWidth
      setCurrentIndex(Math.round(scrollPos / sectionWidth))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Map vertical scroll to horizontal
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      container.scrollBy({ left: e.deltaY * 1.5, behavior: 'smooth' })
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        scrollToSection(Math.min(currentIndex + 1, totalSections - 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToSection(Math.max(currentIndex - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, totalSections])

  const scrollToSection = useCallback((index: number) => {
    containerRef.current?.scrollTo({
      left: index * window.innerWidth,
      behavior: 'smooth'
    })
  }, [])

  // Handle hash navigation (e.g., /#tour) - both on load and on popstate (browser back)
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const sectionIndex = sections.findIndex(s => s.id === hash)
        if (sectionIndex >= 0) {
          // Small delay to ensure container is ready
          setTimeout(() => {
            containerRef.current?.scrollTo({
              left: sectionIndex * window.innerWidth,
              behavior: 'smooth'
            })
            // Clear the hash after scrolling so user can navigate freely
            window.history.replaceState(null, '', '/')
          }, 100)
        }
      }
    }

    // Run on mount
    handleHashNavigation()

    // Also listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleHashNavigation)
    return () => window.removeEventListener('popstate', handleHashNavigation)
  }, [sections])

  const formatDate = (dateStr: string) => {
    // Parse the date without timezone conversion - treat input as is
    const d = new Date(dateStr)
    return {
      day: d.getUTCDate(),
      month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
      year: d.getUTCFullYear(),
      time: d.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'UTC'
      })
    }
  }

  // Get release type styling
  const getReleaseTypeStyle = (type: string) => {
    switch (type) {
      case 'Album':
        return { 
          bg: 'bg-[var(--accent)]', 
          text: 'text-black',
          label: 'Full Album'
        }
      case 'EP':
        return { 
          bg: 'bg-white/10', 
          text: 'text-white',
          label: 'EP'
        }
      case 'Single':
      default:
        return { 
          bg: 'bg-white/10 border border-[var(--accent)]/50', 
          text: 'text-[var(--accent)]',
          label: 'Single'
        }
    }
  }

  return (
    <div className="relative min-h-[100dvh] bg-[var(--bg-primary)]">
      {/* Sticky header - appears after leaving intro */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
          >
            <button 
              onClick={() => scrollToSection(0)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-[var(--accent)]/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <Moon className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <span className="text-sm font-medium text-white">color the night</span>
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Horizontal bar navigation at bottom */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
        {sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(i)}
            className="relative h-1 transition-all duration-300"
            style={{ width: i === currentIndex ? '2rem' : '0.75rem' }}
            aria-label={`Go to ${section.id}`}
          >
            <span 
              className={`block w-full h-full rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-[var(--accent)]' 
                  : 'bg-white/30 hover:bg-white/50'
              }`} 
            />
          </button>
        ))}
      </nav>

      {/* Horizontal scroll container */}
      <div 
        ref={containerRef}
        className="horizontal-scroll flex overflow-x-auto snap-x snap-mandatory h-[100dvh]"
      >
        {/* INTRO */}
        <section className="flex-shrink-0 w-screen h-[100dvh] snap-start relative flex items-center overflow-hidden">
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/videos/band-video.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]/50" />
          
          <div className="container relative z-10">
            <div className="max-w-3xl space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-6 h-6 text-[var(--accent)]" />
                  <p className="text-[var(--accent)] font-medium tracking-[0.3em] uppercase text-sm">
                    {bandInfo?.hero_tagline || 'Indie · Funk · Pop'}
                  </p>
                </div>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tightest leading-none">
                  color<br />the night
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl sm:text-2xl text-[var(--text-secondary)] max-w-xl leading-relaxed"
              >
                {bandInfo?.hero_description || 'We paint after dark. Late-night grooves, neon melodies, and sounds that move.'}
              </motion.p>

              {/* Button sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="space-y-4 pt-6"
              >
                {/* Listen & Follow */}
                <div className="space-y-2">
                  <span className="text-[var(--text-muted)] text-xs tracking-[0.2em] uppercase">Listen & Follow</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {bandInfo?.social_spotify && (
                      <a
                        href={bandInfo.social_spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-[#1DB954]" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faSpotify} />
                        </span>
                        <span className="text-white font-medium text-sm">Spotify</span>
                      </a>
                    )}
                    
                    {bandInfo?.social_apple_music && (
                      <a
                        href={bandInfo.social_apple_music}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-white" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faApple} />
                        </span>
                        <span className="text-white font-medium text-sm">Music</span>
                      </a>
                    )}
                    
                    {bandInfo?.social_youtube && (
                      <a
                        href={bandInfo.social_youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-[#FF0000]" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faYoutube} />
                        </span>
                        <span className="text-white font-medium text-sm">YouTube</span>
                      </a>
                    )}
                    
                    {bandInfo?.social_instagram && (
                      <a
                        href={bandInfo.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-[#E4405F]" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faInstagram} />
                        </span>
                        <span className="text-white font-medium text-sm">Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Quick Links */}
                <div className="space-y-2">
                  <span className="text-[var(--text-muted)] text-xs tracking-[0.2em] uppercase">Connect</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => scrollToSection(sections.findIndex(s => s.id === 'tour'))}
                      className="group flex items-center gap-2 px-4 py-2 backdrop-blur-md rounded-full hover:opacity-90 transition-all"
                      style={{ backgroundColor: 'var(--accent)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">Events</span>
                    </button>
                    
                    <button
                      onClick={() => scrollToSection(sections.findIndex(s => s.id === 'connect'))}
                      className="group flex items-center gap-2 px-4 py-2 rounded-full hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#3b82f6', border: '1px solid rgba(96, 165, 250, 0.5)' }}
                    >
                      <Mail className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">Contact</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Scroll hint - below buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center gap-1 text-[var(--text-muted)] pt-8"
              >
                <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-xl"
                >
                  →
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURED RELEASE */}
        {featuredRelease && (
          <section className="flex-shrink-0 w-screen h-[100dvh] snap-start flex items-center py-12 md:py-20 relative overflow-hidden">
            <FloatingLights />
            <div className="container relative z-10 h-full flex flex-col justify-center">
              {/* Section heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-2 md:mb-4"
              >
                <span className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase font-medium">
                  {isUpcoming ? 'Next Release' : 'Latest Release'}
                </span>
              </motion.div>

              {/* Two-column layout */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-16 lg:gap-24 items-center max-w-6xl">
                {/* Cover art */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative group cursor-pointer w-full max-w-[380px] sm:max-w-[360px] md:max-w-none mx-auto md:mx-0 pb-4 md:pb-0"
                  onClick={() => setLightboxImage(featuredRelease.cover_url)}
                >
                  <div className={`aspect-square rounded-2xl overflow-hidden bg-[var(--bg-elevated)] ${
                    featuredRelease.type === 'Album' ? 'ring-2 ring-[var(--accent)]/30' : ''
                  }`}>
                    <img
                      src={featuredRelease.cover_url}
                      alt={featuredRelease.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div 
                    className={`absolute -inset-3 rounded-3xl blur-2xl -z-10 transition-opacity group-hover:opacity-40 ${
                      featuredRelease.type === 'Album' ? 'opacity-30' : 'opacity-15'
                    }`}
                    style={{ background: `linear-gradient(135deg, var(--accent), transparent)` }}
                  />
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-2 md:space-y-5 text-left md:text-left"
                > 
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {featuredRelease.title}
                  </h2>
                  
                  <p className="text-[var(--text-secondary)] text-base lg:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                    {isUpcoming 
                      ? `${featuredRelease.type === 'Album' ? 'Full album' : featuredRelease.type} dropping ${new Date(featuredRelease.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
                      : `${featuredRelease.type === 'Album' ? 'Full album' : featuredRelease.type} released ${new Date(featuredRelease.release_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`
                    }
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1 justify-left md:justify-start">
                    {featuredRelease.spotify_url && (
                      <a
                        href={featuredRelease.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-[#1DB954]" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faSpotify} />
                        </span>
                        <span className="text-white font-medium text-sm">Spotify</span>
                      </a>
                    )}
                    {featuredRelease.apple_music_url && (
                      <a
                        href={featuredRelease.apple_music_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-white" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faApple} />
                        </span>
                        <span className="text-white font-medium text-sm">Music</span>
                      </a>
                    )}
                    {featuredRelease.youtube_url && (
                      <a
                        href={featuredRelease.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/15 hover:border-white/20 transition-all"
                      >
                        <span className="text-[#FF0000]" style={{ fontSize: '1rem', lineHeight: 1 }}>
                          <FontAwesomeIcon icon={faYoutube} />
                        </span>
                        <span className="text-white font-medium text-sm">YouTube</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* TOUR - Now before Gallery */}
        <section id="tour" className="flex-shrink-0 w-screen h-[100dvh] snap-start flex items-center py-20 relative">
          {/* Background Image - top third with grainy fade */}
          {galleryImages.length > 0 && (
            <div className="absolute inset-x-0 top-0 h-[35vh] overflow-hidden pointer-events-none">
              {/* The image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${galleryImages[0].image_url})` }}
              />
              {/* Grainy overlay */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />
              {/* Gradient fade */}
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

          <FloatingLights />

          <div className="container h-full flex flex-col relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 flex-shrink-0"
            >
              <span className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase font-medium">
                On the{' '}
                <button
                  onClick={() => {
                    setShowRoadScream(true)
                    setTimeout(() => setShowRoadScream(false), 3000)
                  }}
                  className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase font-medium"
                >
                  Road
                </button>
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-2">Tour Dates</h2>
            </motion.div>

            {upcomingShows.length === 0 && pastShows.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-16 border border-dashed border-[var(--text-muted)]/30 rounded-2xl"
              >
                <p className="text-[var(--text-secondary)] text-lg">No upcoming shows</p>
                <p className="text-[var(--text-muted)] mt-2">New dates coming soon. Stay tuned.</p>
              </motion.div>
            ) : (
              <div className="flex-1 overflow-y-auto mt-4 space-y-2 pb-24">
                {/* Upcoming Shows */}
                {upcomingShows.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-[var(--text-muted)]/20 rounded-xl mb-4">
                    <p className="text-[var(--text-secondary)]">No upcoming shows</p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Check back soon for new dates</p>
                  </div>
                ) : (
                  upcomingShows.map((show, i) => {
                    const { day, month, time } = formatDate(show.date)
                    return (
                      <motion.div
                        key={show.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <button
                          onClick={() => navigateToEvent(show.id)}
                          className="w-full flex items-center rounded-xl border border-white/5 hover:border-[var(--accent)]/30 transition-all group"
                          style={{ 
                            textAlign: 'left', 
                            backgroundColor: 'var(--bg-elevated)',
                            padding: '0.5rem',
                            gap: '1rem'
                          }}
                        >
                          {/* Date + Time stacked */}
                          <div className="text-center flex-shrink-0 w-12">
                            <div className="text-[var(--accent)] text-[10px] tracking-widest font-medium">{month}</div>
                            <div className="text-xl font-bold leading-none">{day}</div>
                            <div className="text-[var(--text-muted)] text-[10px] mt-0.5">{time}</div>
                          </div>

                          {/* Venue & Location */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-sm sm:text-base">{show.venue}</h3>
                            <p className="text-[var(--text-secondary)] text-xs sm:text-sm truncate">
                              {show.city}, {show.country}
                            </p>
                            {show.supporting_act && (
                              <p className="text-[var(--text-muted)] text-[10px] truncate">w/ {show.supporting_act}</p>
                            )}
                          </div>

                          {/* Status icon + arrow */}
                          <div className="flex-shrink-0 flex items-center gap-2">
                            {show.sold_out ? (
                              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center">
                                <TicketX className="w-3.5 h-3.5 text-red-400" />
                              </div>
                            ) : show.ticket_url ? (
                              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                            ) : null}
                            <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
                              →
                            </span>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })
                )}

                {/* Past Shows Section */}
                {pastShows.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <button
                      onClick={() => setShowPastEvents(!showPastEvents)}
                      className="w-full flex items-center justify-between py-2 px-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      <span className="text-xs tracking-[0.2em] uppercase font-medium">
                        Past Events ({pastShows.length})
                      </span>
                      <motion.div
                        animate={{ rotate: showPastEvents ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showPastEvents && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 pt-2">
                            {pastShows.map((show, i) => {
                              const { day, month, time } = formatDate(show.date)
                              return (
                                <motion.div
                                  key={show.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.02 }}
                                >
                                  <div
                                    className="w-full flex items-center rounded-xl border border-white/5 opacity-50"
                                    style={{ 
                                      textAlign: 'left', 
                                      backgroundColor: 'var(--bg-elevated)',
                                      padding: '0.5rem',
                                      gap: '1rem'
                                    }}
                                  >
                                    {/* Date + Time stacked - muted */}
                                    <div className="text-center flex-shrink-0 w-12">
                                      <div className="text-[var(--text-muted)] text-[10px] tracking-widest font-medium">{month}</div>
                                      <div className="text-xl font-bold leading-none text-[var(--text-muted)]">{day}</div>
                                      <div className="text-[var(--text-muted)] text-[10px] mt-0.5">{time}</div>
                                    </div>

                                    {/* Venue & Location */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold truncate text-sm sm:text-base text-[var(--text-secondary)]">{show.venue}</h3>
                                      <p className="text-[var(--text-muted)] text-xs sm:text-sm truncate">
                                        {show.city}, {show.country}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* GALLERY - Marquee style */}
        <section className="flex-shrink-0 w-screen h-[100dvh] snap-start flex flex-col justify-center overflow-hidden relative">
          <FloatingLights />
          {/* Header */}
          <div className="container mb-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <span className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase font-medium">
                Gallery
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-2">Impressions</h2>
              <p className="text-[var(--text-secondary)] text-base mt-3 mb-6">
                Fragments from the road. 
              </p>
            </motion.div>
          </div>

          {galleryImages.length > 0 ? (
            <div className="space-y-4 relative z-10">
              {/* Row 1 - scrolling left */}
              <div className="relative overflow-hidden">
                <div className="flex gap-4 marquee-left" style={{ width: 'max-content' }}>
                  {/* Duplicate images for seamless loop */}
                  {[...galleryImages, ...galleryImages].map((image, i) => (
                    <button
                      key={`row1-${i}`}
                      onClick={() => setLightboxImage(image.image_url)}
                      className="flex-shrink-0 w-48 sm:w-64 lg:w-72 aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-elevated)] group relative"
                    >
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2 - scrolling right */}
              <div className="relative overflow-hidden">
                <div className="flex gap-4 marquee-right" style={{ width: 'max-content' }}>
                  {/* Duplicate images for seamless loop (reversed order for variety) */}
                  {[...galleryImages].reverse().concat([...galleryImages].reverse()).map((image, i) => (
                    <button
                      key={`row2-${i}`}
                      onClick={() => setLightboxImage(image.image_url)}
                      className="flex-shrink-0 w-48 sm:w-64 lg:w-72 aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-elevated)] group relative"
                    >
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="text-center py-16 text-[var(--text-muted)] border border-dashed border-[var(--text-muted)]/30 rounded-2xl">
                <p className="text-base">Gallery coming soon</p>
                <p className="text-sm mt-2">Add photos in the admin panel</p>
              </div>
            </div>
          )}
        </section>

        {/* CONNECT - Now last */}
        <section className="flex-shrink-0 w-screen h-[100dvh] snap-start flex items-center py-20 relative overflow-hidden">
          <FloatingLights />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                <span className="text-[var(--accent)] text-sm tracking-[0.3em] uppercase font-medium">
                  About
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold">Get in touch</h2>
                <p className="text-[var(--text-secondary)] text-base lg:text-lg leading-relaxed">
                  {bandInfo?.bio || 'color the night — indie-funk-pop band painting after dark since day one.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {bandInfo?.contact_email && (
                    <a
                      href={`mailto:${bandInfo.contact_email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-full hover:scale-105 transition-transform"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Us</span>
                    </a>
                  )}
                  {bandInfo?.press_kit_url && (
                    <a
                      href={bandInfo.press_kit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-white/10 font-medium rounded-full hover:border-white/30 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Press Kit</span>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-5"
              >
                <span className="text-[var(--text-muted)] text-sm tracking-[0.3em] uppercase">
                  Follow Us
                </span>
                <div className="grid gap-3">
                  {[
                    { name: 'Instagram', url: bandInfo?.social_instagram },
                    { name: 'Spotify', url: bandInfo?.social_spotify },
                    { name: 'YouTube', url: bandInfo?.social_youtube },
                    { name: 'Facebook', url: bandInfo?.social_facebook },
                  ].filter(link => link.url).map(link => (
                    <a
                      key={link.name}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-xl border border-white/5 hover:border-[var(--accent)]/30 transition-all hover:translate-x-1 group"
                    >
                      <span className="font-medium">{link.name}</span>
                      <span className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">↗</span>
                    </a>
                  ))}
                </div>
                
                <p className="text-[var(--text-muted)] text-sm pt-4">
                  © {new Date().getFullYear()} color the night. All rights reserved
                  <span className="mx-2">·</span>
                  <a 
                    href="mailto:ferdinand.zangerl@gmail.com"
                    className="hover:text-[var(--text-secondary)] transition-colors"
                  >
                    website by fz
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

       {/* Easter Egg: ROAD SCREAM */}
       <AnimatePresence>
         {showRoadScream && (
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ 
               opacity: [0, 1, 1, 0],
               scale: [0.8, 1.05, 1, 1.1]
             }}
             exit={{ opacity: 0 }}
             transition={{ 
               duration: 2.5,
               times: [0, 0.2, 0.8, 1],
               ease: "easeOut"
             }}
             className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4"
           >
             <motion.div
               animate={{
                 y: [0, -15, 0, -10, 0],
               }}
               transition={{
                 duration: 0.5,
                 repeat: 2,
                 ease: "easeOut"
               }}
               className="text-center"
               style={{
                 textShadow: '0 0 60px var(--accent)',
               }}
             >
               <div className="text-[18vw] sm:text-[12vw] lg:text-[15vw] font-black tracking-tighter text-[var(--accent)] leading-none">
                 ROOOAD!!!
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Lightbox */}
       <AnimatePresence>
         {lightboxImage && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8"
             onClick={() => setLightboxImage(null)}
           >
             <motion.img
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               src={lightboxImage}
               alt="Gallery image"
               className="max-w-full max-h-full object-contain rounded-lg"
               onClick={e => e.stopPropagation()}
             />
             <button
               onClick={() => setLightboxImage(null)}
               className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
             >
               <X className="w-5 h-5 sm:w-6 sm:h-6" />
             </button>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}
