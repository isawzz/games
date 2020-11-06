var uiActivated;
const nPicsnLabel={
	0:{NumPics:2,NumLabels:2},
	1:{NumPics:3,NumLabels:3},
	2:{NumPics:2,NumLabels:1},
	3:{NumPics:2,NumLabels:0},
	4:{NumPics:4,NumLabels:4},
	5:{NumPics:3,NumLabels:2},
	6:{NumPics:3,NumLabels:1},
	7:{NumPics:3,NumLabels:0},
	8:{NumPics:5,NumLabels:5},
	9:{NumPics:4,NumLabels:2},
	10:{NumPics:4,NumLabels:0},
}
function startGameTP() {

	levelTP();
	keySet = getKeySet(WORD_GROUPS[iGROUP], currentLanguage, MAX_WORD_LENGTH[level]);
	//console.log('...starting TouchPic: pics', NumPics, 'keys', keySet.length);
}
function levelTP(){ 
	NumPics = nPicsnLabel[level].NumPics;
	NumLabels = nPicsnLabel[level].NumLabels;
	// NumPics = (level <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + level; 
}
function startRoundTP() {
	uiActivated = false;
}
function promptTP() {
	showPictures(false, evaluate);
	setGoal(false);

	showInstruction(bestWord, 'click', dTitle);

	return 10;
}
function activateTP() {
	uiActivated = true;
}
function evalTP(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	//get item
	let i = firstNumber(id);
	let item = Selected = Pictures[i];

	if (item.info.best == bestWord) { return STATES.CORRECT; } else { return STATES.INCORRECT; }
}

