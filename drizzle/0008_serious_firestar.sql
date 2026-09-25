CREATE INDEX "oauth_access_token_user_client_idx" ON "oauth_access_token" USING btree ("user_id","client_id");--> statement-breakpoint
CREATE INDEX "oauth_consent_user_client_idx" ON "oauth_consent" USING btree ("user_id","client_id");--> statement-breakpoint
CREATE INDEX "oauth_refresh_token_user_client_idx" ON "oauth_refresh_token" USING btree ("user_id","client_id");