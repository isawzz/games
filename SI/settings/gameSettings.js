function openGameSettings() { stopAus(); openAux('dGameSettings'); loadGameSettingsX(); }
function closeGameSettings() { closeAux(); saveGameSettingsX(); loadGameSettingsFromLocalStorage(); continueResume(); }
function toggleGameSettings() { if (isVisible2('dGameSettings')) closeGameSettings(); else openGameSettings(); }

function loadGameSettingsX() {
	createGameSettingsUi();
	loadGameSettingsFromLocalStorage();

}

function saveGameSettingsX() { }
function loadGameSettingsFromLocalStorage() { }
function resetGameSettingsToDefaults() { }

function createGameSettingsUi() {
	let dParent = mBy('dGameSettings');
	

	let dGroup=mInputGroup(dParent);

	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(dGroup, 'samples', 25, ['program', 'samplesPerLevel']);


	// let d = createCommonUi(dParent, resetGameSettingsToDefaults, () => { closeGameSettings(); startGame(); });
	// mText('NOT IMPLEMENTED!!!!!!!!!!!!!', d, { fz: 50 });

}
function mInputGroup(dParent){
	return mDiv(dParent,{display:'inline-block',align:'left',bg:'random',padding:20});
}
function setSettingsKeys(elem) {
	// console.log('lllllllllllllllll', a, a.value, a.keyList);
	let val = elem.type == 'number' ? Number(elem.value) : elem.value;
	lookupSetOverride(Settings, elem.keyList, val);
	console.log(Settings.program);
}
function setzeEineZahl(dParent, label, init, skeys) {
	// <input id='inputPicsPerLevel' class='input' type="number" value=1 />
	let d = mDiv(dParent);
	let inp = createElementFromHTML(
		// `<input id="${id}" type="number" class="input" value="1" onfocusout="setSettingsKeys(this)" />`); 
		`<input type="number" class="input" value="${init}" onfocusout="setSettingsKeys(this)" />`); 
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);
	inp.keyList = skeys;
}
