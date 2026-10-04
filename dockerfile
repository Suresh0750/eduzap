FROM node:20 AS builder

WORKDIR app/

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SERVER

ENV NEXT_PUBLIC_SERVER=$NEXT_PUBLIC_SERVER

RUN npm run build

#---Production -- used for small size images--;
FROM node:20-alpine

WORKDIR app/

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "start"]
