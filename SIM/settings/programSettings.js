function openProgramSettings() { stopAus(); hide('dDevButton'); show('dDev'); loadSettingsX(); }
function closeProgramSettings() { show('dDevButton'); saveSettingsX(); loadSettingsFromLocalStorage(); hide('dDev'); continueResume(); }
function toggleProgramSettings() { if (isVisible2('dDev')) closeProgramSettings(); else openProgramSettings(); }

//#region settings helpers
function createDevSettingsUi() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLL')
	let dParent = mBy('dDev');

	clearElement(dParent);
	mClass(dParent, 'hMinus60');
	let dUpper = mDiv(dParent);
	mClass(dUpper, 'hPercentMinus60');
	let bdiv = mDiv(dParent); mStyleX(bdiv, { height: 54, align: 'right' });
	let b;

	if (DEV_MODE) {
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


	}
	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'continue';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = () => { closeProgramSettings(); } //startGame(); }


	let maintag = 'textarea';
	let ta = mCreate(maintag);
	ta.id = 'dSettings_ta';
	mAppend(dUpper, ta);
	mClass(ta, 'whMinus60');

}

