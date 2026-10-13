
FROM node:20-alpine AS web
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:20-alpine
RUN apk add --no-cache tzdata
ENV TZ=America/Santiago
ENV NODE_ENV=production
ENV PORT=3007
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY --from=web /app/client/dist ./client/dist
EXPOSE 3007
CMD ["node", "server/index.js"]