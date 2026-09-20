# Feature 09: Database & Next.js Networking

## Objective
Establish a direct database connection between the Next.js frontend application and the Aurora PostgreSQL database using Prisma. This enables the frontend to serve read-heavy dashboard queries efficiently without requiring a separate layer of API Gateway and Lambda functions.

## Architecture & Scope
1. **Workspace Integration**: Link the `@ondc-pulse/database` package to the Next.js workspace in the monorepo via `package.json`.
2. **Prisma Client**: Utilize the pre-generated Prisma Client inside Next.js Server Components and API Routes.
3. **Networking Strategy**: For local development and testing, the Next.js runtime will connect to the database via standard environment variables (`DATABASE_URL`). For production deployments on Vercel, this implies setting up VPC Peering or a Bastion Host, or alternatively deploying Next.js within the AWS VPC (e.g., AWS App Runner) to access the ISOLATED subnets where Aurora resides.

## Key Decisions
- **Direct Prisma Access**: Chosen to reduce architectural complexity and latency for read-heavy operations like rendering the dashboard metrics and timelines.
- **Connection Management**: Since serverless environments (like Vercel) can exhaust database connections, we must ensure Prisma is properly instantiated (using a global singleton in development) to avoid connection leaks.

## Validation & Observability
- **Unit Testing**: Validate that the Prisma client can be instantiated and queried from the Next.js environment.
- **Build Checks**: Ensure `next build` passes without TypeScript errors related to the database package.
