# iot-hub-api

A Typescript API to manage IoT devices in a smart home

## Design

I have designed this API around 3 core concepts: flexibility, maintainability and robustness.

### Flexibility

This API is supposed to control different types of smart devices in a house. As explained in the brief, these devices can be anything from smart lights to thermostats or security cameras. There could also be several brands or models of a device. Consequently, I expect each device to have different properties. The API should be able to store and modify these different properties.

I chose to store all the devices in a single table `devices`. Some fields are common and mandatory for all devices:

- `name` (string)
- `id` (UUID)
- `is_enabled` (boolean)
- `type` (string)

The other fields are optional:

- `is_on` (boolean)
- `current_value_1` (float)
- `target_value_1` (float)
- `setting_as_int_scale_1` (int)
- `setting_as_string_1` (string)

The main inconvenience of this data structure is that the `devices` table may end up with a lot of columns depending on the number of different device properties. However, a lot of different devices tend to operate with similar type of settings. For instance, thermostats and dehumidifiers would both use a current value and a target value; other devices have settings represented by a name (e.g smart lights with colour settings, dishwashers). That is why I chose very generic column names instead of names like "temperature". I also added a `_1` in some of the column names to account for devices that may need several columns of the same type.

I also took into account the fact that even if 2 devices can use the same column, different rules may apply to them. A thermostat might accept target values from 0 to 30C, whereas a dehumidifier might accept target values from 0% to 100%. I used the Typescript library [Zod](https://zod.dev/) to define validation schemas that are specific to each type of device.

I chose to use a PostGreSQL database, because it can also handle more data types than MySQL, including complex types like arrays and composite data types, which may be useful for some devices. For instance, we could add a Controller device type and store the list of all the other devices it can interact with as an array.

### Maintainability

I wanted to make it easy for another developer to add a new type of device. It should be easy to change the database structure. I used the ORM [Prisma](https://www.prisma.io/). It allows to define and change the `devices` table in a schema file. It also provides commands to synchronise the database with the schema and save the schema changes in migration files.

I also sought to minimize the number of files that a developer would have to modify to add a new type of device. The validation rules for the different device types are defined once in the codebase. Adding a new type of device only requires to add a Zod schema for it!

### Robustness

Using Zod and Prisma also helped me with making this API more robust. I used Zod to validate data used to create or update a database record. I also used Prisma to add some additional constraints on fields, such as making device names unique. I also used the query methods from Prisma as they are not vulnerable to SQL injection. I also added unit tests for all the functions.

### Other considerations

In a real-life scenario, this API would probably additional security features such as authentication and authorisation. For instance, API requests could include bearer JWT tokens in the header, which would allow the API to check if a user has the authorisation to call a specific endpoint.

The data returned by the API endpoints are all of the same type: `null`, `Device` or `Array<Device>`. This makes the endpoints easy to use by a frontend app. Future work could include adding an Open API Schema endpoint. It consist of adding an endpoint from which the types of the API responses can be queried. They can then be used by the frontend app, which ensures data types consistency across the stack.

## Prerequisites

- Docker
- Node 22.17.1

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
