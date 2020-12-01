function openProgramSettings() { stopAus(); hide('dProgramButton'); show('dProgram'); loadSettingsX(); }
function closeProgramSettings() { show('dProgramButton'); saveSettingsX(); loadSettingsFromLocalStorage(); hide('dProgram'); continueResume(); }
function toggleProgramSettings() { if (isVisible2('dProgram')) closeProgramSettings(); else openProgramSettings(); }

//#region settings helpers
function createProgramSettingsUi() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLL')
	let dParent = mBy('dProgram');

	clearElement(dParent);
	mClass(dParent, 'hMinus60');
	let dUpper = mDiv(dParent); 
	mClass(dUpper, 'hPercentMinus60');
	let bdiv = mDiv(dParent); mStyleX(bdiv, { height: 54,align:'right' });
	let b;

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'transfer to server';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = transferServerDataToServer;

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'download';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = transferServerDataToClient;

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'reset to defaults';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = resetSettingsToDefaults;

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'continue playing';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { closeProgramSettings(); startGame(); }

	let maintag='textarea';
	let ta = mCreate(maintag);
	ta.id = 'dSettings_ta';
	mAppend(dUpper, ta);
	mClass(ta, 'whMinus60');

}

