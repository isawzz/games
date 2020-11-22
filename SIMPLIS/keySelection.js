function scoreSummary() {

	let game = {};
	for (const gdata of CurrentSessionData.games) {
		//let gData=CurrentSessionData.games[gname];
		let gname = gdata.name;
		let nTotal = 0;
		let nCorrect = 0;
		for (const ldata of gdata.levels) {
			if (nundef(ldata.numTotalAnswers)) continue;
			nTotal += ldata.numTotalAnswers;
			nCorrect += ldata.numCorrectAnswers;
		}
		if (nTotal == 0) continue;
		if (isdef(game[gname])) {
			game[gname].nTotal += nTotal;
			game[gname].nCorrect += nCorrect;
		} else {
			game[gname] = { nTotal: nTotal, nCorrect: nCorrect };
		}


	}
	console.log('game',game);
	for (const gname in game) {
		let tot=game[gname].nTotal;
		let corr = game[gname].nCorrect;
		console.log(gname,tot,corr)
		game[gname].percentage = (game[gname].nCorrect / Math.max(1, game[gname].nTotal))*100;
	}



	//let dParent=mBy('freezer2');
	let d = mBy('dContentFreezer2');
	clearElement(d);
	mStyleX(d, { fz: 20, matop: 40, bg: 'silver', fg: 'indigo', rounding: 20, padding: 25 })
	let style = { matop: 4 };
	mText('Unit Score:', d, { fz: 22 });
	
	for(const gname in game){
		//let name = gname.substring(1);
		let sc=game[gname];

		mText(`${GFUNC[gname].friendlyName}: ${sc.nCorrect}/${sc.nTotal} correct answers (${sc.percentage}%) `, d, style);

	}
	// mText('Writing: 10/15 correct answers (70%)', d, style);
	// mText('Speaking: 10/15 correct answers (70%)', d, style);
	// mText('Completing Words: 10/15 correct answers (70%)', d, style);
	// mText('Identifying Words: 10/15 correct answers (70%)', d, style);
	// mText('Colors and Words: 10/15 correct answers (70%)', d, style);

	//session scores should be downloaded!


}















