# todo-app-api
API for ToDo application

## Installation

```bash
$ npm install
```

## Env. Variables
You must set environment variables for the application to run correctly:
```
DB_HOST - database ip/hostname 
DB_PORT - database port
DB_USER - database user
DB_PASS - database user`s password
DB_NAME - database name
JWT_SECRET - secret word for JWT tokens
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation
- Please have a look on [technical design document](DESIGN.md)
- Please have a look on Postman collection in the root folder - **ToDo app API.postman_collection.json**

