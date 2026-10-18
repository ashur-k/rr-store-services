# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY frontend/web/package*.json ./
RUN npm ci

COPY frontend/web/ ./

ARG VITE_API_URL=/api
ARG VITE_KEYCLOAK_URL=https://rr-store.co.uk
ARG VITE_KEYCLOAK_REALM=rr-store
ARG VITE_KEYCLOAK_CLIENT_ID=rr-store-frontend

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_KEYCLOAK_URL=${VITE_KEYCLOAK_URL}
ENV VITE_KEYCLOAK_REALM=${VITE_KEYCLOAK_REALM}
ENV VITE_KEYCLOAK_CLIENT_ID=${VITE_KEYCLOAK_CLIENT_ID}

RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:stable-alpine3.24

# Install available Alpine package updates
RUN apk update && apk upgrade --no-cache

RUN rm /etc/nginx/conf.d/default.conf

COPY infrastructure/production/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
