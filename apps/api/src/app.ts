import fastify from 'fastify';
import { healthRoutes } from './modules/health/health.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { errorHandler } from './common/errors/errorHandler.js';

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  app.setErrorHandler(errorHandler);

  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(orderRoutes, { prefix: '/api/v1/orders' });

  return app;
}
