import {
  index,
  integer,
  jsonb,
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import type { UIMessage } from "ai"
import type { MockupDoc } from "@digit-ai-studio/shared"
import type { ProposalInput } from "@/features/ai/operations"
import type { AiRunStatus, RunContext } from "@/features/ai/types"

export const user = pgTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const session = pgTable(
  "auth_session",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    activeOrganizationId: text("active_organization_id"),
  },
  (table) => [index("auth_session_user_idx").on(table.userId)]
)

export const account = pgTable(
  "auth_account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("auth_account_user_idx").on(table.userId),
    uniqueIndex("auth_account_provider_idx").on(
      table.providerId,
      table.accountId
    ),
  ]
)

export const verification = pgTable(
  "auth_verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("auth_verification_identifier_idx").on(table.identifier)]
)

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    canManageLibraries: boolean("can_manage_libraries").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("member_organization_user_idx").on(
      table.organizationId,
      table.userId
    ),
    index("member_user_idx").on(table.userId),
  ]
)

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").notNull().default("pending"),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("invitation_organization_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ]
)

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id"),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "restrict",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("projects_owner_updated_idx")
      .on(table.ownerId, table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
  ]
)
export const mockupStatus = pgEnum("mockup_status", [
  "draft",
  "in_progress",
  "in_review",
  "approved",
])
export const mockups = pgTable(
  "mockups",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "restrict",
    }),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    notionUrl: text("notion_url"),
    githubUrl: text("github_url"),
    status: mockupStatus("status").notNull().default("draft"),
    revision: integer("revision").notNull().default(0),
    doc: jsonb("doc").$type<MockupDoc>().notNull(),
    libVersion: text("lib_version").notNull().default("dev"),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("mockups_organization_updated_idx").on(
      table.organizationId,
      table.updatedAt.desc()
    ),
    index("mockups_updated_idx")
      .on(table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
    index("mockups_project_updated_idx")
      .on(table.projectId, table.updatedAt.desc())
      .where(sql`${table.deletedAt} IS NULL`),
  ]
)

// Legacy connection preferences retained for migration compatibility; no credentials.
export const aiConnections = pgTable("ai_connections", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    mockupId: text("mockup_id")
      .notNull()
      .references(() => mockups.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    transcript: jsonb("transcript").$type<UIMessage[]>().notNull().default([]),
    transcriptState: jsonb("transcript_state").$type<unknown>(),
    lastEventId: text("last_event_id"),
    triggerSessionId: text("trigger_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("ai_conversations_owner_idx").on(
      table.userId,
      table.mockupId,
      table.updatedAt
    ),
  ]
)
export const aiRuns = pgTable(
  "ai_runs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => aiConversations.id, { onDelete: "cascade" }),
    requestId: text("request_id").notNull(),
    model: text("model").notNull(),
    provider: text("provider").notNull().default("legacy"),
    triggerRunId: text("trigger_run_id"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    prompt: text("prompt").notNull(),
    answer: text("answer").notNull().default(""),
    context: jsonb("context").$type<RunContext>().notNull(),
    status: text("status").$type<AiRunStatus>().notNull().default("queued"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_runs_idempotency_idx").on(table.userId, table.requestId),
    uniqueIndex("ai_runs_active_user_idx")
      .on(table.userId)
      .where(sql`${table.status} IN ('queued', 'running')`),
    index("ai_runs_conversation_idx").on(table.conversationId, table.createdAt),
    index("ai_runs_queue_idx").on(table.status, table.createdAt),
  ]
)
export const aiProposals = pgTable(
  "ai_proposals",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => aiRuns.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").notNull(),
    input: jsonb("input").$type<ProposalInput>().notNull(),
    baseRevision: integer("base_revision").notNull(),
    baseHash: text("base_hash").notNull(),
    resultHash: text("result_hash").notNull(),
    status: text("status")
      .$type<"pending" | "applied" | "rejected">()
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("ai_proposals_tool_idx").on(table.runId, table.toolCallId),
  ]
)

// Short-lived nonce receipts; never stores callback bodies, prompts or credentials.
export const aiCallbackReceipts = pgTable(
  "ai_callback_receipts",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("ai_callback_receipts_expiry_idx").on(table.expiresAt)]
)
export const oauthClient = pgTable("oauth_client", {
  id: text("id").primaryKey(),
  clientId: text("client_id").notNull().unique(),
  clientSecret: text("client_secret"),
  clientDiscoveryId: text("client_discovery_id"),
  disabled: boolean("disabled"),
  skipConsent: boolean("skip_consent"),
  enableEndSession: boolean("enable_end_session"),
  subjectType: text("subject_type"),
  scopes: text("scopes").array(),
  clientCredentialsScopes: text("client_credentials_scopes").array(),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  name: text("name"),
  uri: text("uri"),
  icon: text("icon"),
  contacts: text("contacts").array(),
  tos: text("tos"),
  policy: text("policy"),
  softwareId: text("software_id"),
  softwareVersion: text("software_version"),
  softwareStatement: text("software_statement"),
  redirectUris: text("redirect_uris").array().notNull(),
  postLogoutRedirectUris: text("post_logout_redirect_uris").array(),
  backchannelLogoutUri: text("backchannel_logout_uri"),
  backchannelLogoutSessionRequired: boolean(
    "backchannel_logout_session_required"
  ),
  tokenEndpointAuthMethod: text("token_endpoint_auth_method"),
  applicationType: text("application_type"),
  jwks: text("jwks"),
  jwksUri: text("jwks_uri"),
  grantTypes: text("grant_types").array(),
  responseTypes: text("response_types").array(),
  requirePKCE: boolean("require_p_k_c_e"),
  dpopBoundAccessTokens: boolean("dpop_bound_access_tokens"),
  referenceId: text("reference_id"),
  metadata: jsonb("metadata"),
})

export const oauthResource = pgTable("oauth_resource", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull().unique(),
  name: text("name").notNull(),
  accessTokenTtl: integer("access_token_ttl"),
  refreshTokenTtl: integer("refresh_token_ttl"),
  signingAlgorithm: text("signing_algorithm"),
  signingKeyId: text("signing_key_id"),
  allowedScopes: text("allowed_scopes").array(),
  customClaims: jsonb("custom_claims"),
  dpopBoundAccessTokensRequired: boolean("dpop_bound_access_tokens_required"),
  disabled: boolean("disabled"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  policyVersion: integer("policy_version"),
  metadata: jsonb("metadata"),
})

export const oauthClientResource = pgTable(
  "oauth_client_resource",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id").notNull(),
    resourceId: text("resource_id").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("oauth_client_resource_unique_idx").on(
      table.clientId,
      table.resourceId
    ),
  ]
)

export const oauthRefreshToken = pgTable(
  "oauth_refresh_token",
  {
    id: text("id").primaryKey(),
    token: text("token").notNull().unique(),
    clientId: text("client_id").notNull(),
    sessionId: text("session_id"),
    userId: text("user_id").notNull(),
    referenceId: text("reference_id"),
    authorizationCodeId: text("authorization_code_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }),
    revoked: timestamp("revoked", { withTimezone: true }),
    rotatedAt: timestamp("rotated_at", { withTimezone: true }),
    rotationReplayResponse: text("rotation_replay_response"),
    rotationReplayExpiresAt: timestamp("rotation_replay_expires_at", {
      withTimezone: true,
    }),
    authTime: timestamp("auth_time", { withTimezone: true }),
    confirmation: jsonb("confirmation"),
    scopes: text("scopes").array().notNull(),
  },
  (table) => [
    index("oauth_refresh_token_user_client_idx").on(
      table.userId,
      table.clientId
    ),
  ]
)

export const oauthAccessToken = pgTable(
  "oauth_access_token",
  {
    id: text("id").primaryKey(),
    token: text("token").unique(),
    clientId: text("client_id").notNull(),
    sessionId: text("session_id"),
    userId: text("user_id"),
    referenceId: text("reference_id"),
    authorizationCodeId: text("authorization_code_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    refreshId: text("refresh_id"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }),
    revoked: timestamp("revoked", { withTimezone: true }),
    confirmation: jsonb("confirmation"),
    scopes: text("scopes").array().notNull(),
  },
  (table) => [
    index("oauth_access_token_user_client_idx").on(
      table.userId,
      table.clientId
    ),
  ]
)

export const oauthConsent = pgTable(
  "oauth_consent",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id").notNull(),
    userId: text("user_id"),
    referenceId: text("reference_id"),
    resources: text("resources").array(),
    requestedUserInfoClaims: text("requested_user_info_claims").array(),
    scopes: text("scopes").array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("oauth_consent_user_client_idx").on(table.userId, table.clientId),
  ]
)

export const oauthClientAssertion = pgTable("oauth_client_assertion", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
})

export const jwks = pgTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  alg: text("alg"),
  crv: text("crv"),
})

// File-backed React projects coexist with legacy mockup documents.
export const siteProjects = pgTable("site_projects", {
  id: text("id")
    .primaryKey()
    .references(() => mockups.id, { onDelete: "cascade" }),
  doc: jsonb("doc")
    .$type<import("../features/sites/schema").SiteDocument>()
    .notNull(),
  revision: integer("revision").notNull().default(0),
})
export const siteVersions = pgTable(
  "site_versions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => siteProjects.id, { onDelete: "cascade" }),
    revision: integer("revision").notNull(),
    doc: jsonb("doc")
      .$type<import("../features/sites/schema").SiteDocument>()
      .notNull(),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("site_version_revision_idx").on(
      table.projectId,
      table.revision
    ),
  ]
)
export const siteProposals = pgTable(
  "site_proposals",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => siteProjects.id, { onDelete: "cascade" }),
    runId: text("run_id")
      .notNull()
      .references(() => aiRuns.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").notNull(),
    baseRevision: integer("base_revision").notNull(),
    input: jsonb("input")
      .$type<import("../features/sites/schema").SiteProposal>()
      .notNull(),
    status: text("status").notNull().default("pending"),
  },
  (table) => [
    uniqueIndex("site_proposal_call_idx").on(table.runId, table.toolCallId),
  ]
)

export const teamLibraries = pgTable("team_libraries", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, {onDelete:"cascade"}),
  name: text("name").notNull(),
  framework: text("framework").notNull(),
  version: integer("version").notNull().default(0),
  updatedAt: timestamp("updated_at", {withTimezone:true}).notNull().defaultNow(),
}, table => [index("team_libraries_organization_idx").on(table.organizationId)])
export const libraryVersions = pgTable("library_versions", {
  id: text("id").primaryKey(),
  libraryId: text("library_id").notNull().references(() => teamLibraries.id, {onDelete:"cascade"}),
  version: integer("version").notNull(),
  snapshot: jsonb("snapshot").$type<import("../features/libraries/schema").LibrarySnapshot>().notNull(),
  createdBy: text("created_by").references(() => user.id, {onDelete:"set null"}),
  createdAt: timestamp("created_at", {withTimezone:true}).notNull().defaultNow(),
}, table => [uniqueIndex("library_versions_number_idx").on(table.libraryId, table.version)])
export const libraryConnections = pgTable("library_connections", {
  id: text("id").primaryKey(),
  libraryId: text("library_id").notNull().references(() => teamLibraries.id, {onDelete:"cascade"}),
  userId: text("user_id").notNull().references(() => user.id, {onDelete:"cascade"}),
  tokenHash: text("token_hash").notNull().unique(),
  claimed: boolean("claimed").notNull().default(false),
  expiresAt: timestamp("expires_at", {withTimezone:true}).notNull(),
  revokedAt: timestamp("revoked_at", {withTimezone:true}),
  lastSeenAt: timestamp("last_seen_at", {withTimezone:true}),
  lastSuccessAt: timestamp("last_success_at", {withTimezone:true}),
  error: text("error"),
  digest: text("digest"),
}, table => [index("library_connections_library_idx").on(table.libraryId)])
