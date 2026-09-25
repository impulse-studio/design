CREATE TABLE "mcp_revocation_cleanup" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mcp_revocation_cleanup" ADD CONSTRAINT "mcp_revocation_cleanup_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mcp_revocation_cleanup_user_client_idx" ON "mcp_revocation_cleanup" USING btree ("user_id","client_id");