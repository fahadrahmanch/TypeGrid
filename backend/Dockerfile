FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -f .tsbuildinfo && npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]