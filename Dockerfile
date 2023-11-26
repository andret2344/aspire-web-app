FROM node:lts-alpine as build-deps
LABEL author="Mytthew"
WORKDIR /app

COPY package*.json yarn.lock config.sh ./

RUN yarn

COPY . .

ARG REACT_APP_API
ENV REACT_APP_API $REACT_APP_API

RUN yarn build

FROM nginx:mainline-alpine3.18-slim
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /app/build /usr/share/nginx/html

# Kopiowanie i ustawianie uprawnień do wykonania dla config.sh
COPY --from=build-deps /app/config.sh /usr/local/bin/config.sh
RUN chmod +x /usr/local/bin/config.sh

# Uruchomienie skryptu config.sh, a następnie Nginx
CMD ["/bin/sh", "-c", "/usr/local/bin/config.sh && nginx -g 'daemon off;'"]

EXPOSE 6000
