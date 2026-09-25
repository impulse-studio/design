-- Baseline compatible with the original Docker initialization; preserves existing tables and data.
CREATE TABLE IF NOT EXISTS "mockups" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"name" text NOT NULL,
	"doc" jsonb NOT NULL,
	"lib_version" text DEFAULT 'dev' NOT NULL,
	"thumbnail_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN ALTER TABLE "mockups" ADD CONSTRAINT "mockups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mockups_updated_idx" ON "mockups" USING btree ("updated_at" DESC NULLS LAST) WHERE "mockups"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mockups_project_updated_idx" ON "mockups" USING btree ("project_id","updated_at" DESC NULLS LAST) WHERE "mockups"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_owner_updated_idx" ON "projects" USING btree ("owner_id","updated_at" DESC NULLS LAST) WHERE "projects"."deleted_at" IS NULL;
