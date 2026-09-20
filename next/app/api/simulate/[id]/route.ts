import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // id is the transactionId
) {
  try {
    const resolvedParams = await params;
    const transactionId = resolvedParams.id;

    // Fetch all events for this transaction
    const events = await prisma.orderEvent.findMany({
      where: { transactionId },
      orderBy: { eventTimestamp: 'asc' },
    });

    // Check if an incident was generated for this order
    const order = await prisma.order.findUnique({
      where: {
        // We know it's environment 'PROD' and this tenant for now
        // A better query would just look up order by transactionId
        tenantId_environment_transactionId: {
          // This assumes tenantId is seeded and known, or we search across tenants
          // To simplify we just search by transactionId without unique constraints:
          tenantId: events[0]?.tenantId || 'dummy',
          environment: 'PROD',
          transactionId
        }
      }
    });

    let incidents: any[] = [];
    if (order) {
      incidents = await prisma.incident.findMany({
        where: { orderId: order.id }
      });
    } else {
      // Fallback search by looking up order differently if first query fails
      const fallbackOrder = await prisma.order.findFirst({
        where: { transactionId }
      });
      if (fallbackOrder) {
        incidents = await prisma.incident.findMany({
          where: { orderId: fallbackOrder.id }
        });
      }
    }

    const businessLogs: any[] = [];
    
    events.forEach(evt => {
      businessLogs.push({
        timestamp: evt.eventTimestamp.toISOString(),
        message: `Processed canonical event: ${evt.action}`,
        level: 'info'
      });
    });

    incidents.forEach(inc => {
      businessLogs.push({
        timestamp: inc.detectedAt.toISOString(),
        message: `Incident Detected: ${inc.title} - ${inc.severity}`,
        level: 'error',
        incidentId: inc.id
      });
    });

    // Sort by timestamp
    businessLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      logs: businessLogs,
      status: incidents.length > 0 ? 'FAILED' : (events.some(e => e.action === 'on_status') ? 'COMPLETED' : 'IN_PROGRESS')
    });
  } catch (error) {
    console.error('Failed to fetch simulation status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
