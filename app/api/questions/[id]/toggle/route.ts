import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { Document, ObjectId } from 'mongodb';

interface QuestionDocument extends Document {
  _id: string | ObjectId;
  isCompleted?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Extract ID from the URL segments, getting the second-to-last segment
    const segments = request.nextUrl.pathname.split('/');
    const idString = segments[segments.length - 2];
    
    if (!idString) {
      return NextResponse.json(
        { success: false, message: 'Question ID is required' },
        { status: 400 }
      );
    }

    console.log('Toggle request for question ID:', idString);
    
    const client = await clientPromise;
    const db = client.db('interview-questions');
    const questions = db.collection<QuestionDocument>('questions');
    
    // Convert string ID to ObjectId
    const id = new ObjectId(idString);
    console.log('Executing query:', { _id: id });
    
    const question = await questions.findOne({ _id: id });
    console.log('Found question:', question);
    
    if (!question) {
      return NextResponse.json(
        { success: false, message: `Question not found with ID: ${idString}` },
        { status: 404 }
      );
    }
    
    const result = await questions.updateOne(
      { _id: id },
      { $set: { isCompleted: !question.isCompleted } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'Failed to update question',
        isCompleted: question.isCompleted
      }, { status: 500 });
    }

    const newIsCompleted = !question.isCompleted;
    return NextResponse.json({ 
      success: true,
      isCompleted: newIsCompleted,
      message: 'Question updated successfully'
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Failed to toggle question'
    }, { status: 500 });
  }
} 