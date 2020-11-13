//#region vars

var ProgMinutesStart = 10;

var ProgDataHC = {
	gameIndex: 0,
	levelIndex: 0,
	cycleIndex: 0,
	games: ['gTouchPic', 'gMissingLetter'], //cycle through these, applying cycleInc * cycleIndex as per each game
	gTouchPic: {
		levels: [ // baseline level!
			{ NumPics: 2, NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
			{ NumPics: 3, NumLabels: 3, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 1 },
			{ NumPics: 2, NumLabels: 1, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
			{ NumPics: 3, NumLabels: 2, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
		],
		cycleInc: { NumPics: 2, NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
	},
	gMissingLetter: {
		levels: [
			{ NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
			{ NumLabels: 3, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 1 },
			{ NumLabels: 1, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 1 },
			{ NumLabels: 2, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 1 },
		],
		cycleInc: { NumLabels: 2, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 1 },
	},
}
var ProgData, CycleIndex, ProgTimeLeft;
//#endregion

var ProgTimeUp = false;
var GameIndex, LevelIndex;

function setupProgram(){
	//just manipulate globals
	//only need to load ProgData

	GameIndex = 0;
	ProgData = loadObject('ProgData'); 
	if (nundef(ProgData)){
		ProgData = {iGame:0,i}
	}
}

function startProgram() {
	loadProgram();
	CycleIndex = ProgData.cycleIndex;
	GameIndex = ProgData.gameIndex;
	LevelIndex = ProgData.levelIndex;
	ProgTimeLeft = ProgMinutesStart;
	ProgTimeUp = false;

	currentGame =
	currentLevel =


	console.log('starting program at', GameIndex)
}
function endProgram() {

}
function loadProgram() { ProgData = loadObject('ProgData'); }
function saveProgramStatus() { saveObject(ProgData, 'ProgData'); }












