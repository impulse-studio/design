CREATE TABLE "library_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"library_id" text NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_seen_at" timestamp with time zone,
	"last_success_at" timestamp with time zone,
	"error" text,
	"digest" text,
	CONSTRAINT "library_connections_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "library_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"library_id" text NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_libraries" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"framework" text NOT NULL,
	"version" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "can_manage_libraries" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "library_connections" ADD CONSTRAINT "library_connections_library_id_team_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."team_libraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_connections" ADD CONSTRAINT "library_connections_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_versions" ADD CONSTRAINT "library_versions_library_id_team_libraries_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."team_libraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_versions" ADD CONSTRAINT "library_versions_created_by_auth_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."auth_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_libraries" ADD CONSTRAINT "team_libraries_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "library_connections_library_idx" ON "library_connections" USING btree ("library_id");--> statement-breakpoint
CREATE UNIQUE INDEX "library_versions_number_idx" ON "library_versions" USING btree ("library_id","version");--> statement-breakpoint
CREATE INDEX "team_libraries_organization_idx" ON "team_libraries" USING btree ("organization_id");