import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { NextRequest } from 'next/server';

interface QueryFilter {
  category?: string;
  subCategory?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    
    const client = await clientPromise;
    const db = client.db('interview-questions');
    const questions = db.collection('questions');
    
    // Build query based on provided filters
    const query: QueryFilter = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    
    // Fetch questions with filters
    const result = await questions.find(query).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 