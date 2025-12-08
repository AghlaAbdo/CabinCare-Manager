FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM base AS production
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start:prod"]
