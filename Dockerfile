#빌드 스테이지
FROM node:20 AS build-stage
WORKDIR /build
COPY 5-sprint-mission/package*.json ./
RUN npm ci 
COPY 5-sprint-mission ./
RUN npm run build

#실행 스테이지
FROM node:20-slim
WORKDIR /app
COPY --from=build-stage /build/dist ./dist
COPY --from=build-stage /build/package*.json ./
RUN npm ci --omit=dev
ENV SERVER_PORT=3000
ENTRYPOINT [ "npm","run","start" ]