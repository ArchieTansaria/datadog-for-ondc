import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET() {
  try {
    // For the demo, we fetch orders for the first available tenant
    // In a real application, this would use API key authentication to determine the tenant.
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { tenantId: tenant.id },
      orderBy: { lastEventAt: 'desc' },
      take: 50,
      include: {
        incidents: {
          where: { status: 'OPEN' }
        }
      }
    });

    return NextResponse.json({ data: orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
