import { NextResponse } from 'next/server';
import { getProductWithReviews } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductWithReviews(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to fetch product:`, error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
