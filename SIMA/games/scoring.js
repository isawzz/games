function showScore() {
	let scoreString = scoringMode == 'n' ? 'question: ' + (Score.nTotal + 1) + '/' + Settings.samplesPerLevel :
		scoringMode == 'percent' ? 'score: ' + Score.nCorrect + '/' + Score.nTotal + ' (' + percentageCorrect + '%)'
			: scoringMode == 'inc' ? 'score: ' + levelPoints + ' (' + percentageCorrect + '%)'
				: 'question: ' + Score.nTotal + '/' + Settings.samplesPerLevel;

	if (LevelChange)
		dScore.innerHTML = scoreString;
	else
		setTimeout(() => { dScore.innerHTML = scoreString; }, 300);
}
function resetScore() {	Score={nTotal:0,nCorrect:0,nCorrect1:0,nPos:0,nNeg:0};}
function scoreSummary() {

	let scoreByGame = {};
	for (const gdata of CurrentSessionData.games) {
		let gname = gdata.name;
		let nTotal = 0;
		let nCorrect = 0;
		for (const ldata of gdata.levels) {
			if (nundef(ldata.Score.nTotal)) continue;
			nTotal += ldata.Score.nTotal;
			nCorrect += ldata.Score.nCorrect;
		}
		if (nTotal == 0) continue;
		if (isdef(scoreByGame[gname])) {
			scoreByGame[gname].nTotal += nTotal;
			scoreByGame[gname].nCorrect += nCorrect;
		} else {
			scoreByGame[gname] = { name: gname, nTotal: nTotal, nCorrect: nCorrect };
		}
	}
	//console.log('game',game);
	for (const gname in scoreByGame) {
		let tot = scoreByGame[gname].nTotal;
		if (nundef(tot) || tot == 0) continue;
		let corr = scoreByGame[gname].nCorrect;
		scoreByGame[gname].percentage = Math.round((corr / tot) * 100);
	}

	return scoreByGame;

}
function lastStreakFalse(items) {
	let n = Settings.decrementLevelOnNegativeStreak;
	let iFrom = items.length - 1;
	let iTo = iFrom - n;
	for (let i = iFrom; i > iTo; i--) {
		if (i < 0) return false;
		else if (items[i].isCorrect) return false;
	}
	return true;

}
function lastStreakCorrect(items) {
	let n = Settings.incrementLevelOnPositiveStreak;
	let iFrom = items.length - 1;
	let iTo = iFrom - n;
	for (let i = iFrom; i > iTo; i--) {
		if (i < 0) return false;
		else if (!items[i].isCorrect) return false;
	}
	return true;

}
function scoring(isCorrect) {

	//console.log('===>SCORING ************')

	CurrentGoalData = {
		key: Goal.key, isCorrect: IsAnswerCorrect, reqAnswer: Selected.reqAnswer, answer: Selected.answer,
	};
	CurrentLevelData.items.push(CurrentGoalData);

	Score.nTotal += 1;
	if (isCorrect) Score.nCorrect += 1;

	//percent scoringMode:
	percentageCorrect = Math.round(100 * Score.nCorrect / Score.nTotal);

	//inc scoringMode:
	if (isCorrect) {
		levelPoints += levelIncrement; if (levelIncrement < maxIncrement) levelIncrement += 1;
		Score.nPos += 1; Score.nNeg = 0;
	} else {
		levelIncrement = minIncrement; levelPoints += minIncrement;
		Score.nPos = 0; Score.nNeg += 1;
	}

	//see if it is time for level change check
	let levelChange = 0;
	let nextLevel = G.level;

	if (Score.nTotal >= Settings.samplesPerLevel) {
		if (scoringMode == 'inc') {
			if (levelPoints >= levelDonePoints && percentageCorrect >= 50) {
				levelChange = 1; nextLevel += 1;
			}


		} else if (scoringMode == 'percent') {
			if (percentageCorrect >= 80) { levelChange = 1; nextLevel += 1; }
			else if (percentageCorrect < 50) { levelChange = -1; if (nextLevel > 0) nextLevel -= 1; }

		} else if (scoringMode == 'autograde') {
			saveStats();
			levelChange = 1;
			nextLevel += 1;

		} else if (scoringMode == 'n' || scoringMode == 'adapt') {
			if (Score.nCorrect > Score.nTotal / 2) { levelChange = 1; nextLevel += 1; }
			else if (Score.nCorrect < Score.nTotal / 2) {
				//console.log('DOWNGRADING!!!!!!!')
				levelChange = -1; nextLevel = (nextLevel > 0 ? nextLevel - 1 : 0);
			}
		}
	}


	if (scoringMode == 'adapt' && levelChange == 0) {

		// look at this level history:
		let items = CurrentLevelData.items;
		let pos = Settings.incrementLevelOnPositiveStreak;
		let posSeq = pos > 0 && Score.nPos >= pos;
		let neg = Settings.decrementLevelOnNegativeStreak;
		let negSeq = neg > 0 && Score.nNeg >= neg;
		let hasLabels = Settings.labels;

		if (posSeq && hasLabels && Settings.showLabels == 'toggle') { Score.nPos = 0; Settings.labels = false; }
		else if (posSeq) { levelChange = 1; nextLevel += 1; Score.nPos = 0; }
		if (negSeq && !hasLabels && Settings.showLabels == 'toggle') { Score.nNeg = 0; Settings.labels = true; }
		else if (negSeq) { levelChange = -1; if (nextLevel > 0) nextLevel -= 1; Score.nNeg = 0; }

	}

	//console.log('levelChange', levelChange, 'nextLevel', nextLevel)

	let toggle = Settings.showLabels == 'toggle';
	let hasLabels = Settings.labels;

	if (levelChange) {
		CurrentLevelData.Score.nTotal = Score.nTotal;
		CurrentLevelData.Score.nCorrect = Score.nCorrect;
		CurrentLevelData.percentageCorrect = percentageCorrect;

		//upgrade startLevel for this user if reached 100%
		//console.log('==>scoring',percentageCorrect,nextLevel,G.maxLevel,levelChange);
		if (percentageCorrect >= 100 && nextLevel>0 && nextLevel <= G.maxLevel) upgradeStartLevelForUser(G.key, nextLevel);
		else if (levelChange < 0) upgradeStartLevelForUser(G.key, nextLevel);

		let gdata = isdef(UnitScoreSummary[G.key]) ? UnitScoreSummary[G.key] : { name: G.key, nTotal: 0, nCorrect: 0 };
		gdata.nTotal += Score.nTotal;
		gdata.nCorrect += Score.nCorrect;
		gdata.percentage = Math.round(100 * gdata.nCorrect / gdata.nTotal);
		UnitScoreSummary[G.key] = gdata;

		if (toggle) Settings.labels = true;

	} else if (toggle && hasLabels && Score.nTotal >= Settings.samplesPerLevel / 2) {
		Settings.labels = false;
	}
	return [levelChange, nextLevel];
}



