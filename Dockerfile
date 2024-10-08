FROM node:18-alpine3.17 AS build
WORKDIR /app
COPY . /app
RUN apk update && apk add git
RUN yarn install
RUN yarn build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
