import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Password is stored in environment variable - NEVER in source code
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin password not configured. Please set ADMIN_PASSWORD in .env' },
        { status: 500 }
      )
    }
    
    if (password === ADMIN_PASSWORD) {
      // Create a simple auth token (in production, use JWT or similar)
      const authToken = Buffer.from(`${Date.now()}-${ADMIN_PASSWORD}`).toString('base64')
      
      const response = NextResponse.json({ success: true })
      
      // Set cookie for 30 days
      response.cookies.set('admin_auth', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      
      return response
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin_auth')
    
    if (!authCookie || !ADMIN_PASSWORD) {
      return NextResponse.json({ authenticated: false })
    }
    
    // Verify the token contains our password hash
    const decoded = Buffer.from(authCookie.value, 'base64').toString()
    const isValid = decoded.includes(ADMIN_PASSWORD)
    
    return NextResponse.json({ authenticated: isValid })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_auth')
  return response
}
