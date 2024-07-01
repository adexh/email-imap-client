import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './infrastructure/db';
// This will run migrations on the database, skipping the ones already applied
migrate(db, { migrationsFolder: './drizzle' }).then(()=>{
  client.end();
})