FROM node:22.17-alpine3.21
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD [ "npm",'run','start:prod' ]

