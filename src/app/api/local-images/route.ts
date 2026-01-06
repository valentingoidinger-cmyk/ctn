import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json([])
    }
    
    // Read all files
    const files = fs.readdirSync(imagesDir)
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']
    const images = files
      .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
      .map(file => ({
        filename: file,
        url: `/images/${file}`
      }))
    
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error scanning local images:', error)
    return NextResponse.json([])
  }
}
