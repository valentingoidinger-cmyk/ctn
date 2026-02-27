import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `cover-${timestamp}.${extension}`

  // Upload to Supabase Storage (using same gallery bucket or create 'releases' bucket)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(`covers/${filename}`, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(`covers/${filename}`)

  return NextResponse.json({ 
    url: urlData.publicUrl,
    path: uploadData.path 
  })
}
