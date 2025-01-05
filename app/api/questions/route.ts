import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { NextRequest } from 'next/server';

interface QueryFilter {
  category?: string;
  subCategory?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching questions...');
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
    console.log('API: Found questions:', result.length);
    
    // Log detailed structure of first question
    if (result.length > 0) {
      console.log('First question structure:', {
        id: result[0]._id,
        idType: typeof result[0]._id,
        idConstructor: result[0]._id.constructor.name,
        fullQuestion: result[0]
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      questions: result
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to fetch questions',
    }, { status: 500 });
  }
} 