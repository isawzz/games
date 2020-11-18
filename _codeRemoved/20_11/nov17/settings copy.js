//experimental settings API
async function initSettings() {
	createSettingsUi();
	Settings = 	loadSettingsFromLocalStorage();
	if (nundef(Settings)) Settings = await loadSettingsFromServer();
	if (nundef(Settings)){
		Settings = {hallo: 'no setting file at server'};
	}
	updateSettingsUi();
}
function loadSettingsFromLocalStorage(){
	let settings = localStorage.getItem('settings'); //('settings');
	console.log('settings',settings)
	if (isdef(settings)) settings = JSON.parse(settings);
	return settings;
}
async function loadSettingsFromServer(){
	let settings =  await loadYamlDict('/SIMPLEX/settings/settings.yaml'); //_config.yaml');
	return settings;

}
function saveSettingsUi() {

	let ta = mBy('dSettings_ta');
	let t1 = ta.value.toString();
	let t2 = jsyaml.load(t1);
	let t3 = JSON.stringify(t2);
	localStorage.setItem('settings', t3);
	console.log('______________SAVED SETTINGS\n', 't1', typeof (t1), t1, '\nt2', typeof (t2), t2, '\nt3', typeof (t3), t3)
	console.log('______________SAVED SETTINGS');
}
async function resetSettingsToDefaults() {
	Settings = await loadSettingsFromServer();
	localStorage.clear(); //TODO: maybe only clear settings not entire localStorage???
	updateSettingsUi();
	saveSettingsUi();
}
function openSettings() { clearProgramTimer(); show(dSettings); pauseUI(); updateSettingsUi(); }
function closeSettings() { saveSettingsUi(); loadSettingsFromLocalStorage(); hide(dSettings); restartProgramTimer(); resumeUI(); }
function toggleSettings() { if (isVisible2('dSettings')) closeSettings(); else openSettings(); }

//#region settings helpers
function createSettingsUi() {
	let dParent = mBy('dSettings');

	clearElement(dParent);
	let d = mDiv(dParent); mClass(d, 'hMinus60'); //mStyleX(d,{'box-sizing':'border-box',padding:4})
	let ta = TA = mCreate('textarea');
	ta.id = 'dSettings_ta';
	//mStyleX(ta, { height: '98%', width: '98%' })
	mAppend(d, ta);
	mClass(ta, 'whMinus60'); 
	// ta.style.height = '90%';
	// ta.rows = 25;
	// ta.cols = 100;
	ta.value = 'hallo';

	let bdiv = mDiv(dParent); mStyleX(bdiv, { height: 54 });
	let b;

	//create buttons
	// b = mCreate('button');
	// mAppend(bdiv, b);
	// b.innerHTML = 'save';
	// mClass(b, 'buttonClass', 'buttonPlus');
	// b.onclick = () => { saveSettingsUi(); loadSettingsFromLocalStorage(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'reset to defaults';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { resetSettingsToDefaults(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'continue playing';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { closeSettings(); startGame(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'restart program';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { closeSettings(); startUnit(); }
}
function updateSettingsUi(){
	let ta = mBy('dSettings_ta');
	let o1 = Settings;// = { hallo: 1, geh: 2 };
	o2 = jsonToYaml(o1, { encoding: 'utf-8' });
	//let o3 = jsyaml.dump(o1);	let o4 = jsyaml.load(o3);	let o5 = jsyaml.load(o2);
	//console.log('o1', typeof (o1), o1, '\no2', typeof (o2), o2, '\no3', typeof (o3), o3, '\no4', typeof (o4), o4, '\no5', typeof (o5), o5);
	ta.value = o2;
}

