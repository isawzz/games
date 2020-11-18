function clearProgramTimer() { clearTimeout(ProgTimeout); ProgTimeIsUp = false; }
function restartProgramTimer() { ProgTimeout = setTimeout(() => ProgTimeIsUp = true, progMinutes * 60 * 1000); }
async function loadProgram() {
	//sets gameSequence from _config.yaml is exists, Settings.program.gameIndex,Settings.program.savedLevel from localStorage if exists 

	// let url = 'file:///C:/Users/tawzz/Downloads/__games/testfile.yaml';
	// let data = await loadYamlDict(url);
	// console.log('DATA', data);

	//TODO: hier muss statt dessen Settings.program nehmen!
	//let data = Settings =  await loadYamlDict('/SIMPLEX/settings/settings.yaml'); //_config.yaml');
	// console.log('Settings',Settings);
	// localStorage.clear();
	// initSettings();

	// if (nundef(Settings)) {
	// 	console.log('call initSettings'); 
	// 	initSettings();
	// }
	let program = Settings.program;
	let gameSequence = program.gameSequence;
	let gameIndex = program.gameIndex;

	if (isdef(program)) gameSequence = program.gameSequence;

	//console.log(Settings);
	//Settings.program.gameIndex = localStorage.getItem('Settings.program.gameIndex');
	if (isString(Settings.program.gameIndex)) { Settings.program.gameIndex = Number(Settings.program.gameIndex); }
	if (nundef(Settings.program.gameIndex)) { Settings.program.gameIndex = 0; }

	//Settings.program.savedLevel = localStorage.getItem('Settings.program.savedLevel');
	if (isString(Settings.program.savedLevel)) { Settings.program.savedLevel = Number(Settings.program.savedLevel); }
	if (nundef(Settings.program.savedLevel)) { Settings.program.savedLevel = gameSequence[Settings.program.gameIndex].sl; }

	//friendly output
	let i = 0;
	gameSequence.map(x => {
		if (i == Settings.program.gameIndex) console.log('=>', x); else console.log('', x);
		i += 1;
	});
	console.log('LOADED: gameIndex', Settings.program.gameIndex, 'level', Settings.program.savedLevel);
	// console.log('Settings.program.gameIndex loaded', Settings.program.gameIndex);
	// console.log('Settings.program.savedLevel loaded', Settings.program.savedLevel);
}

function saveProgram() {
	//console.log('HAAAAAAAAAAAAAAAAAAAAAAALO')
	updateGameSequence(currentLevel);
	localStorage.setItem('settings', JSON.stringify(Settings));
	// saveSettingsUi();
	// localStorage.setItem('Settings.program.gameIndex', Settings.program.gameIndex.toString());
	// localStorage.setItem('Settings.program.savedLevel', Settings.program.savedLevel.toString());
	console.log('SAVED: gameIndex', Settings.program.gameIndex, 'level', Settings.program.savedLevel);
}

function updateGameSequence(nextLevel) {
	console.log(nextLevel, MAXLEVEL)
	if (nextLevel > MAXLEVEL) {
		let gameSequence = Settings.program.gameSequence;
		Settings.program.gameIndex = (Settings.program.gameIndex + 1) % gameSequence.length;
		Settings.program.savedLevel = gameSequence[Settings.program.gameIndex].sl;
	} else Settings.program.savedLevel = nextLevel;
}










