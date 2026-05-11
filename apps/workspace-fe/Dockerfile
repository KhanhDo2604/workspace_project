FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

COPY apps/workspace-fe/package.json ./apps/workspace-fe/

RUN npm ci --workspace=apps/workspace-fe

COPY apps/workspace-fe/vite.config.js ./apps/workspace-fe/
COPY apps/workspace-fe/index.html ./apps/workspace-fe/
COPY apps/workspace-fe/src/ ./apps/workspace-fe/src/
COPY apps/workspace-fe/public/ ./apps/workspace-fe/public/

ARG VITE_BACKEND_URL
ARG VITE_WEBSOCKET_URL
ARG VITE_ICE_SERVERS_URL
ARG VITE_KEYCLOAK_URL        
ARG VITE_KEYCLOAK_REALM      
ARG VITE_KEYCLOAK_CLIENT_ID  

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_WEBSOCKET_URL=$VITE_WEBSOCKET_URL
ENV VITE_ICE_SERVERS_URL=$VITE_ICE_SERVERS_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

WORKDIR /app/apps/workspace-fe
RUN npm run build

#serve NGINX
FROM nginx:alpine AS runner

COPY --from=builder /app/apps/workspace-fe/dist /usr/share/nginx/html
COPY apps/workspace-fe/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]