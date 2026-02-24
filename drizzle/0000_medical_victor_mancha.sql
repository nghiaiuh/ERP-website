CREATE TABLE "alembic_version" (
	"version_num" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leagues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"country" varchar(50),
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "market_odds" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"bookmaker_name" varchar(50),
	"market_category" varchar(50),
	"market_name" varchar(100),
	"period" varchar(20),
	"line" double precision,
	"selection" varchar(50),
	"odds_value" double precision NOT NULL,
	"is_live" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"event_type" varchar(20),
	"minute" integer,
	"extra_minute" integer DEFAULT 0,
	"team_id" integer,
	"player_name" varchar(100),
	"score_at_event" varchar(10),
	"description" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "match_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer,
	"team_id" integer,
	"period" varchar(10),
	"possession" integer,
	"shots_total" integer,
	"shots_on_target" integer,
	"blocked_shots" integer,
	"corners" integer,
	"yellow_cards" integer,
	"red_cards" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"league_id" integer,
	"home_team_id" integer,
	"away_team_id" integer,
	"start_time" timestamp with time zone NOT NULL,
	"status" varchar(20) DEFAULT 'NS',
	"home_score_ft" integer DEFAULT 0,
	"away_score_ft" integer DEFAULT 0,
	"home_score_ht" integer DEFAULT 0,
	"away_score_ht" integer DEFAULT 0,
	"home_corners_ft" integer DEFAULT 0,
	"away_corners_ft" integer DEFAULT 0,
	"home_yellow_cards_ft" integer DEFAULT 0,
	"away_yellow_cards_ft" integer DEFAULT 0,
	"provider_match_id" varchar(50),
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "matches_provider_match_id_key" UNIQUE("provider_match_id")
);
--> statement-breakpoint
CREATE TABLE "simulated_bets" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_id" integer,
	"strategy_id" integer,
	"match_id" integer,
	"market_name" varchar(100),
	"selection" varchar(50),
	"line" double precision,
	"odds_at_bet" double precision,
	"amount" double precision,
	"status" varchar(20) DEFAULT 'PENDING',
	"pnl" double precision DEFAULT 0,
	"bet_time" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"settled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"logic_config" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "team_mapping" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer,
	"provider_name" varchar(50),
	"provider_team_name" varchar(100),
	CONSTRAINT "team_mapping_provider_name_provider_team_name_key" UNIQUE("provider_team_name","provider_name")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"short_name" varchar(50),
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"name" varchar(100),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "virtual_wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"balance" double precision DEFAULT 10000,
	"currency" varchar(10) DEFAULT 'VND',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "market_odds" ADD CONSTRAINT "market_odds_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_stats" ADD CONSTRAINT "match_stats_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "public"."leagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_fkey" FOREIGN KEY ("home_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_fkey" FOREIGN KEY ("away_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulated_bets" ADD CONSTRAINT "simulated_bets_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."virtual_wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulated_bets" ADD CONSTRAINT "simulated_bets_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulated_bets" ADD CONSTRAINT "simulated_bets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_mapping" ADD CONSTRAINT "team_mapping_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_odds_lookup" ON "market_odds" USING btree ("match_id" int4_ops,"market_name" timestamptz_ops,"selection" text_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_match" ON "match_events" USING btree ("match_id" int4_ops,"minute" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_stats_match_period" ON "match_stats" USING btree ("match_id" int4_ops,"period" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_matches_status_time" ON "matches" USING btree ("status" text_ops,"start_time" text_ops);--> statement-breakpoint
CREATE INDEX "idx_bets_wallet" ON "simulated_bets" USING btree ("wallet_id" int4_ops,"status" int4_ops);