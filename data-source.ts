import { DataSource } from 'typeorm';

// .env is no longer used for this file.
// All configurations are hardcoded to match app.module.ts

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pairing_user',
  password: '3775yahj@',
  database: 'pairing_db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/migrations/*.ts'],
});
