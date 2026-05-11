
#BUILD
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/workspace-be/package.json ./apps/workspace-be/

RUN npm ci --workspace=apps/workspace-be

# copy source
COPY apps/workspace-be/tsconfig.json ./apps/workspace-be/
COPY apps/workspace-be/src/ ./apps/workspace-be/src/

WORKDIR /app/apps/workspace-be
RUN npm run build

#RUNNER
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/workspace-be/package.json ./apps/workspace-be/

#  only install production deps
RUN npm ci --workspace=apps/workspace-be --omit=dev

COPY --from=builder /app/apps/workspace-be/dist ./apps/workspace-be/dist

WORKDIR /app/apps/workspace-be

EXPOSE 3500

CMD [ "node", "dist/index.js" ]