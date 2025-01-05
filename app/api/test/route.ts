import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

export async function GET() {
  try {
    console.log('Test API: Connecting to MongoDB...');
    const client = await clientPromise
    const db = client.db("interview-questions")
    const questions = db.collection('questions')
    
    // Get collection stats
    const count = await questions.countDocuments()
    const sample = await questions.find().limit(1).toArray()
    
    return NextResponse.json({ 
      success: true,
      count,
      sample,
      database: db.databaseName,
      collection: questions.collectionName
    })
  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Test endpoint failed',
    }, { status: 500 })
  }
} 