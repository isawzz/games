var uiActivatedTC;
const SIMPLE_COLORS =['red','green', 'yellow','blue'];
const EXTENDED_COLORS =['red','green', 'yellow','blue','pink','indigo','gray','sienna','olive'];
var NumColors;
const LevelsTC = {
	0: { NumColors:2, NumPics: 2, NumLabels: 4, MinWordLength: 2, MaxWordLength: 5, MaxNumTrials: 1 },
	1: { NumColors:2, NumPics: 3, NumLabels: 6, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
	2: { NumColors:3, NumPics: 2, NumLabels: 6, MinWordLength: 3, MaxWordLength: 7, MaxNumTrials: 1 },
	3: { NumColors:3, NumPics: 3, NumLabels: 9, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
	4: { NumColors:3, NumPics: 3, NumLabels: 0, MinWordLength: 4, MaxWordLength: 14, MaxNumTrials: 2 },
	5: { NumColors:2, NumPics: 2, NumLabels: 2, MinWordLength: 4, MaxWordLength: 8, MaxNumTrials: 1 },
	6: { NumColors:2, NumPics: 2, NumLabels: 2, MinWordLength: 4, MaxWordLength: 9, MaxNumTrials: 1 },
	7: { NumColors:2, NumPics: 2, NumLabels: 2, MinWordLength: 5, MaxWordLength: 10, MaxNumTrials: 2 },
	8: { NumColors:3, NumPics: 3, NumLabels: 9, MinWordLength: 5, MaxWordLength: 11, MaxNumTrials: 2 },
	9: { NumColors:3, NumPics: 3, NumLabels: 3, MinWordLength: 6, MaxWordLength: 12, MaxNumTrials: 2 },
	10: { NumColors:3, NumPics: 3, NumLabels: 0, MinWordLength: 6, MaxWordLength: 13, MaxNumTrials: 3 },
}
function startGameTC() { }
function startLevelTC() { levelTC(); }
function levelTC() {
	let levelInfo = LevelsTC[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys(['life'],true);
	NumPics = levelInfo.NumPics;
	NumLabels = levelInfo.NumLabels;
	NumColors = levelInfo.NumColors;
}
function startRoundTC() {
	uiActivatedTC = false;
}
function promptTC() {
	// let colors = choose(currentLevel<3?SIMPLE_COLORS:EXTENDED_COLORS,NumColors);
	let colors = choose(SIMPLE_COLORS,NumColors);
	showPictures(false, evaluate, colors);

	setGoal(randomNumber(0,NumPics*colors.length-1));
	Goal.correctionPhrase = Goal.shade+' '+Goal.label;

	let spoken = `click the ${Goal.shade} ${bestWord}`;
	showInstruction(bestWord, `click the <span style='color:${Goal.shade}'>${Goal.shade.toUpperCase()}</span>`, 
	dTitle,true, spoken);
	return 10;
}
function trialPromptTC(){
	say('try again');
	shortHintPic();
	return 10;

}
function activateTC() {
	uiActivatedTC = true;
}
function evalTC(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	let i = firstNumber(id);
	let item = Pictures[i];
	Selected = {pic:item,feedbackUI:item.div};

	if (item == Goal) { return true; } else { return false; }
}

