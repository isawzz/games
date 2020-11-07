var uiActivatedTC;
const LevelsTC = {
	0: { NumPics: 2, NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
	1: { NumPics: 3, NumLabels: 3, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 1 },
	2: { NumPics: 2, NumLabels: 1, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
	3: { NumPics: 3, NumLabels: 2, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
	4: { NumPics: 2, NumLabels: 0, MinWordLength: 4, MaxWordLength: 8, MaxNumTrials: 1 },
	5: { NumPics: 4, NumLabels: 4, MinWordLength: 4, MaxWordLength: 9, MaxNumTrials: 1 },
	6: { NumPics: 3, NumLabels: 1, MinWordLength: 5, MaxWordLength: 10, MaxNumTrials: 1 },
	7: { NumPics: 4, NumLabels: 2, MinWordLength: 5, MaxWordLength: 11, MaxNumTrials: 1 },
	8: { NumPics: 5, NumLabels: 5, MinWordLength: 6, MaxWordLength: 12, MaxNumTrials: 1 },
	9: { NumPics: 3, NumLabels: 0, MinWordLength: 6, MaxWordLength: 13, MaxNumTrials: 1 },
	10: { NumPics: 4, NumLabels: 0, MinWordLength: 4, MaxWordLength: 14, MaxNumTrials: 1 },
}
function startGameTC() { }
function startLevelTC() { levelTC(); }
function levelTC() {
	//console.log(currentLevel)
	let levelInfo = LevelsTC[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys(['animal','food']);
	NumPics = levelInfo.NumPics;	// NumPics = (currentLevel <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + currentLevel; 
	NumLabels = levelInfo.NumLabels;
	//writeComments();
}
function startRoundTC() {
	uiActivatedTC = false;
}
function promptTC() {
	let colors = ['red','green', 'yellow'];
	showPictures(false, evaluate, colors);

	setGoal(randomNumber(0,NumPics*colors.length-1));
	Goal.correctionPhrase = Goal.shade+' '+Goal.label;

	console.log('________\ngoal id is',Goal.id)

	showInstruction(bestWord, 'click the ' +Goal.shade.toUpperCase(), dTitle);
	return 10;
}
function activateTC() {
	uiActivatedTC = true;
}
function evalTC(ev) {
	let id = evToClosestId(ev);
	console.log('clicked',id);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Selected = Pictures[i];

	//console.log(item.info.best)
	if (item == Goal) { return STATES.CORRECT; } else { return STATES.INCORRECT; }
}

