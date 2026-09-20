// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any) => {
  console.log('Metrics Engine received event:', JSON.stringify(event, null, 2));

  try {
    // Basic event structure validation
    if (event.source !== 'pulse.processor' || event['detail-type'] !== 'OrderMetricsEvent') {
      console.warn('Ignoring unhandled event type');
      return;
    }

    const { detail } = event;
    
    // Simulate metrics computation/aggregation
    const { orderId, metrics } = detail;
    if (!orderId || !metrics) {
      throw new Error('Missing required metrics data');
    }

    // TODO: Forward metrics to Amazon Timestream or save to Aurora
    console.log(`Processing metrics for order ${orderId}:`, metrics);

    // If there is an SLA breach recorded in the metrics, log an alert
    if (metrics.slaBreaches && metrics.slaBreaches.length > 0) {
      console.warn(`SLA Breach detected for order ${orderId}:`, metrics.slaBreaches);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, processed: true }),
    };
  } catch (error) {
    console.error('Failed to process metrics event:', error);
    throw error;
  }
};
