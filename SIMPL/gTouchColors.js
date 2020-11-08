var uiActivatedTC;
const SIMPLE_COLORS =['red','green', 'yellow','blue'];
const EXTENDED_COLORS =['red','green', 'yellow','blue','pink','indigo','gray','sienna','olive'];
var NumColors;
const LevelsTC = {
	0: { NumColors:2, NumPics: 2, NumLabels: 4, MinWordLength: 2, MaxWordLength: 5, MaxNumTrials: 1 },
	1: { NumColors:2, NumPics: 3, NumLabels: 6, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
	2: { NumColors:3, NumPics: 2, NumLabels: 6, MinWordLength: 3, MaxWordLength: 7, MaxNumTrials: 1 },
	3: { NumColors:3, NumPics: 3, NumLabels: 9, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
	4: { NumColors:2, NumPics: 2, NumLabels: 2, MinWordLength: 4, MaxWordLength: 8, MaxNumTrials: 1 },
	5: { NumColors:2, NumPics: 4, NumLabels: 4, MinWordLength: 4, MaxWordLength: 9, MaxNumTrials: 1 },
	6: { NumColors:2, NumPics: 3, NumLabels: 2, MinWordLength: 5, MaxWordLength: 10, MaxNumTrials: 2 },
	7: { NumColors:2, NumPics: 4, NumLabels: 2, MinWordLength: 5, MaxWordLength: 11, MaxNumTrials: 2 },
	8: { NumColors:3, NumPics: 3, NumLabels: 3, MinWordLength: 6, MaxWordLength: 12, MaxNumTrials: 2 },
	9: { NumColors:5, NumPics: 5, NumLabels: 0, MinWordLength: 6, MaxWordLength: 13, MaxNumTrials: 3 },
	10: { NumColors:3, NumPics: 3, NumLabels: 0, MinWordLength: 4, MaxWordLength: 14, MaxNumTrials: 2 },
}
function startGameTC() { }
function startLevelTC() { levelTC(); }
function levelTC() {
	//console.log(currentLevel)
	let levelInfo = LevelsTC[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys(['life'],true);
	//console.log('keys',currentKeys.length)
	NumPics = levelInfo.NumPics;	// NumPics = (currentLevel <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + currentLevel; 
	NumLabels = levelInfo.NumLabels;
	NumColors = levelInfo.NumColors;
	//writeComments();
}
function startRoundTC() {
	uiActivatedTC = false;
}
function promptTC() {
	let colors = choose(currentLevel<3?SIMPLE_COLORS:EXTENDED_COLORS,NumColors);
	//let colors = choose(['pink','gray','sienna'],NumColors);
	showPictures(false, evaluate, colors);

	setGoal(randomNumber(0,NumPics*colors.length-1));
	Goal.correctionPhrase = Goal.shade+' '+Goal.label;

	//console.log('________\ngoal id is',Goal.id)

	let spoken = `click the ${Goal.shade} ${bestWord}`;
	showInstruction(bestWord, `click the <span style='color:${Goal.shade}'>${Goal.shade.toUpperCase()}</span>`, dTitle, spoken);
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
	//console.log('clicked',id);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Selected = Pictures[i];

	//console.log(item.info.best)
	if (item == Goal) { return STATES.CORRECT; } else { return STATES.INCORRECT; }
}

