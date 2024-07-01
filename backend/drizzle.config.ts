import { defineConfig } from 'drizzle-kit'

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
const POSTGRES_CONN_STR = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

export default defineConfig({
  schema: "./infrastructure/schema.ts",
  out: './drizzle',
  schemaFilter: ['app_data'],
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials :{
    url: POSTGRES_CONN_STR
  }
})