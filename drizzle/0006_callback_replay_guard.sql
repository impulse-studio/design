CREATE TABLE "ai_callback_receipts" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ai_callback_receipts_expiry_idx" ON "ai_callback_receipts" USING btree ("expires_at");