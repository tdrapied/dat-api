import { join } from 'path';
import 'dotenv/config';

export default {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '../../src/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../../src/migrations/*{.ts,.js}')],
  cli: { migrationsDir: 'src/migrations' },
};
