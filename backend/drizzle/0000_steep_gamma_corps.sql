CREATE schema IF NOT EXISTS app_data;

CREATE TABLE IF NOT EXISTS "app_data"."user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"pass" text NOT NULL,
	"contact" text NOT NULL
);
