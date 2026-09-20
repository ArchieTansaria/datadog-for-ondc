import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { getRCAProvider } from '../../../../../lib/rca';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: params.id },
      include: {
        order: true
      }
    });

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const provider = getRCAProvider();
    
    // Pass the incident context to the provider
    const rcaEvidence = await provider.generateRCA(incident.id, incident);

    // Save the RCA result to the incident metadata (or a dedicated table)
    const updatedIncident = await prisma.incident.update({
      where: { id: incident.id },
      data: {
        metadata: {
          ...(incident.metadata && typeof incident.metadata === 'object' ? incident.metadata : {}),
          rca: {
            provider: provider.name,
            evidence: rcaEvidence,
            generatedAt: new Date().toISOString()
          }
        }
      }
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Failed to generate RCA:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
