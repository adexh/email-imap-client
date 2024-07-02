import {
  text,
  serial,
  pgSchema,
} from "drizzle-orm/pg-core"

const mySchema = pgSchema('app_data');

export const users = mySchema.table("user", {
  id: serial("id")
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  image: text("image"),
  password: text('pass').notNull(),
  token: text('token'),
  refreshToken: text('refreshToken'),
  code: text('code'),
  linkedMail: text('linkedMail')
})