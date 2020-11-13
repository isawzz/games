var ProgTimeout=false;
var ProgMinutes=.5;


function loadProgram() {
	let progData = loadObject('progData');
	if (isdef(progData)) {
		let index = progData.seq % gameSequence.length;
		let game = gameSequence[index];
		if (isdef(game)) { let level = progData.level; startAtLevel[currentGame] = level; }
	}
	console.log('progData', progData, 'currentGame', currentGame, 'gameSequence', gameSequence);
}
function saveProgram() {
	let level = currentLevel > MAXLEVEL ? 0 : currentLevel;
	let progData = {
		seq: gameSequence.indexOf(currentGame),
		level: level
	}
	console.log('saving', progData);
	saveObject(progData, 'progData');
}












