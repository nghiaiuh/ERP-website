import { pgTable, varchar, serial, text, timestamp, foreignKey, unique, integer, index, doublePrecision, boolean, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// Users table for authentication
export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	password: text().notNull(),
	username: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const alembicVersion = pgTable("alembic_version", {
	versionNum: varchar("version_num", { length: 32 }).primaryKey().notNull(),
});

export const teams = pgTable("teams", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	shortName: varchar("short_name", { length: 50 }),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const teamMapping = pgTable("team_mapping", {
	id: serial().primaryKey().notNull(),
	teamId: integer("team_id"),
	providerName: varchar("provider_name", { length: 50 }),
	providerTeamName: varchar("provider_team_name", { length: 100 }),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "team_mapping_team_id_fkey"
		}).onDelete("cascade"),
	unique("team_mapping_provider_name_provider_team_name_key").on(table.providerTeamName, table.providerName),
]);

export const leagues = pgTable("leagues", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	country: varchar({ length: 50 }),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const matches = pgTable("matches", {
	id: serial().primaryKey().notNull(),
	leagueId: integer("league_id"),
	homeTeamId: integer("home_team_id"),
	awayTeamId: integer("away_team_id"),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }).notNull(),
	status: varchar({ length: 20 }).default('NS'),
	homeScoreFt: integer("home_score_ft").default(0),
	awayScoreFt: integer("away_score_ft").default(0),
	homeScoreHt: integer("home_score_ht").default(0),
	awayScoreHt: integer("away_score_ht").default(0),
	homeCornersFt: integer("home_corners_ft").default(0),
	awayCornersFt: integer("away_corners_ft").default(0),
	homeYellowCardsFt: integer("home_yellow_cards_ft").default(0),
	awayYellowCardsFt: integer("away_yellow_cards_ft").default(0),
	providerMatchId: varchar("provider_match_id", { length: 50 }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_matches_status_time").using("btree", table.status.asc().nullsLast().op("text_ops"), table.startTime.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.leagueId],
			foreignColumns: [leagues.id],
			name: "matches_league_id_fkey"
		}),
	foreignKey({
			columns: [table.homeTeamId],
			foreignColumns: [teams.id],
			name: "matches_home_team_id_fkey"
		}),
	foreignKey({
			columns: [table.awayTeamId],
			foreignColumns: [teams.id],
			name: "matches_away_team_id_fkey"
		}),
	unique("matches_provider_match_id_key").on(table.providerMatchId),
]);

export const matchStats = pgTable("match_stats", {
	id: serial().primaryKey().notNull(),
	matchId: integer("match_id"),
	teamId: integer("team_id"),
	period: varchar({ length: 10 }),
	possession: integer(),
	shotsTotal: integer("shots_total"),
	shotsOnTarget: integer("shots_on_target"),
	blockedShots: integer("blocked_shots"),
	corners: integer(),
	yellowCards: integer("yellow_cards"),
	redCards: integer("red_cards"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_stats_match_period").using("btree", table.matchId.asc().nullsLast().op("int4_ops"), table.period.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "match_stats_match_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "match_stats_team_id_fkey"
		}),
]);

export const matchEvents = pgTable("match_events", {
	id: serial().primaryKey().notNull(),
	matchId: integer("match_id"),
	eventType: varchar("event_type", { length: 20 }),
	minute: integer(),
	extraMinute: integer("extra_minute").default(0),
	teamId: integer("team_id"),
	playerName: varchar("player_name", { length: 100 }),
	scoreAtEvent: varchar("score_at_event", { length: 10 }),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_events_match").using("btree", table.matchId.asc().nullsLast().op("int4_ops"), table.minute.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "match_events_match_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "match_events_team_id_fkey"
		}),
]);

export const marketOdds = pgTable("market_odds", {
	id: serial().primaryKey().notNull(),
	matchId: integer("match_id"),
	bookmakerName: varchar("bookmaker_name", { length: 50 }),
	marketCategory: varchar("market_category", { length: 50 }),
	marketName: varchar("market_name", { length: 100 }),
	period: varchar({ length: 20 }),
	line: doublePrecision(),
	selection: varchar({ length: 50 }),
	oddsValue: doublePrecision("odds_value").notNull(),
	isLive: boolean("is_live").default(false),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_odds_lookup").using("btree", table.matchId.asc().nullsLast().op("int4_ops"), table.marketName.asc().nullsLast().op("timestamptz_ops"), table.selection.asc().nullsLast().op("text_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "market_odds_match_id_fkey"
		}).onDelete("cascade"),
]);

export const virtualWallets = pgTable("virtual_wallets", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	balance: doublePrecision().default(10000),
	currency: varchar({ length: 10 }).default('VND'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const simulatedBets = pgTable("simulated_bets", {
	id: serial().primaryKey().notNull(),
	walletId: integer("wallet_id"),
	strategyId: integer("strategy_id"),
	matchId: integer("match_id"),
	marketName: varchar("market_name", { length: 100 }),
	selection: varchar({ length: 50 }),
	line: doublePrecision(),
	oddsAtBet: doublePrecision("odds_at_bet"),
	amount: doublePrecision(),
	status: varchar({ length: 20 }).default('PENDING'),
	pnl: doublePrecision().default(0),
	betTime: timestamp("bet_time", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	settledAt: timestamp("settled_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_bets_wallet").using("btree", table.walletId.asc().nullsLast().op("int4_ops"), table.status.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.walletId],
			foreignColumns: [virtualWallets.id],
			name: "simulated_bets_wallet_id_fkey"
		}),
	foreignKey({
			columns: [table.strategyId],
			foreignColumns: [strategies.id],
			name: "simulated_bets_strategy_id_fkey"
		}),
	foreignKey({
			columns: [table.matchId],
			foreignColumns: [matches.id],
			name: "simulated_bets_match_id_fkey"
		}),
]);

export const strategies = pgTable("strategies", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	logicConfig: jsonb("logic_config"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});
