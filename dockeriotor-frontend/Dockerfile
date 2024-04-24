FROM node:18-alpine as builder

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

FROM node:18-alpine as runner

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist /app

CMD ["serve", "-s", "/app", "-l", "80"]
