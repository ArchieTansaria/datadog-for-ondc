import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const [ordersCount, slaBreachesCount, activeExceptionsCount] = await Promise.all([
      // Total Monitored Orders last 24h
      prisma.order.count({
        where: { createdAt: { gte: twentyFourHoursAgo } },
      }),
      // SLA Breaches last 24h
      prisma.incident.count({
        where: {
          incidentType: 'SLA_BREACH',
          detectedAt: { gte: twentyFourHoursAgo },
        },
      }),
      // Active Exceptions (High/Critical)
      prisma.incident.count({
        where: {
          status: 'OPEN',
          severity: { in: ['CRITICAL', 'HIGH'] },
        },
      }),
    ]);

    return NextResponse.json({
      ordersCount,
      slaBreachesCount,
      activeExceptionsCount,
    });
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
