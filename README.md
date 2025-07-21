# iot-devices-management-app

An app to manage IoT devices in a smart home

## iot-hub-api

## Prerequisites

- Docker
- Node 22.5.0?

## How to run

- Spin the database

```
cd iot-hub-api
docker compose --env-file .env up
npx prisma migrate dev
```

## How to extent the API to new devices

Pushing changes to the DB schema:

- make changes to `prisma/schema.prisma`
- create a migration file with `npx prisma migrate dev`
- `npx prisma generate`
