import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("interview-questions")
    const questions = db.collection("questions")
    
    // Get unique categories
    const categories = await questions.distinct("category")
    
    return NextResponse.json({ 
      success: true, 
      data: categories 
    })
  } catch (error) {
    console.error('MongoDB error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 