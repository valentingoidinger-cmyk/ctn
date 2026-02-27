import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  // First get current count
  const { data: current } = await supabase
    .from('keepalive')
    .select('ping_count')
    .eq('id', 1)
    .single()

  const newCount = (current?.ping_count || 0) + 1

  // Update the keepalive counter
  const { data, error } = await supabase
    .from('keepalive')
    .update({ 
      ping_count: newCount,
      last_ping: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    console.error('Keepalive error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Keepalive ping successful',
    last_ping: data?.last_ping,
    ping_count: data?.ping_count
  })
}
