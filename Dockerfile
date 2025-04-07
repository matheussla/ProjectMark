FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN mkdir -p /app/data

RUN npx prisma generate

RUN yarn build

EXPOSE 3000

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'export DATABASE_URL="file:/app/data/dev.db"' >> /app/start.sh && \
    echo 'export NODE_ENV=production' >> /app/start.sh && \
    echo 'yarn container:seed' >> /app/start.sh && \
    echo 'yarn start' >> /app/start.sh && \
    chmod +x /app/start.sh

ENTRYPOINT ["/bin/sh", "/app/start.sh"] 