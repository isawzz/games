function scoreSummary() {

	//wie bekomm ich UnitScoreSummary???
	//wo startet eine neue unit????
	//ich habe jetzt den UnitScoreSummary

	//calc SessionScoreSummary
	let scoreByGame = {};
	for (const gdata of CurrentSessionData.games) {
		let gname = gdata.name;
		let nTotal = 0;
		let nCorrect = 0;
		for (const ldata of gdata.levels) {
			if (nundef(ldata.numTotalAnswers)) continue;
			nTotal += ldata.numTotalAnswers;
			nCorrect += ldata.numCorrectAnswers;
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
		//console.log(gname,tot,corr)
		scoreByGame[gname].percentage = Math.round((corr / tot) * 100);
	}

	// mText('Writing: 10/15 correct answers (70%)', d, style);
	return scoreByGame;

}















