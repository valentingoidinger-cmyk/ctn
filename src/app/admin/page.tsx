'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Music, Image, Calendar, Settings, LogOut, Check, X, Plus, Trash2, Edit3, ExternalLink, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { BandInfo, Release, TourDate, GalleryImage } from '@/types/database'

// ============ LOGIN SCREEN ============
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        onLogin()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#111118] border-white/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl text-white">color the night</CardTitle>
          <CardDescription className="text-gray-400">Enter password to access admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg bg-black/40 border-white/10 text-white placeholder:text-gray-500"
                autoFocus
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              disabled={loading || !password}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============ MAIN ADMIN PANEL ============
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState('info')

  // Check auth on load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch {
      setIsAuthenticated(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-white">
              <a href="/" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation - Mobile Friendly */}
          <TabsList className="w-full h-auto flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="info" 
              className="flex-1 min-w-[120px] h-14 text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black bg-white/5 border border-white/10"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Band Info</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger 
              value="releases" 
              className="flex-1 min-w-[120px] h-14 text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black bg-white/5 border border-white/10"
            >
              <Music className="w-5 h-5" />
              <span className="hidden sm:inline">Releases</span>
              <span className="sm:hidden">Music</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tours" 
              className="flex-1 min-w-[120px] h-14 text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black bg-white/5 border border-white/10"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Tour Dates</span>
              <span className="sm:hidden">Tours</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="flex-1 min-w-[120px] h-14 text-base gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black bg-white/5 border border-white/10"
            >
              <Image className="w-5 h-5" />
              <span>Gallery</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <BandInfoTab />
          </TabsContent>
          <TabsContent value="releases" className="mt-6">
            <ReleasesTab />
          </TabsContent>
          <TabsContent value="tours" className="mt-6">
            <ToursTab />
          </TabsContent>
          <TabsContent value="gallery" className="mt-6">
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// ============ BAND INFO TAB ============
function BandInfoTab() {
  const [info, setInfo] = useState<BandInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/band-info').then(r => r.json()).then(setInfo).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!info) return
    setSaving(true)
    await fetch('/api/band-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <LoadingState />
  if (!info) return <div className="text-center text-gray-400 py-12">No data found</div>

  const colorPresets = ['#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#22c55e', '#ef4444', '#3b82f6']

  return (
    <div className="space-y-6">
      {/* Theme Color */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🎨</span> Theme Color
          </CardTitle>
          <CardDescription>Pick your accent color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {colorPresets.map(color => (
              <button
                key={color}
                onClick={() => setInfo({ ...info, accent_color: color })}
                className={`w-14 h-14 rounded-xl transition-transform hover:scale-110 ${info.accent_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111118]' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
            <label className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform">
              <input
                type="color"
                value={info.accent_color || '#f59e0b'}
                onChange={(e) => setInfo({ ...info, accent_color: e.target.value })}
                className="sr-only"
              />
              <span className="text-white text-lg">+</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Homepage Text */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🏠</span> Homepage
          </CardTitle>
          <CardDescription>Text that appears on the main page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base text-white">Tagline</Label>
            <Input
              value={info.hero_tagline || ''}
              onChange={(e) => setInfo({ ...info, hero_tagline: e.target.value })}
              placeholder="We paint after dark"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-base text-white">Description</Label>
            <Textarea
              value={info.hero_description || ''}
              onChange={(e) => setInfo({ ...info, hero_description: e.target.value })}
              placeholder="Late-night grooves, neon melodies..."
              className="min-h-[120px] text-lg bg-black/40 border-white/10 text-white resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">📧</span> Contact Page
          </CardTitle>
          <CardDescription>About section on the contact page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base text-white">About Text</Label>
            <Textarea
              value={info.bio || ''}
              onChange={(e) => setInfo({ ...info, bio: e.target.value })}
              placeholder="color the night — indie-funk-pop band painting after dark since day one."
              className="min-h-[100px] text-lg bg-black/40 border-white/10 text-white resize-none"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-base text-white">Email</Label>
            <Input
              type="email"
              value={info.contact_email || ''}
              onChange={(e) => setInfo({ ...info, contact_email: e.target.value })}
              placeholder="hello@colorthenight.com"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-base text-white">Press Kit Link</Label>
            <Input
              type="url"
              value={info.press_kit_url || ''}
              onChange={(e) => setInfo({ ...info, press_kit_url: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🔗</span> Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { key: 'social_spotify', label: 'Spotify', placeholder: 'https://open.spotify.com/...' },
            { key: 'social_apple_music', label: 'Apple Music', placeholder: 'https://music.apple.com/...' },
            { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
            { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-3">
              <Label className="text-base text-white">{label}</Label>
              <Input
                type="url"
                value={(info as Record<string, string>)[key] || ''}
                onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                placeholder={placeholder}
                className="h-14 text-lg bg-black/40 border-white/10 text-white"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button - Sticky at bottom */}
      <div className="sticky bottom-4 pt-4">
        <Button 
          onClick={save} 
          disabled={saving}
          className="w-full h-16 text-xl font-semibold bg-amber-500 hover:bg-amber-600 text-black"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : saved ? <><Check className="w-6 h-6 mr-2" /> Saved!</> : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

// ============ RELEASES TAB ============
function ReleasesTab() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Release | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchReleases = async () => {
    const data = await fetch('/api/releases').then(r => r.json())
    setReleases(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReleases() }, [])

  const save = async (release: Release) => {
    const method = isNew ? 'POST' : 'PUT'

    // Clean up data for new releases - remove empty id and created_at
    const payload = isNew
      ? {
          title: release.title,
          type: release.type,
          cover_url: release.cover_url,
          release_date: release.release_date,
          spotify_url: release.spotify_url || null,
          apple_music_url: release.apple_music_url || null,
          youtube_url: release.youtube_url || null,
          order: release.order,
          is_featured: release.is_featured
        }
      : release

    try {
      const response = await fetch('/api/releases', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to save: ${error.error || 'Unknown error'}`)
        return
      }
      
      setEditing(null)
      setIsNew(false)
      fetchReleases()
    } catch (error) {
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }

  const toggleFeatured = async (release: Release) => {
    // Set all others to not featured, this one to featured
    for (const r of releases) {
      if (r.id !== release.id && r.is_featured) {
        await fetch('/api/releases', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...r, is_featured: false, order: 1 })
        })
      }
    }
    await fetch('/api/releases', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...release, is_featured: true, order: 0 })
    })
    fetchReleases()
  }

  const deleteRelease = async (id: string) => {
    if (!confirm('Delete this release?')) return
    await fetch(`/api/releases?id=${id}`, { method: 'DELETE' })
    fetchReleases()
  }

  if (loading) return <LoadingState />

  if (editing) {
    return (
      <ReleaseForm 
        release={editing} 
        onSave={save} 
        onCancel={() => { setEditing(null); setIsNew(false) }}
        isNew={isNew}
      />
    )
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => { 
          setEditing({ 
            id: '', title: '', type: 'Single', cover_url: '', release_date: '', 
            order: releases.length, created_at: '', is_featured: releases.length === 0 
          })
          setIsNew(true)
        }}
        className="w-full h-16 text-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      >
        <Plus className="w-6 h-6 mr-2" /> Add New Release
      </Button>

      {releases.length === 0 ? (
        <Card className="bg-[#111118] border-white/10">
          <CardContent className="py-12 text-center text-gray-400">
            No releases yet. Add your first one!
          </CardContent>
        </Card>
      ) : (
        releases.map(release => (
          <Card key={release.id} className="bg-[#111118] border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-stretch">
                {/* Cover */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-black/40">
                  {release.cover_url ? (
                    <img src={release.cover_url} alt={release.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Music className="w-8 h-8" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-semibold text-white text-lg truncate">{release.title}</h3>
                    <p className="text-gray-400 text-sm">{release.type} • {new Date(release.release_date).getFullYear()}</p>
                  </div>
                  
                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => toggleFeatured(release)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        release.is_featured || release.order === 0
                          ? 'bg-amber-500 text-black' 
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {release.is_featured || release.order === 0 ? '⭐ Featured' : 'Set Featured'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col border-l border-white/10">
                  <button 
                    onClick={() => setEditing(release)}
                    className="flex-1 px-4 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteRelease(release.id)}
                    className="flex-1 px-4 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors border-t border-white/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

function ReleaseForm({ release, onSave, onCancel, isNew }: { 
  release: Release, 
  onSave: (r: Release) => void, 
  onCancel: () => void,
  isNew: boolean 
}) {
  const [form, setForm] = useState(release)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadCover = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/releases/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
      
      const { url } = await response.json()
      setForm({ ...form, cover_url: url })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{isNew ? 'Add Release' : 'Edit Release'}</h2>
        <Button variant="ghost" onClick={onCancel} className="text-gray-400">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Card className="bg-[#111118] border-white/10">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base text-white">Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Release title"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Type</Label>
            <div className="flex gap-2">
              {(['Single', 'EP', 'Album'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, type })}
                  className={`flex-1 h-14 rounded-xl font-medium transition-colors ${
                    form.type === type 
                      ? 'bg-amber-500 text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Cover Image</Label>
            
            {/* Upload area */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${uploading 
                  ? 'border-amber-500/50 bg-amber-500/5 pointer-events-none' 
                  : 'border-white/20 hover:border-amber-500/50 hover:bg-white/5'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                className="hidden"
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📤</span>
                  <span className="text-gray-400">Upload cover image</span>
                </div>
              )}
            </div>

            {/* URL input */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">or paste URL:</span>
              <Input
                type="url"
                value={form.cover_url}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                placeholder="https://..."
                className="h-10 text-sm bg-black/40 border-white/10 text-white flex-1"
              />
            </div>

            {/* Preview */}
            {form.cover_url && (
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-black/40">
                <img src={form.cover_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Release Date</Label>
            <Input
              type="date"
              value={form.release_date?.split('T')[0] || ''}
              onChange={(e) => setForm({ ...form, release_date: e.target.value })}
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Spotify URL</Label>
            <Input
              type="url"
              value={form.spotify_url || ''}
              onChange={(e) => setForm({ ...form, spotify_url: e.target.value })}
              placeholder="https://open.spotify.com/..."
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Apple Music URL</Label>
            <Input
              type="url"
              value={form.apple_music_url || ''}
              onChange={(e) => setForm({ ...form, apple_music_url: e.target.value })}
              placeholder="https://music.apple.com/..."
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">YouTube URL</Label>
            <Input
              type="url"
              value={form.youtube_url || ''}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://youtube.com/..."
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={() => onSave(form)}
          className="flex-1 h-16 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-black"
        >
          <Check className="w-6 h-6 mr-2" /> Save
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="h-16 px-8 text-lg border-white/10 text-white hover:bg-white/5"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// ============ TOURS TAB ============
function ToursTab() {
  const [tours, setTours] = useState<TourDate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TourDate | null>(null)
  const [isNew, setIsNew] = useState(false)

  const fetchTours = async () => {
    const data = await fetch('/api/tour-dates').then(r => r.json())
    setTours(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchTours() }, [])

  const save = async (tour: TourDate) => {
    const method = isNew ? 'POST' : 'PUT'

    // Convert Vienna time input to UTC for storage
    const dateValue = tour.date ? viennaToUTC(tour.date) : null

    // Clean up data for new tours - remove empty id and created_at
    const payload = isNew
      ? {
          date: dateValue,
          venue: tour.venue,
          address: tour.address || null,
          city: tour.city,
          country: tour.country,
          ticket_url: tour.ticket_url || null,
          sold_out: tour.sold_out || false,
          supporting_act: tour.supporting_act || null
        }
      : { ...tour, date: dateValue }

    try {
      const response = await fetch('/api/tour-dates', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to save: ${error.error || 'Unknown error'}`)
        return
      }
      
      setEditing(null)
      setIsNew(false)
      fetchTours()
    } catch (error) {
      alert(`Failed to save: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }

  const toggleSoldOut = async (tour: TourDate) => {
    await fetch('/api/tour-dates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...tour, sold_out: !tour.sold_out })
    })
    fetchTours()
  }

  const deleteTour = async (id: string) => {
    if (!confirm('Delete this tour date?')) return
    await fetch(`/api/tour-dates?id=${id}`, { method: 'DELETE' })
    fetchTours()
  }

  if (loading) return <LoadingState />

  if (editing) {
    return (
      <TourForm 
        tour={editing} 
        onSave={save} 
        onCancel={() => { setEditing(null); setIsNew(false) }}
        isNew={isNew}
      />
    )
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={() => { 
          setEditing({ 
            id: '', date: '', venue: '', city: '', country: '', 
            sold_out: false, created_at: '' 
          })
          setIsNew(true)
        }}
        className="w-full h-16 text-lg bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      >
        <Plus className="w-6 h-6 mr-2" /> Add Tour Date
      </Button>

      {tours.length === 0 ? (
        <Card className="bg-[#111118] border-white/10">
          <CardContent className="py-12 text-center text-gray-400">
            No tour dates yet. Add your first show!
          </CardContent>
        </Card>
      ) : (
        tours.map(tour => (
          <Card key={tour.id} className={`bg-[#111118] border-white/10 ${tour.sold_out ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 font-mono text-sm">
                      {new Date(tour.date).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(tour.date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-lg truncate">{tour.venue}</h3>
                  <p className="text-gray-400 text-sm">{tour.city}, {tour.country}</p>
                  {tour.supporting_act && (
                    <p className="text-blue-400 text-sm mt-1">w/ {tour.supporting_act}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Sold Out Toggle */}
                  <button
                    onClick={() => toggleSoldOut(tour)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      tour.sold_out 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {tour.sold_out ? 'Sold Out' : 'Available'}
                  </button>
                  
                  <button 
                    onClick={() => setEditing(tour)}
                    className="p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteTour(tour.id)}
                    className="p-3 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

// Helper to format date for datetime-local input (displays in Vienna time)
function formatDateForInput(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    // Format in Vienna timezone for display
    const viennaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }))
    const year = viennaDate.getFullYear()
    const month = String(viennaDate.getMonth() + 1).padStart(2, '0')
    const day = String(viennaDate.getDate()).padStart(2, '0')
    const hours = String(viennaDate.getHours()).padStart(2, '0')
    const minutes = String(viennaDate.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

// Helper to convert Vienna time input to UTC for storage
function viennaToUTC(dateString: string): string {
  if (!dateString) return ''
  // dateString is in format YYYY-MM-DDTHH:MM (Vienna time)
  // We need to convert it to UTC
  const [datePart, timePart] = dateString.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  
  // Create date assuming Vienna timezone
  // Vienna is UTC+1 (CET) or UTC+2 (CEST during summer)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Vienna',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  })
  
  // Create a date and adjust for Vienna offset
  const testDate = new Date(year, month - 1, day, hours, minutes)
  const viennaOffset = getViennaOffset(testDate)
  const utcDate = new Date(testDate.getTime() - viennaOffset)
  
  return utcDate.toISOString()
}

// Get Vienna timezone offset in milliseconds
function getViennaOffset(date: Date): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const viennaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Vienna' }))
  return viennaDate.getTime() - utcDate.getTime()
}

function TourForm({ tour, onSave, onCancel, isNew }: { 
  tour: TourDate, 
  onSave: (t: TourDate) => void, 
  onCancel: () => void,
  isNew: boolean 
}) {
  const [form, setForm] = useState(tour)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{isNew ? 'Add Tour Date' : 'Edit Tour Date'}</h2>
        <Button variant="ghost" onClick={onCancel} className="text-gray-400">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Card className="bg-[#111118] border-white/10">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base text-white">Date & Time</Label>
            <Input
              type="datetime-local"
              value={formatDateForInput(form.date)}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Venue Name</Label>
            <Input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="The Fillmore"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Address (optional)</Label>
            <Input
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Main St"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-base text-white">City</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="San Francisco"
                className="h-14 text-lg bg-black/40 border-white/10 text-white"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-base text-white">Country</Label>
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="USA"
                className="h-14 text-lg bg-black/40 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Supporting Act (optional)</Label>
            <Input
              value={form.supporting_act || ''}
              onChange={(e) => setForm({ ...form, supporting_act: e.target.value })}
              placeholder="Opening band"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base text-white">Ticket Link (optional)</Label>
            <Input
              type="url"
              value={form.ticket_url || ''}
              onChange={(e) => setForm({ ...form, ticket_url: e.target.value })}
              placeholder="https://..."
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className="text-base text-white">Sold Out?</Label>
            <Switch
              checked={form.sold_out}
              onCheckedChange={(checked) => setForm({ ...form, sold_out: checked })}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          onClick={() => onSave(form)}
          className="flex-1 h-16 text-lg font-semibold bg-amber-500 hover:bg-amber-600 text-black"
        >
          <Check className="w-6 h-6 mr-2" /> Save
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="h-16 px-8 text-lg border-white/10 text-white hover:bg-white/5"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// ============ GALLERY TAB ============
function GalleryTab() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [localImages, setLocalImages] = useState<{ filename: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchImages = async () => {
    const [gallery, local] = await Promise.all([
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/local-images').then(r => r.json())
    ])
    setImages(gallery || [])
    setLocalImages(local || [])
    setLoading(false)
  }

  useEffect(() => { fetchImages() }, [])

  const addImage = async (url: string) => {
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: url, caption: '', order: images.length })
    })
    setNewUrl('')
    fetchImages()
  }

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }
      
      const { url } = await response.json()
      await addImage(url)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const deleteImage = async (id: string) => {
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
    fetchImages()
  }

  if (loading) return <LoadingState />

  const availableLocal = localImages.filter(l => !images.some(i => i.image_url === l.url))

  return (
    <div className="space-y-6">
      {/* Upload Image */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <span className="text-2xl">📤</span> Upload Image
          </CardTitle>
          <CardDescription>Upload directly to cloud storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${dragActive 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {uploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📷</div>
                <p className="text-white font-medium">Drop image here or tap to select</p>
                <p className="text-gray-500 text-sm">JPG, PNG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add from URL */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <span className="text-2xl">🔗</span> Add from URL
          </CardTitle>
          <CardDescription>Paste a link to an existing image</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-14 text-lg bg-black/40 border-white/10 text-white"
            />
            <Button
              onClick={() => addImage(newUrl)}
              disabled={!newUrl}
              className="h-14 px-6 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Local Images Quick Add */}
      {availableLocal.length > 0 && (
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-400 text-lg">📁 Local Images ({availableLocal.length})</CardTitle>
            <CardDescription className="text-emerald-300/70">Tap to add from public/images folder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {availableLocal.map((img) => (
                <button
                  key={img.filename}
                  onClick={() => addImage(img.url)}
                  className="w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 transition-all hover:scale-105"
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Gallery */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Gallery Images ({images.length})</h3>
        {images.length === 0 ? (
          <Card className="bg-[#111118] border-white/10">
            <CardContent className="py-12 text-center text-gray-400">
              No images yet. Add some photos!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-black/40">
                <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============ LOADING STATE ============
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  )
}
