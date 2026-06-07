/**
 * Phase 5 PostgreSQL schema draft (T-034) — Drizzle ORM types only.
 * No live DB connection; migrations deferred until DATABASE_URL + Human scope.
 * @see docs/phase5-schema-draft.md
 */
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// --- Auth.js core (standard adapter shape) ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
  },
  (table) => [unique().on(table.provider, table.providerAccountId)],
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("session_token").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// --- App tables (maps Zustand store) ---

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull().default("Мой проект"),
    deliveryApproach: text("delivery_approach").notNull(),
    phase: text("phase"),
    workstreamCount: integer("workstream_count"),
    locale: text("locale").notNull().default("ru"),
    importedFromLs: boolean("imported_from_ls").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_projects_user_id").on(table.userId)],
);

export const domainScores = pgTable(
  "domain_scores",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    domainId: text("domain_id").notNull(),
    value: smallint("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.domainId] })],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    details: text("details"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_audit_log_project_created").on(
      table.projectId,
      table.createdAt,
    ),
  ],
);

export const commentaryFeedback = pgTable("commentary_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const waitlistSignups = pgTable("waitlist_signups", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  source: text("source").default("waitlist"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Optional audit table — hot path stays Redis (T-036). */
export const tokenUsageDaily = pgTable(
  "token_usage_daily",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    usageDate: date("usage_date").notNull(),
    tokensUsed: integer("tokens_used").notNull().default(0),
    requestCount: integer("request_count").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.userId, table.usageDate] })],
);

export const authSchema = {
  users,
  accounts,
  sessions,
  verificationTokens,
};

export const appSchema = {
  projects,
  domainScores,
  auditLog,
  commentaryFeedback,
  waitlistSignups,
  tokenUsageDaily,
};

export const schema = { ...authSchema, ...appSchema };
