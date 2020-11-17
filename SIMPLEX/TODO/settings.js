
function initSettingsP0() {
	// initialize settings in settings window
	let iLanguage = mBy('input' + currentLanguage);
	iLanguage.checked = true;

	let iPicsPerLevel = mBy('inputPicsPerLevel');
	iPicsPerLevel.value = PICS_PER_LEVEL;

}

function openSettings_dep0() {  show(dSettings); pauseUI(); if(EXPERIMENTAL)loadSettings(); }
function closeSettings_dep0() { if(EXPERIMENTAL)saveSettings();else setPicsPerLevel(); hide(dSettings); resumeUI(); }
function toggleSettings_dep0() { if (isVisible2('dSettings')) closeSettings(); else openSettings(); }

function setGame(event) {
	if (isString(event)) startGame(event);
	else {
		event.cancelBubble = true;
		let id = evToClosestId(event);
		let game = 'g' + id.substring(1);
		closeSettings();
		startGame(game);
	}
}
function setLanguage(x) { currentLanguage = x; startLevel(); }
function getKeySetSimple(cats, lang,
	{ minlen, maxlen, wShort = false, wLast = false, wExact = false, sorter = null }) {
	let keys = setCategories(cats);
	if (isdef(minlen && isdef(maxlen))) {
		keys = keys.filter(k => {
			let exact = CorrectWordsExact[lang][k];
			if (wExact && nundef(exact)) return false;
			let ws = wExact ? [exact.req] : wLast ? [lastOfLanguage(k, lang)] : wordsOfLanguage(k, lang);
			if (wShort) ws = [getShortestWord(ws, false)];
			//console.log(k,ws)
			for (const w of ws) { if (w.length >= minlen && w.length <= maxlen) return true; }
			return false;
		});
	}
	//console.log('________________',keys);//ok

	if (isdef(sorter)) sortByFunc(keys, sorter); //keys.sort((a,b)=>fGetter(a)<fGetter(b));
	return keys;
}
function setKeysNew({ cats, lang, wShortest = false, wLast = false, wBest = false, wExact = false, sorter }={}) {
	opt = arguments[0];
	if (nundef(opt)) opt = {};
	opt.minlen = MinWordLength;
	opt.maxlen = MaxWordLength;
	if (nundef(cats)) cats = currentCategories;
	if (nundef(lang)) lang = currentLanguage;
	currentKeys = getKeySetSimple(cats, lang, opt);
	//console.log('set keys:' + currentKeys.length);
}
function setKeys(cats, bestOnly, sortAccessor, correctOnly, reqOnly) {
	currentKeys = getKeySetX(isdef(cats) ? cats : currentCategories, currentLanguage, MinWordLength, MaxWordLength,
		bestOnly, sortAccessor, correctOnly, reqOnly);
	if (isdef(sortByFunc)) { sortBy(currentKeys, sortAccessor); }
}
function setPicsPerLevel() {
	let inp = mBy('inputPicsPerLevel');
	inp.select();
	let x = getSelection();
	let n = Number(x.toString());
	inp.value = n;
	getSelection().removeAllRanges();
	PICS_PER_LEVEL = n;
	SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);
	boundary = SAMPLES_PER_LEVEL[currentLevel];
}


