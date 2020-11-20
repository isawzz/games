function saveStats() {
	let g = lastCond(CurrentSessionData.games, x => x.name == 'gSayPicAuto');
	let xxx = arrLast(g.levels).items;
	let yyy = xxx.map(x => {
		let res = { key: x.goal.key };
		res[currentLanguage] = { answer: x.goal.answer, req: x.goal.reqAnswer, conf: x.goal.confidence, isCorrect: x.isCorrect };
		return res;
	});
	downloadAsYaml({ data: yyy }, currentLanguage + '_' + currentCategories[0] + '_data');

}

function trainNextLanguage() {
	currentLanguage = 'D'; 
	console.log('switching language to',currentLanguage)
	//startGame();
}
function trainNextGroup() {
	const trainingGroups = ['kitchen', 'math', 'drink', 'misc',
		'activity', 'animal', 'body', 'clock', 'emotion', 'family', 'fantasy', 'food', 'fruit', 'game', 'gesture',
		'object', 'person', 'place', 'plant', 'punctuation', 'role', 'shapes', 'sport', 'sternzeichen', 'symbols', 'time', 'toolbar',
		'transport', 'vegetable'];
	let cats = currentCategories[0];
	let idx = trainingGroups.indexOf(cats);
	idx += 1;
	if (idx < trainingGroups.length) { currentCategories = [trainingGroups[idx]]; startGame(); }
}