function clearProgramTimer() { clearTimeout(ProgTimeout); ProgTimeIsUp = false; }
function restartProgramTimer() { ProgTimeout = setTimeout(() => ProgTimeIsUp = true, ProgMinutes * 60 * 1000); }
async function loadProgram() {
	//sets GameSequence from _config.yaml is exists, GameIndex,SavedLevel from localStorage if exists 

	// let url = 'file:///C:/Users/tawzz/Downloads/__games/testfile.yaml';
	// let data = await loadYamlDict(url);
	// console.log('DATA', data);

	let data = await loadYamlDict('/SIMPLEX/settings/settings.yaml'); //_config.yaml');
	data = data.program;
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
	console.log('LOADED: index', GameIndex, 'level', SavedLevel);
	// console.log('GameIndex loaded', GameIndex);
	// console.log('SavedLevel loaded', SavedLevel);
}

function saveProgram() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAALO')
	updateGameSequence(currentLevel);
	localStorage.setItem('GameIndex', GameIndex.toString());
	localStorage.setItem('SavedLevel', SavedLevel.toString());
	console.log('saved: index', GameIndex, 'level', SavedLevel);
	// localStorage.setItem('currentLevel',GameIndex.toString());
	// console.log('GameIndex saved',GameIndex)
}

function updateGameSequence(nextLevel) {
	console.log(nextLevel, MAXLEVEL)
	if (nextLevel > MAXLEVEL) {
		GameIndex = (GameIndex + 1) % GameSequence.length;
		SavedLevel = GameSequence[GameIndex].sl;
	} else SavedLevel = nextLevel;
}










