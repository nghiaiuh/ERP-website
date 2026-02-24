import { relations } from "drizzle-orm/relations";
import { teams, teamMapping, leagues, matches, matchStats, matchEvents, marketOdds, virtualWallets, simulatedBets, strategies } from "./schema";

export const teamMappingRelations = relations(teamMapping, ({one}) => ({
	team: one(teams, {
		fields: [teamMapping.teamId],
		references: [teams.id]
	}),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	teamMappings: many(teamMapping),
	matches_homeTeamId: many(matches, {
		relationName: "matches_homeTeamId_teams_id"
	}),
	matches_awayTeamId: many(matches, {
		relationName: "matches_awayTeamId_teams_id"
	}),
	matchStats: many(matchStats),
	matchEvents: many(matchEvents),
}));

export const matchesRelations = relations(matches, ({one, many}) => ({
	league: one(leagues, {
		fields: [matches.leagueId],
		references: [leagues.id]
	}),
	team_homeTeamId: one(teams, {
		fields: [matches.homeTeamId],
		references: [teams.id],
		relationName: "matches_homeTeamId_teams_id"
	}),
	team_awayTeamId: one(teams, {
		fields: [matches.awayTeamId],
		references: [teams.id],
		relationName: "matches_awayTeamId_teams_id"
	}),
	matchStats: many(matchStats),
	matchEvents: many(matchEvents),
	marketOdds: many(marketOdds),
	simulatedBets: many(simulatedBets),
}));

export const leaguesRelations = relations(leagues, ({many}) => ({
	matches: many(matches),
}));

export const matchStatsRelations = relations(matchStats, ({one}) => ({
	match: one(matches, {
		fields: [matchStats.matchId],
		references: [matches.id]
	}),
	team: one(teams, {
		fields: [matchStats.teamId],
		references: [teams.id]
	}),
}));

export const matchEventsRelations = relations(matchEvents, ({one}) => ({
	match: one(matches, {
		fields: [matchEvents.matchId],
		references: [matches.id]
	}),
	team: one(teams, {
		fields: [matchEvents.teamId],
		references: [teams.id]
	}),
}));

export const marketOddsRelations = relations(marketOdds, ({one}) => ({
	match: one(matches, {
		fields: [marketOdds.matchId],
		references: [matches.id]
	}),
}));

export const simulatedBetsRelations = relations(simulatedBets, ({one}) => ({
	virtualWallet: one(virtualWallets, {
		fields: [simulatedBets.walletId],
		references: [virtualWallets.id]
	}),
	strategy: one(strategies, {
		fields: [simulatedBets.strategyId],
		references: [strategies.id]
	}),
	match: one(matches, {
		fields: [simulatedBets.matchId],
		references: [matches.id]
	}),
}));

export const virtualWalletsRelations = relations(virtualWallets, ({many}) => ({
	simulatedBets: many(simulatedBets),
}));

export const strategiesRelations = relations(strategies, ({many}) => ({
	simulatedBets: many(simulatedBets),
}));