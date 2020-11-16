var ProgTimeout = false;
var ProgMinutes = 1;

function updateGameSequence(nextLevel) {
	if (nextLevel > MAXLEVEL) {
		GameIndex = (GameIndex + 1) % GameSequence.length;
		SavedLevel = GameSequence[GameIndex].sl;
	} else SavedLevel = nextLevel;
}

async function loadProgram() {
	//sets GameSequence from _config.yaml is exists, GameIndex,SavedLevel from localStorage if exists 

	let data = await loadYamlDict('/SIM/_config.yaml');
	if (isdef(data)) GameSequence = data.GameSequence;

	GameIndex = localStorage.getItem('GameIndex');
	if (isString(GameIndex)) { GameIndex = Number(GameIndex); }
	if (nundef(GameIndex)) { GameIndex = 0; }

	SavedLevel = localStorage.getItem('SavedLevel');
	if (isString(SavedLevel)) { SavedLevel = Number(SavedLevel); }
	if (nundef(SavedLevel)) { SavedLevel = GameSequence[GameIndex].sl; }

	//friendly output
	let i = 0;
	GameSequence.map(x => {
		if (i == GameIndex) console.log('=>', x); else console.log('', x);
		i += 1;
	});
	console.log('SavedLevel is', SavedLevel);
}

function saveProgram() {
	updateGameSequence(currentLevel);
	localStorage.setItem('GameIndex', GameIndex.toString());
	console.log('GameIndex saved', GameIndex);
	localStorage.setItem('SavedLevel', SavedLevel.toString());
	console.log('SavedLevel saved', SavedLevel);
	// localStorage.setItem('currentLevel',GameIndex.toString());
	// console.log('GameIndex saved',GameIndex)
}










