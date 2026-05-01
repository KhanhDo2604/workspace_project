
#BUILD
FROM node:22-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# copy source
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run builder

#RUNNER
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY COPY package.json package-lock.json ./

#  only install production deps
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]