# syntax=docker/dockerfile:1

# Get the node environment
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy package.json over, npm install all files
COPY package.json ./
RUN apk add git
RUN npm install
# Copy all files over
COPY . .

# Run! This also builds.
CMD ["npm", "start"]
