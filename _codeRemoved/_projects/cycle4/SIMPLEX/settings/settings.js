//experimental settings API
function loadSettings() {
	createSettingsUi();
	loadSettingsFromLocalstorage();
}
function saveSettings() {

	let ta = mBy('dSettings_ta');
	let t1 = ta.value.toString();
	let t2 = jsyaml.load(t1);
	let t3 = JSON.stringify(t2);
	localStorage.setItem('settings', t3);
	// console.log('______________SAVED SETTINGS\n', 't1', typeof (t1), t1, '\nt2', typeof (t2), t2, '\nt3', typeof (t3), t3)
	console.log('______________SAVED SETTINGS');
}

function openSettings() { clearProgramTimer(); show(dSettings); pauseUI(); loadSettings(); }
function closeSettings() { restartProgramTimer(); saveSettings(); hide(dSettings); restartProgramTimer(); resumeUI(); }
function toggleSettings() { if (isVisible2('dSettings')) closeSettings(); else openSettings(); }


//#region settings helpers
function createSettingsUi() {
	let dParent = mBy('dSettings');
	clearElement(dParent);
	let ta = TA = mCreate('textarea');
	ta.id = 'dSettings_ta';
	mAppend(dParent, ta);
	ta.rows = 25;
	ta.cols = 100;
	ta.value = 'hallo';

	let bdiv=mDiv(dParent);
	let b;

	//create buttons
	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'save';
	b.onclick = () => { saveSettings(); loadSettingsFromLocalstorage(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'reset to defaults';
	b.onclick = () => { resetSettingsFromHardCoded(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'play';
	b.onclick = () => { closeSettings(); startGame(); }
}
function loadSettingsFromLocalstorage() {
	let ta = mBy('dSettings_ta');
	Settings = localStorage.getItem('settings'); //getLocalStorage('settings');
	Settings = JSON.parse(Settings);
	console.log('loaded Settings:', Settings)
	if (nundef(Settings)) Settings = { hallo: 1, geh: 2 };
	let o1 = Settings;// = { hallo: 1, geh: 2 };
	o2 = jsonToYaml(o1, { encoding: 'utf-8' });
	let o3 = jsyaml.dump(o1);
	let o4 = jsyaml.load(o3);
	let o5 = jsyaml.load(o2);
	//console.log('o1', typeof (o1), o1, '\no2', typeof (o2), o2, '\no3', typeof (o3), o3, '\no4', typeof (o4), o4, '\no5', typeof (o5), o5);

	textValue = ta.value = o2;
}
function resetSettingsFromHardCoded(){

}

