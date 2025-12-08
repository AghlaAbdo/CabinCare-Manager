FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
RUN npm install 
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
