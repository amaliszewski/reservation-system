FROM node:23

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]