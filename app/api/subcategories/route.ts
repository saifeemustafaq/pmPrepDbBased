import { NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    
    const client = await clientPromise
    const db = client.db("interview-questions")
    const questions = db.collection("questions")
    
    // Get unique subcategories for the specified category
    const query = category ? { category } : {}
    const subcategories = await questions.distinct("subCategory", query)
    
    return NextResponse.json({ 
      success: true, 
      data: subcategories 
    })
  } catch (error) {
    console.error('MongoDB error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subcategories' },
      { status: 500 }
    )
  }
} 