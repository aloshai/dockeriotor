FROM node:18-alpine as builder

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

FROM nginx:alpine as runner

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]