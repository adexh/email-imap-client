ALTER TABLE "app_data"."user" RENAME COLUMN "contact" TO "token";--> statement-breakpoint
ALTER TABLE "app_data"."user" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_data"."user" ALTER COLUMN "token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app_data"."user" ADD COLUMN "linkedMail" text;