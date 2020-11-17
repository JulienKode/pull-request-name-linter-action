FROM node:14-alpine

RUN apk --no-cache add git

COPY package*.json /

RUN npm ci --production

COPY . .

ENTRYPOINT ["/entrypoint.sh"]
