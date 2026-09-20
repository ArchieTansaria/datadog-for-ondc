import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function GET() {
  try {
    // We compute the latency between /confirm and /on_status as a representative metric
    // Grouped into 5-minute buckets over the last 24 hours.
    
    // Note: This relies on PostgreSQL specific functions (percentile_cont)
    const result = await prisma.$queryRaw`
      WITH pairs AS (
        SELECT 
          e1.transaction_id,
          e1.event_timestamp AS start_time,
          e2.event_timestamp AS end_time,
          EXTRACT(EPOCH FROM (e2.event_timestamp - e1.event_timestamp)) * 1000 AS latency_ms
        FROM order_events e1
        JOIN order_events e2 ON e1.transaction_id = e2.transaction_id
        WHERE e1.action = 'confirm' 
          AND e2.action = 'on_status'
          AND e1.event_timestamp >= NOW() - INTERVAL '24 hours'
          AND e2.event_timestamp >= e1.event_timestamp
      ),
      buckets AS (
        SELECT 
          date_trunc('hour', start_time) + 
          floor(EXTRACT(minute FROM start_time) / 5) * interval '5 minute' AS time_bucket,
          latency_ms
        FROM pairs
      )
      SELECT 
        time_bucket,
        percentile_cont(0.5) WITHIN GROUP (ORDER BY latency_ms) AS p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95
      FROM buckets
      GROUP BY time_bucket
      ORDER BY time_bucket ASC;
    `;

    // Prisma raw query returns BigInt for aggregations sometimes, we must serialize properly
    // and format for frontend charts.
    const formattedResult = (result as any[]).map(row => ({
      timestamp: row.time_bucket.toISOString(),
      p50: Number(row.p50) || 0,
      p95: Number(row.p95) || 0,
    }));

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error('Failed to fetch timeline:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
