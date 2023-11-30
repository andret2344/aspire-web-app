FROM node:lts-alpine as build-deps
LABEL author="Mytthew"
WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM nginx:mainline-alpine3.18-slim
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]