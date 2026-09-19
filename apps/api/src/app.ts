import fastify from 'fastify';
import { healthRoutes } from './modules/health/health.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { errorHandler } from './common/errors/errorHandler.js';

import { apiKeyAuth } from './common/auth/apiKey.plugin.js';

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  app.setErrorHandler(errorHandler);

  await app.register(apiKeyAuth);

  await app.register(healthRoutes, { prefix: '/health' });
  
  app.register(async (apiContext) => {
    apiContext.addHook('onRequest', apiContext.authenticate);
    await apiContext.register(orderRoutes, { prefix: '/orders' });
  }, { prefix: '/api/v1' });

  return app;
}
