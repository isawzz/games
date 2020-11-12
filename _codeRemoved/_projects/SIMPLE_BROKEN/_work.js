function saveAnswerStatistic() {
	// das ist nur bei dem gSayPicAuto game
	let g = CurrentGameData;

	let items = last(g.levels).items;
	console.log(items);

	let correctAnswers = items.filter(x => x.isCorrect == STATES.CORRECT && x.answer == x.reqAnswer);
	console.log('correctAnswers', correctAnswers)
	let saveable = correctAnswers.map(x => {
		console.log(x); return { key: x.key, reqAnswer: x.reqAnswer, answer: x.answer };
	});
	saveable.map(x => console.log('correct:', x.key, x.reqAnswer, x.answer));

	downloadAsYaml({ correct: saveable }, 'CORRECT');
}


// var goodWordsForSpeech={
// 	onion,rose,die,penguin,bottle,computer
// }

// var goodButNotAsEasy={
// 	slipper,mosque,pray,confetti,
// }
// var goodButNeedHint={
// 	money, oil drum, sponge, down, up
// }

// var badWordsForSPeech={
// 	'hat',wrap,goggles,cut,mad,sun,hand,
// }

var nextIndex = -1;
function autoTestSpeech() {
	ensureSymBySet();

	nextIndex += 1;

	let k = SymKeysBySet['nosymbols'][nextIndex];
	let info = SymbolDict[k];
	let best = stringAfterLast(info.E, '|');
	console.log('best', best, '(key', k, ')');
	record('E', best)
	say(best, .7, 1, .7, false, 'random', () => { console.log('done:', k) });



}





















