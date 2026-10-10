FROM node:20-alpine

WORKDIR /app

# Copy the full project so the frontend files are available to Express static hosting.
COPY . .

WORKDIR /app/backend
RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
