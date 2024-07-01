import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();


const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
const POSTGRES_CONN_STR = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

export const client = new Pool({
  connectionString: POSTGRES_CONN_STR
});

export const db = drizzle(client, { logger: true });