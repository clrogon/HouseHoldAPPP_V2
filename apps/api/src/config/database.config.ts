import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  user: process.env.POSTGRES_USER || 'household',
  password: process.env.POSTGRES_PASSWORD || 'household_secret',
  name: process.env.POSTGRES_DB || 'household_db',
}));
