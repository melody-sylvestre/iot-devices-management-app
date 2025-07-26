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

I used unit tests to thoroughly test any possible outcome for each of the endpoints. I did not implement integration tests due to time constraints, but they could be a future addition to the QA process, as they allow to test the interactions between the database and the API.

I used `console.log` for the logging for simplicity, but if this API was to be deployed on the cloud (e.g. Google Cloud Platform), I would have used a dedicated logging library such as [winston](https://github.com/winstonjs/winston). It provides several levels of logging and tools to correlate log entries, which allows for more efficient monitoring of a service.

The data returned by the API endpoints are all of the same type: `null`, `Device` or `Array<Device>`. This makes the endpoints easy to use by a frontend app. Future work could include adding an Open API Schema endpoint. It consist of adding an endpoint from which the types of the API responses can be queried. They can then be used by the frontend app, which ensures data types consistency across the stack.

## Prerequisites

- Docker
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
- Node 22.17

## How to run

1. Copy the `.env.example` file into a `.env`.

   ```
   cd iot-hub-api
   cp .env.example .env
   ```

   Change the value of the environment variables defined if `.env` if required.

2. Set node to the right version

   ```
   nvm use
   ```

   If the required version of Node is not present on your system, you can install it with `nvm install v22.17`. Instructions to install nvm can be found [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

3. Set up the database

   ```
   npm run db:docker
   ```

   This initialises the database in a Docker component following the Prisma schema defined in `prisma/schema.prisma` and installs Prisma if necessary.

   This command also creates an Adminer service, which is a database management tool. You can visualise and change the database at http://localhost:8080, using the environment variables defined in `.env`:

   ```
   System > PostgreSQL
   Server > db
   Username > $DB_USER
   Password > $DB_PASSWORD
   Database > $DB_NAME
   ```

4. Optional - Populate the database

   You can populate the database with some dummy data using the `test_data.sql`. For instance, with Adminer, click on "SQL command" and copy paste the contents of `test_data.sql` into the text box.

5. Install dependencies

   ```
   npm install
   ```

6. Run unit tests

   ```
   npm run test
   ```

7. Start the API

   ```
   npm run start
   ```

   The API is now running on http://localhost:3000 (or any other port defined by `$PORT` in the `.env`)

## How to use the API

For all the endpoints, the response format is JSON with the format

```
{
    "message": "a message",
    "data" : null | Device object | Array <Device>
}

```

### Fetching the list of registered devices

```
GET /devices
```

**Responses**

- Success: `200 OK`

  It returns a success message and an array of `Device` objects. Each element of the array show the properties of a device. If there no records in the data base, `data` will be an empty array.

  Example of response body

  ```
  {
      "message": Found 2 devices",
      "data" : [{
          "id": "0bed0973-3d39-4de7-9987-688f04c02f6c",
          "name": "Porch Light",
          "type": "Light Switch",
          "is_enabled": true,
          "is_on": false,
          "current_value_1": null,
          "target_value_1": null,
          "setting_as_int_scale_1": null,
          "setting_as_string_1": null
      },
      {
          "id": "6eeafae8-1153-408a-94cf-737fe7b953d4",
          "name": "Living Room Thermostat",
          "type": "Thermostat",
          "is_enabled": true,
          "is_on": null,
          "current_value_1": 14,
          "target_value_1": 22,
          "setting_as_int_scale_1": null,
          "setting_as_string_1": null
      }]
  }
  ```

- Failure: `500 Internal Server Error `

  Example of response body

  ```
    {
        "message": "Error",
        "data" : null

    }
  ```

### Registering a new device

```
POST /devices
```

This endpoint accepts a JSON body. It **must** always contain the properties defined in the variable `requiredDevicePropertiesSchema` in `src/definitions/types.ts`. Currently these properties are `name`, `type`, and `is_enabled`.

Example of a valid request body:

```
{
     "name": "New Device",
     "type": "Thermostat",
     "is_enabled": true,
     "current_value_1": 14,
     "target_value_1": 22
}
```

This is also a valid request body, because all the fields that are not relevant for the device type "Light Switch" were set to `null`:

```
{

    "name": "New Light",
    "type": "Light Switch",
    "is_enabled": true,
    "is_on": false,
    "current_value_1": null,
    "target_value_1": null,
    "setting_as_int_scale_1": null,
    "setting_as_string_1": null
}
```

**Responses**

- Success: `201 Created`

  It returns a success message and a `Device` object, showing all the properties of the new device.

  Example of response body

  ```
  {
    "message": "Successfully registered new device",
    "data": {
        "id": "22a8e77a-7efb-45d5-b5f3-cdfc74f8991d",
        "name": "New Light",
        "type": "Light Switch",
        "is_enabled": true,
        "is_on": false,
        "current_value_1": null,
        "target_value_1": null,
        "setting_as_int_scale_1": null,
        "setting_as_string_1": null
    }
  }
  ```

- Failure: `400 Bad Request`

  This happens if the user tries to register a device with the same name or id as an existing device in the database, if one of the mandatory properties is missing from the request body, or if the request body does not satisfy the validation rules for this type of device.

  Example of response body

  ```
    {
        "message": "Error: the name New Light is already present in the database and cannot be duplicated.",
        "data": null
    }
  ```

- Failure: `500 Internal Server Error `

  For any other kind of error.

  Example of response body

  ```
    {
        "message": "Error",
        "data" : null

    }
  ```

### Fetching the details of a specific device

```
GET /devices/{id}
```

**Responses**

- Success: `200 OK`

  It returns a success message and a `Device` object.

  Example of response body

  ```
    {
        "message": "Successfully fetched Bedroom Light.",
        "data": {
        "id": "735aaae1-b75d-43fd-8b1c-87f345fd3acf",
        "name": "Bedroom Light",
        "type": "Light Switch",
        "is_enabled": false,
        "is_on": false,
        "current_value_1": null,
        "target_value_1": null,
        "setting_as_int_scale_1": null,
        "setting_as_string_1": null
        }
   }
  ```

- Failure: `404 Not Found`

  This happens if there is no device with this id in the database.

  Example of response body

  ```
   {
        "message": "Error: there is no device with id 735aaae1-b75d-43fd-8b1c-87f345fd3a00 in the database.",
        "data": null
   }
  ```

- Failure: `500 Internal Server Error `

  For any other kind of error.

  Example of response body

  ```
    {
        "message": "Error",
        "data" : null

    }
  ```

### Updating the details of a specific device

```
PUT /devices/{id}
```

This endpoint accepts a JSON body. For example:

```
{
 "is_on": true
}
```

**Responses**

- Success: `200 OK`

  It returns a success message and the updated details of the device.

  Example of response body

  ```
   {
        "message": "Successfully updated device Bedroom Light (id 735aaae1-b75d-43fd-8b1c-87f345fd3acf).",
        "data": {
            "id": "735aaae1-b75d-43fd-8b1c-87f345fd3acf",
            "name": "Bedroom Light",
            "type": "Light Switch",
            "is_enabled": false,
            "is_on": true,
            "current_value_1": null,
            "target_value_1": null,
            "setting_as_int_scale_1": null,
            "setting_as_string_1": null
        }
   }
  ```

- Failure: `400 Bad Request`

  This happens if the user tries to update a device with the same name or id as another device in the database, or if the request body does not satisfy the validation rules for this type of device.

  Example of response body

  ```
    {
        "message": "Error: invalid update request. ✖ Unrecognized key: \"random\"",
        "data": null
    }
  ```

- Failure: `404 Not Found`

  This happens if there is no device with this id in the database.

  Example of response body

  ```
   {
        "message": "Error: there is no device with id 735aaae1-b75d-43fd-8b1c-87f345fd3a00 in the database.",
        "data": null
   }
  ```

- Failure: `500 Internal Server Error `

  For any other kind of error.

  Example of response body

  ```
    {
        "message": "Error",
        "data" : null

    }
  ```

### Deleting a device

```
DELETE /devices/{id}
```

**Responses**

- Success: `200 OK`

  It returns a success message to confirm the deletion.

  Example of response body

  ```
    {
        "message": "Bedroom Light was successfully deleted",
        "data": null
    }
  ```

- Failure: `404 Not Found`

  This happens if there is no device with this id in the database.

  Example of response body

  ```
    {
        "message": "Error: device with ID 735aaae1-b75d-43fd-8b1c-87f345fd3acf was not found in the database.",
        "data": null
    }
  ```

- Failure: `500 Internal Server Error `

  For any other kind of error.

  Example of response body

  ```
    {
        "message": "Error",
        "data" : null

    }
  ```
