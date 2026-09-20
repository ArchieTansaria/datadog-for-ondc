import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const status = searchParams.get('status');
  const severity = searchParams.get('severity');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: any = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;

  try {
    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        skip,
        take,
        orderBy: { detectedAt: 'desc' },
      }),
      prisma.incident.count({ where }),
    ]);

    return NextResponse.json({
      data: incidents,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
