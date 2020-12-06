function ensureUserHistoryForGame(game) {
	if (nundef(UserHistory[game])) {
		UserHistory[game] = { name: game, nTotal: 0, nCorrect: 0, percentage: 100, startLevel: 0, maxLevelReached: 0 };
	}
}
function ensureUserHistoryForProgram() {
	if (nundef(UserHistory.program)) {
		UserHistory.program = jsCopy(Settings.program)
		UserHistory[game] = { name: game, nTotal: 0, nCorrect: 0, percentage: 100, startLevel: 0, maxLevelReached: 0 };
	}
}

function upgradeStartLevelForUser(game, level) {
	lookupSetOverride(UserHistory, [game, 'startLevel'], level);
	saveServerData();
}
