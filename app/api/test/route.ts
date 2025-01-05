import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview-questions")
    
    // Perform a simple ping to confirm a successful connection
    await db.command({ ping: 1 })
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully connected to MongoDB!" 
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect to MongoDB' },
      { status: 500 }
    )
  }
} 