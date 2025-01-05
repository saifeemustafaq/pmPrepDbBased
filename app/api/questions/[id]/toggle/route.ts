import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect();
    const database = client.db('interview-prep');
    const questions = database.collection('questions');
    
    const question = await questions.findOne({ _id: new ObjectId(params.id) });
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    const result = await questions.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isCompleted: !question.isCompleted } }
    );
    
    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle question' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 