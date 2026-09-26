FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_BASE_URL
ENV VITE_SERVER_BASE_URL=${VITE_SERVER_BASE_URL}

RUN npm run build
