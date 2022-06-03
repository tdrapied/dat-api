# maj-api

## Installation
```bash
$ npm install
```

## Before you start
At the root of the project, execute the following commands:
```bash
cp ./api/.env.example ./api/.env
```

## Migration
```bash
# run migration
npm run migration:run

# generate migration with a migration name
npm run migration:generate -- <migrationName>
```

## Running the app
```bash
npm run start
```