FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install -g nodemon ts-node typescript

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]