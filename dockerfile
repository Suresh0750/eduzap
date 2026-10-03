FROM node:20

WORKDIR app/

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SERVER

ENV NEXT_PUBLIC_SERVER=$NEXT_PUBLIC_SERVER

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
