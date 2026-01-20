FROM node:22-alpine3.18 AS build
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY public ./public
COPY src ./src
COPY webpack ./webpack

COPY .babelrc ./.babelrc
COPY tsconfig*.json ./
COPY cssTransform.js ./cssTransform.js

ARG REACT_APP_API_TOKEN
ENV REACT_APP_API_TOKEN=$REACT_APP_API_TOKEN

RUN yarn build

FROM nginx:mainline-alpine3.18-slim
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/public/locales /usr/share/nginx/html/locales

CMD ["nginx", "-g", "daemon off;"]
