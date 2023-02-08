FROM node:14-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
EXPOSE 5000
CMD ["npm","run", "dev"]