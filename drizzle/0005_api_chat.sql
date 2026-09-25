ALTER TABLE "ai_conversations" ADD COLUMN "transcript" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD COLUMN "transcript_state" jsonb;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD COLUMN "last_event_id" text;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD COLUMN "trigger_session_id" text;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD COLUMN "provider" text DEFAULT 'legacy' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD COLUMN "trigger_run_id" text;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD COLUMN "started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD COLUMN "input_tokens" integer;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD COLUMN "output_tokens" integer;
--> statement-breakpoint
UPDATE ai_runs SET status = 'interrupted', error = 'Ancienne génération Codex interrompue lors du passage aux API.' WHERE status IN ('queued', 'running');
--> statement-breakpoint
UPDATE ai_conversations c SET transcript = COALESCE((
 SELECT jsonb_agg(m.message ORDER BY r.created_at, m.position)
 FROM ai_runs r CROSS JOIN LATERAL (VALUES
 (0, jsonb_build_object('id', r.id || ':user', 'role', 'user', 'parts', jsonb_build_array(jsonb_build_object('type', 'text', 'text', r.prompt)))),
 (1, jsonb_build_object('id', r.id || ':assistant', 'role', 'assistant', 'parts', jsonb_build_array(jsonb_build_object('type', 'text', 'text', r.answer))))
 ) AS m(position, message) WHERE r.conversation_id = c.id
), '[]'::jsonb);
