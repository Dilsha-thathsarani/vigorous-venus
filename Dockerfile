# syntax = docker/dockerfile:1

ARG NODE_VERSION=18.20.4
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Astro"

WORKDIR /app

ENV NODE_ENV="production"

# Build stage
FROM base as build

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Runtime stage
FROM base

# Copy built application
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Start the server
EXPOSE 3000
CMD [ "npm", "start" ]