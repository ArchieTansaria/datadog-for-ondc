import { prisma, Prisma } from '@ondc-pulse/database';

export class OrdersRepository {
  async findMany(tenantId: string) {
    return prisma.order.findMany({
      where: { tenantId },
      orderBy: { lastEventAt: 'desc' },
      take: 50,
      include: {
        incidents: {
          where: { status: 'OPEN' }
        }
      }
    });
  }

  async findById(id: string, tenantId: string) {
    return prisma.order.findUnique({
      where: { 
        id,
        tenantId 
      },
      include: {
        tenant: { select: { name: true, slug: true } },
      }
    });
  }

  async findByTransactionId(transactionId: string, tenantId: string, environment: string) {
    return prisma.order.findUnique({
      where: {
        tenantId_environment_transactionId: {
          tenantId,
          environment,
          transactionId
        }
      }
    });
  }

  async create(data: Prisma.OrderUncheckedCreateInput) {
    return prisma.order.create({ data });
  }

  async updateState(id: string, tenantId: string, newState: string) {
    return prisma.order.update({
      where: { id, tenantId },
      data: { 
        currentState: newState,
        lastEventAt: new Date()
      }
    });
  }
}

export const ordersRepository = new OrdersRepository();
