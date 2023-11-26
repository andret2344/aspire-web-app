FROM node:lts-alpine as build-deps
LABEL author="Mytthew"
WORKDIR /app

copy package*.json yarn.lock ./

RUN yarn

COPY . .

ARG REACT_APP_API
ENV REACT_APP_API $REACT_APP_API

RUN yarn build

FROM nginx:mainline-alpine3.18-slim
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /app/build /usr/share/nginx/html
EXPOSE 6000
CMD ["nginx", "-g", "daemon off;"]
