FROM node:22-alpine3.18 AS build-deps
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY public ./public
COPY src ./src
COPY webpack ./webpack

COPY .babelrc ./.babelrc
COPY tsconfig*.json ./
COPY cssTransform.js ./cssTransform.js

RUN yarn build

FROM nginx:mainline-alpine3.18-slim
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
