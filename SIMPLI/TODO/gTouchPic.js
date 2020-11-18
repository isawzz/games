var uiActivated;
const LevelsTP = {
	0: { NumPics: 2, NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
	1: { NumPics: 3, NumLabels: 3, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 1 },
	2: { NumPics: 2, NumLabels: 1, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
	3: { NumPics: 3, NumLabels: 2, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
	4: { NumPics: 2, NumLabels: 0, MinWordLength: 4, MaxWordLength: 8, MaxNumTrials: 1 },
	5: { NumPics: 4, NumLabels: 4, MinWordLength: 4, MaxWordLength: 9, MaxNumTrials: 1 },
	6: { NumPics: 3, NumLabels: 1, MinWordLength: 5, MaxWordLength: 10, MaxNumTrials: 2 },
	7: { NumPics: 4, NumLabels: 2, MinWordLength: 5, MaxWordLength: 11, MaxNumTrials: 1 },
	8: { NumPics: 5, NumLabels: 5, MinWordLength: 6, MaxWordLength: 12, MaxNumTrials: 1 },
	9: { NumPics: 3, NumLabels: 0, MinWordLength: 6, MaxWordLength: 13, MaxNumTrials: 2 },
	10: { NumPics: 4, NumLabels: 0, MinWordLength: 4, MaxWordLength: 14, MaxNumTrials: 2 },
}
function startGameTP() { }
function startLevelTP() { levelTP(); }
function levelTP() {
	let levelInfo = LevelsTP[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys();
	NumPics = levelInfo.NumPics;	
	NumLabels = levelInfo.NumLabels;
}
function startRoundTP() {
	uiActivated = false;
}
function promptTP() {
	showPictures(false, evaluate);
	setGoal();
	showInstruction(bestWord, 'click', dTitle, true);
	return 10;
}
function trialPromptTP(){
	say('try again');
	shortHintPic();
	return 10;
}
function activateTP() {
	uiActivated = true;
}
function evalTP(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	let i = firstNumber(id);
	let item = Pictures[i];
	Selected = {pic:item,feedbackUI:item.div, sz:getBounds(item.div).height};

	if (item.label == bestWord) { return true; } else { return false; }
}

