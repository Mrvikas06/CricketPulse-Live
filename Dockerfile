FROM node:22-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

# Install a tiny static server
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT=8080 \
    NODE_ENV=production

CMD ["sh", "-c", "serve -s dist -l $PORT"]
