import { prisma, Prisma } from '@ondc-pulse/database';

export class EventsRepository {
  async findByOrderId(orderId: string, tenantId: string) {
    return prisma.orderEvent.findMany({
      where: { 
        orderId,
        tenantId 
      },
      orderBy: { eventTimestamp: 'asc' }
    });
  }

  async findByIdempotencyKey(idempotencyKey: string, tenantId: string) {
    return prisma.orderEvent.findUnique({
      where: {
        idempotencyKey,
        tenantId
      }
    });
  }

  async create(data: Prisma.OrderEventUncheckedCreateInput) {
    return prisma.orderEvent.create({ data });
  }
}

export const eventsRepository = new EventsRepository();
