import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const campuses = await prisma.campus.findMany();
    return NextResponse.json({ success: true, campuses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
