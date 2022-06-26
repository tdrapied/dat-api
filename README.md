# dat-api

## Installation
```bash
$ npm install
```

## Before you start
At the root of the project, execute the following commands:
```bash
cp .env.example .env
```

## Migration
```bash
# run migration
npm run migration:run

# generate migration with a migration name
npm run migration:generate -- <path/name>
```

## Running the app
```bash
npm run start
```

API: http://localhost:3000