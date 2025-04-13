FROM node:23

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install --legacy-peer-deps --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]