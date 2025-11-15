# API Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Build stage
FROM base AS builder
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY turbo.json ./
COPY knexfile.ts ./

# Copy all packages
COPY apps/api ./apps/api
COPY packages ./packages
COPY shared ./shared
COPY config ./config

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages in correct dependency order
RUN pnpm --filter @hds/shared build
RUN pnpm --filter @hds/core build
RUN pnpm --filter @hds/infrastructure build
RUN pnpm --filter @hds/api build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
# Copy source files for Swagger documentation
COPY --from=builder /app/apps/api/src ./apps/api/src
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml* ./

# Copy knexfile and migrations for database management
COPY --from=builder /app/knexfile.ts ./
COPY --from=builder /app/packages/infrastructure/src/database/migrations ./packages/infrastructure/src/database/migrations
COPY --from=builder /app/packages/infrastructure/src/database/seeds ./packages/infrastructure/src/database/seeds

# Install ALL dependencies (not just production) to get knex and tsx for migrations
RUN pnpm install --frozen-lockfile

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
