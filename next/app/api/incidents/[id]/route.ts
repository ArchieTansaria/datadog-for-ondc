import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const incident = await prisma.incident.findUnique({
      where: { id: resolvedParams.id },
      include: {
        order: {
          include: {
            events: {
              orderBy: { eventTimestamp: 'desc' },
              take: 5,
            }
          }
        },
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Failed to fetch incident:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
