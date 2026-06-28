FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV MONGODB_URI=mongodb://build:build@localhost:27017/build
ENV MONGODB_DB=iot
ENV NEXTAUTH_URL=http://iot.mathislambert.fr
ENV NEXTAUTH_SECRET=build-secret-for-static-analysis
ENV ADMIN_EMAIL=admin@iot.local
ENV ADMIN_PASSWORD_HASH='$2b$12$FiPXeQAU7qYwxqIp.jwZ3OGsuE82tuDGIyoXG3tNQ98n5Y.bNbiLK'
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
