function missingNumberPrompt() {
	showInstruction('', Settings.language == 'E' ? 'complete the sequence' : "ergänze die reihe", dTitle, true);
	mLinebreak(dTable, 12);

	showHiddenThumbsUpDown({ sz: 140 });
	mLinebreak(dTable);

	let seq = this.seq = getRandomNumberSequence(this.seqlen, 0, this.max, this.step);

	let wi = createWordInputs(seq, dTable,'dNums');

	// console.log(wi)
	//now remove numMissing words simplest: remove 1 word in random pos
	//let blank = blankWordInputs(wi.words, 2, 'end');
	let blank = blankWordInputs(wi.words, this.numMissing, this.pos);
	//was soll das Goal sein???
	Goal = { seq: seq, words: wi.words, chars:wi.letters, blankWords:blank.words, blankChars:blank.letters, iFocus:blank.iFocus };
	// for(const k in blank){
	// 	Goal[k]=blank[k];
	// }
	console.log('Goal',Goal);


	mLinebreak(dTable);


	//console.log('msg,msg', msg)
	if (Settings.isTutoring) { let msg = this.composeFleetingMessage(); showFleetingMessage(msg, 3000); }
	activateUi();

	return;

	let label = this.label = seq.join(', ');

	//zuerst bestimme die missing numbers
	let pos = this.pos;
	let iMissing = []; // indices in seq
	if (pos == 'end') { for (let x = 1; x <= this.numMissing; x++) { iMissing.push(this.seqlen - x); } }
	else if (pos == 'start') { for (let x = 0; x < this.numMissing; x++) { iMissing.push(x); } }
	else iMissing = choose(range(0, this.seqlen - 1, 1), this.numMissing);

	//console.log('iMissing', iMissing);
	let missingNumbers = iMissing.map(x => seq[x]);
	//console.log('the missing numbers are:',missingNumbers);

	let info = [];
	for (const i of iMissing) { let n = seq[i]; info.push({ i: i, n: n }); }

	//console.log('info', info);

	// erstmal stelle fest wieviele letters sich aus der summe der missing numbers ergeben
	let sum = 0;
	for (let i = 0; i < iMissing.length; i++) {
		//let idx=iMissing[i];
		//console.log(i, info[i])
		sum += info[i].n.toString().length;
	}

	//console.log('MN:', seq, label, '\niMissing', iMissing, '\nsum', sum);
	this.nMissing = sum;

	let ilist = []; // indices in label
	//console.log('pos', pos);
	let SAFE = 100;
	//console.log('pos', pos, 'sum', sum);

	let wlen = label.length;
	if (pos == 'end') {
		//from label remove sum alphanumeric letters and remember their indices
		let i = label.length - 1;
		let nrem = 0;
		let x = i;

		//console.log('i', i, 'nrem', nrem, 'x', x);
		while (nrem < sum && x >= 0) {
			if (SAFE <= 0) break; SAFE -= 1;
			while (x >= 0 && !isAlphaNum(label[x])) x -= 1;
			while (x >= 0 && isAlphaNum(label[x]) && nrem < sum) { ilist.push(x); nrem += 1; x -= 1; }
		}
	}
	else if (pos == 'start') {
		//from label remove sum alphanumeric letters and remember their indices
		let i = 0;
		let nrem = 0;
		let x = i;

		console.log('i', i, 'nrem', nrem, 'x', x);
		while (nrem < sum && x < wlen) {
			if (SAFE <= 0) break; SAFE -= 1;
			while (x < wlen && !isAlphaNum(label[x])) x += 1;
			while (x < wlen && isAlphaNum(label[x]) && nrem < sum) { ilist.push(x); nrem += 1; x += 1; }
		}
	}
	else if (pos == 'consec') {
		//from label remove sum alphanumeric letters and remember their indices
		let i = 0;
		let nrem = 0;
		let x = i;


		console.log('i', i, 'nrem', nrem, 'x', x);
		let numrem = this.numMissing; let inumrem = 0;
		while (nrem < sum && x < wlen && inumrem < numrem) {
			let snum = info[inumrem].n.toString();
			let x = label.indexOf(snum);
			inumrem += 1;
			console.log('x should be index of ', snum, ' in label:', x);
			if (SAFE <= 0) break; SAFE -= 1;

			while (x < wlen && !isAlphaNum(label[x])) x += 1;
			while (x < wlen && isAlphaNum(label[x]) && nrem < sum) { ilist.push(x); nrem += 1; x += 1; }

		}
	}
	else if (pos == 'random') {

		// randomly choose 1-NumMissingLetters alphanumeric letters from Goal.label
		let indices = getIndicesCondi(label, (x, i) => isAlphaNum(x));
		ilist = choose(indices, sum);

	}
	sortNumbers(ilist);
	//console.log('ilist', ilist);

	Goal = { label: label, seq: seq, missingNumbers: missingNumbers };

	// create sequence of letter ui
	//let fg = ['yellow', 'skyblue', 'salmon', 'lime', 'gold', 'springgreen'];
	//let fg = ['blue', 'green', 'navy', 'indigo'].map(x => colorBright(x, 50)).concat(['orange','deepskyblue', 'lime', 'springgreen', 'skyblue', 'yellow', 'gold', 'greenyellow']);
	//fg = fg.map(x=>colorBright(x,50));
	let fg = ['orange', 'deepskyblue', 'lime', 'springgreen', 'skyblue', 'yellow', 'gold', 'greenyellow']
	let style = {
		fg: fg, display: 'inline', bg: 'transparent', align: 'center',
		border: 'transparent', outline: 'none', fz: 68
	};
	let d = createLetterInputs(Goal.label.toUpperCase(), dTable, style, undefined, false); // access children: d.children
	//d.style.padding = '50px';

	this.inputs = [];
	for (const idx of ilist) {
		let inp = d.children[idx];
		inp.innerHTML = '_';
		mClass(inp, 'blink');
		this.inputs.push({ letter: Goal.label[idx].toUpperCase(), div: inp, index: idx });
	}

	mLinebreak(dTable);

	let msg = this.composeFleetingMessage();
	//console.log('msg,msg', msg)
	if (Settings.showHint) showFleetingMessage(msg, 3000);
	activateUi();

}
function interact(ev) {
	console.log('ha!', ev)
	ev.cancelBubble = true;
	if (!canAct()) return;

	let id = evToClosestId(ev);
	let i = firstNumber(id);
	let pic = Pictures[i];
	let div = pic.div;
	console.log('clicked', pic.key, this.pickList, GPremem.PicList);
	if (!isEmpty(this.picList) && this.picList.length < G.numRepeat - 1 && this.picList[0].label != pic.label) return;
	toggleSelectionOfPicture(pic, this.picList);
	if (isEmpty(this.picList)) {
		showInstruction('', 'click any picture', dTitle, true);
	} else if (this.picList.length < G.numRepeat - 1) {
		//set incomplete: more steps are needed!
		//frame the picture
		showInstruction(pic.label, 'click another', dTitle, true);
	} else if (this.picList.length == G.numRepeat - 1) {
		// look for last picture with x that is not in the set
		let picGoal = firstCond(Pictures, x => x.label == pic.label && !x.isSelected);
		setGoal(picGoal.index);
		showInstruction(picGoal.label, 'click the ' + (G.numRepeat == 2 ? 'other' : 'last'), dTitle, true);
	} else {
		//set is complete: eval
		evaluate(this.picList);
	}
	//console.log(this.picList)
}

function calibrateUser(){
	//U.session hat results
	console.log('calibration results... test session',jsCopy(U.session))
	let uname = UsernameBeforeTesting;
	let udata = DB.users[uname];
	console.log('userdata before calibration',jsCopy(udata))

	let sBefore=getStartLevels(uname);

	for (const gname in U.session) {
		//find highest level with 100%: this will be correct level
		let level = 0;
		for(const l in U.session[gname].byLevel){
			let sc = U.session[gname].byLevel[l];
			if (sc.nTotal > sc.nCorrect1) break;
			level+=1;
		}
		let newval = lookupSetOverride(udata,['games',gname,'startLevel'],level);
		console.log('*** level set',gname,'level',newval)
		if (udata.lastGame == gname) udata.lastLevel = level;
		//console.log('game',gname,'calibrated to level',level);
	}
	let sAfter = getStartLevels(uname);
	console.log('userdata After calibration',jsCopy(udata));
	return [sBefore,sAfter];
}
function getSignalColor() { if (G.level != 4 && G.level != 7 && G.level != 10 && G.level != 3) return 'red'; else return 'yellow'; }

//#region ui states
function beforeActivationUI() { uiPaused |= beforeActivationMask; uiPaused &= ~hasClickedMask; }
function activationUI() { uiPaused &= ~beforeActivationMask; }
function hasClickedUI() { uiPaused |= hasClickedMask; }
function pauseUI() { uiPausedStack.push(uiPaused); uiPaused |= uiHaltedMask; }
function resumeUI() { uiPaused = uiPausedStack.pop(); }
function isUiInterrupted(){return uiPaused & uiHaltedMask;}
//#endregion

//#region SIMA
async function broadcastSettings(isCurrent = true, isDefault = true) {
	//load settings from settings.yaml or settingsTEST.yaml
	let fname = SETTINGS_KEY;
	let settings = await loadYamlDict('./settings/' + fname + '.yaml');
	let users = await loadYamlDict('./settings/users.yaml');

	//das war jetzt regular or TEST

	//soll ich zu defaults or current or both broadcasten?
	if (isCurrent) Settings = settings;
	if (isDefault) DefaultSettings = jsCopy(settings);

	saveServerData();

}
function ensureMinVocab(n, totalNeeded) {
	switch (n) {
		case 25: if (totalNeeded >= 20) return 50; break;
		case 50: if (totalNeeded >= 35) return 75; break;
		case 75: if (totalNeeded >= 50) return 100; break;
	}
	if (isNumber(n)) return n;


	//hier geh jetzt auf die categories

}
function setKeys_NEIN({ nMin, lang, key, keysets, filterFunc, confidence, sortByFunc } = {}) {

	let keys = jsCopy(keysets[key]);
	let diff = nMin - keys.length;
	let additionalSet = diff > 0 ? firstCondDictKey(keysets, k => k != key && keysets[k].length > diff) : null;
	if (additionalSet) keys = keys.concat(keysets[additionalSet]);

	let result = [];
	let other = [];
	for (const k of keys) {
		let info = symbolDict[k];
		let klang = 'best' + lang;
		//console.log(k,lang,klang)
		if (nundef(info[klang])) info.klang = lastOfLanguage(k, lang);
		info.best = info[klang];
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { result.push(k); } else { other.push(k); }
	}

	//if result does not have enough elements, take randomly from other
	let len = result.length;
	let nMissing = nMin - len;
	if (nMissing > 0) {let list = choose(other,nMissing); result=result.concat(list);}

	if (isdef(sortByFunc)) { sortBy(result, sortByFunc); }

	console.assert(result.length>=nMin);
	return result;
}

//#region key selection: setKeys_
function setKeys_vorSIMA({ lang, nbestOrCats, filterFunc, confidence, sortByFunc } = {}) {

	let nbest, cats;
	if (isNumber(nbestOrCats)) { nbest = nbestOrCats; }
	else cats = nbestOrCats;

	let keys = [];
	if (isdef(nbest)) {
		let setname = 'best' + nbest;
		keys = jsCopy(KeySets[setname]);
	} else {
		if (nundef(cats)) cats = 'nosymbols';
		if (isString(cats)) cats = [cats];
		keys = setCategories(cats);
	}

	let result = [];
	for (const k of keys) {
		let info = symbolDict[k];
		let klang = 'best' + lang;
		//console.log(k,lang,klang)
		if (nundef(info[klang])) info.klang = lastOfLanguage(k, lang);
		info.best = info[klang];
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { result.push(k); }
	}
	if (isdef(sortByFunc)) { sortBy(result, sortByFunc); }
	return result;
}

//#endregion

function selectWord(info, bestWordIsShortest, except = []) {
	let candidates = info.words.filter(x => x.length >= MinWordLength && x.length <= MaxWordLength);

	let w = bestWordIsShortest ? getShortestWord(candidates, false) : arrLast(candidates);
	if (except.includes(w)) {
		let wNew = lastCond(info.words, x => !except.includes(w));
		if (wNew) w = wNew;
	}
	return w;
}
function defaultOnFocusEditableText(inp) {
	inp.style.backgroundColor = 'white';
}
function defaultOnLostFocusEditableText(inp) {
	//console.log('lost focus!!!')
	inp.style.backgroundColor = 'transparent';
}
function mInput(dParent, type, label, styles) {
	let d = mDiv(dParent);

	if (nundef(type)) type = "text";
	if (nundef(label)) label = "";

	let inp = createElementFromHTML(`<input type="${type}" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);
	if (isdef(styles)) mStyleX(inp, styles);

	inp.addEventListener('input', resizeInput);
	//resizeInput.call(inp);
	return inp;
}
function resizeInput() { this.style.minWidth = this.value.length + "ch"; }




function mEditableInput(dParent,label, val) {

	let labelElem = createElementFromHTML(`<span>${label}</span>	`)
	let elem = createElementFromHTML(`<span contenteditable="true" spellcheck="false">${val}</span>	`)
	elem.addEventListener('keydown', (ev) => {
		if (ev.key === 'Enter') {
			ev.preventDefault();
			mBy('dummy').focus();
		}
	});
	mAppend(dParent,labelElem);
	mAppend(dParent, elem);
	return elem;
	//<div contenteditable = "true" class = "fluidInput" data-placeholder = ""></div>
	let inp = mDiv(dParent, styles);

	inp.contenteditable = true;
	inp['data-placeholder'] = '';
	if (isdef(val)) inp.innerHTML = val;

	return inp;

	//console.log(inp)

	if (nundef(onFocus)) onFocus = defaultOnFocusEditableText;
	if (nundef(onLostFocus)) onLostFocus = defaultOnLostFocusEditableText;

	let defStyles = { maleft: 12, mabottom: 4 };
	styles = nundef(styles) ? defStyles : deepmergeOverride(defStyles, styles);
	mStyleX(inp, styles);

	// mClass(inp, 'input', ...classes);
	mClass(inp, 'editableText');
	//inp.value = 'hallo'

	inp.addEventListener('focus', ev => onFocus(ev.target));
	inp.addEventListener('focusout', ev => onLostFocus(ev.target));
	// if (isdef(onFocus)) inp.onfocus = ()=>onFocus(inp);//"${onFocusName}(this)" onfocusout="${onLostFocusName}(this)" 
	// if (isdef(onLostFocus)) inp.onfocusout = ()=>onLostFocus(inp);
	inp.addEventListener('keyup', e => { if (e.key == 'Enter') inp.blur(); });
	if (isdef(val)) inp.value = val;

	return inp;

}
function mEditableInput_dep(dParent, { type, label, onFocus, onLostFocus, val, styles, classes } = {}) {
	let inp = mInput(dParent, type, label, styles);

	//console.log(inp)

	if (nundef(onFocus)) onFocus = defaultOnFocusEditableText;
	if (nundef(onLostFocus)) onLostFocus = defaultOnLostFocusEditableText;

	let defStyles = { maleft: 12, mabottom: 4 };
	styles = nundef(styles) ? defStyles : deepmergeOverride(defStyles, styles);
	mStyleX(inp, styles);

	// mClass(inp, 'input', ...classes);
	mClass(inp, 'editableText');
	//inp.value = 'hallo'

	inp.addEventListener('focus', ev => onFocus(ev.target));
	inp.addEventListener('focusout', ev => onLostFocus(ev.target));
	// if (isdef(onFocus)) inp.onfocus = ()=>onFocus(inp);//"${onFocusName}(this)" onfocusout="${onLostFocusName}(this)" 
	// if (isdef(onLostFocus)) inp.onfocusout = ()=>onLostFocus(inp);
	inp.addEventListener('keyup', e => { if (e.key == 'Enter') inp.blur(); });
	if (isdef(val)) inp.value = val;

	return inp;

}

function getKeySetSimple(cats, lang,
	{ minlen, maxlen, wShort = false, wLast = false, wExact = false, sorter = null }) {
	let keys = setCategories(cats);
	if (isdef(minlen && isdef(maxlen))) {
		keys = keys.filter(k => {
			let exact = CorrectWordsExact[lang][k];
			if (wExact && nundef(exact)) return false;
			let ws = wExact ? [exact.req] : wLast ? [lastOfLanguage(k, lang)] : wordsOfLanguage(k, lang);
			if (wShort) ws = [getShortestWord(ws, false)];
			for (const w of ws) { if (w.length >= minlen && w.length <= maxlen) return true; }
			return false;
		});
	}

	if (isdef(sorter)) sortByFunc(keys, sorter); //keys.sort((a,b)=>fGetter(a)<fGetter(b));
	return keys;
}
function setKeysNew({ cats, lang, wShortest = false, wLast = false, wBest = false, wExact = false, sorter } = {}) {
	opt = arguments[0];
	if (nundef(opt)) opt = {};
	opt.minlen = MinWordLength;
	opt.maxlen = MaxWordLength;
	if (nundef(cats)) cats = Settings.categories;
	if (nundef(lang)) lang = Settings.language;
	currentKeys = getKeySetSimple(cats, lang, opt);
}
function setKeys_dep(cats, bestOnly, sortAccessor, correctOnly, reqOnly) {
	if (Settings.language == 'E' && cats == 'SIMPLE') {
		currentKeys = BestKeysSets[best100];
		return;
	}
	if (isdef(cats) && !isList(cats)) cats = [cats];
	currentKeys = getKeySetX(isdef(cats) ? cats : Settings.categories, Settings.language, MinWordLength, MaxWordLength,
		bestOnly, sortAccessor, correctOnly, reqOnly);
	if (isdef(sortByFunc)) { sortBy(currentKeys, sortAccessor); }
}



function gMemStart() {
	instruct('', 'remember all pictures!', dTitle, false);
	let pics = showPics(dTable, { num: getSetting('numPics', 2) });
	console.log(pics);
	let onComplete = () => { DONE = true; setTimeout(() => playGame(G.key), 2000); }

}
function mTitleGroup(dParent, title) {
	let d = mDiv(dParent, { display: 'inline-block', align: 'center', bg: 'random', padding: 20 });
	let tag = 'h3';
	mAppend(d, createElementFromHTML(`<${tag} style='margin:0;padding:0'>${title}</${tag}>`));
	return d;
}
function setSettingsLevelProgression(elem) {
	let game = elem.game;
	let prop = elem.prop;
	let info = Settings.games[game];
	let val = elem.type == 'number' ? Number(elem.value) : elem.value;
	let progInfo = GameProps[prop].progression;
	console.log(progInfo, val, Object.keys(info.levels));
	for (const k in info.levels) {
		console.log(Object.keys(info.levels[k]))
		//need to set this prop for each level!
	}

}
function mProgressionGroup_dep(dParent, title, headers, addHandler = null) {
	let d = mDiv(dParent, { display: 'inline-block', bg: choose(levelColors), padding: 20 });
	mAppend(d, createElementFromHTML(`<h3 style='margin:0;padding:0'>${title}</h3>`));

	let s = '';
	for (const h of headers) {
		s += '<td>' + h + '</td>';
	}

	let t = createElementFromHTML(`<table><tbody><tr>${s}</tr></tbody></table>`);
	// let row = t.querySelector('tr');
	// console.log(t,row)
	// for(const h of headers){
	// 	mAppend(row,createElementFromHTML(`<td>${h}</td>`))
	// }
	mAppend(d, t);
	// mText('level progression:',d);
	//mButton('add',addHandler,d); spaeter erst!!!
	return t;
}
function setzeEineLevelZahl(dParent, label, init, game, prop) {
	// <input id='inputPicsPerLevel' class='input' type="number" value=1 />
	let d = mDiv(dParent);
	let val = lookup(Settings, ['games', game, 'levels', 0, prop]);
	if (nundef(val)) val = init;
	let inp = createElementFromHTML(
		// `<input id="${id}" type="number" class="input" value="1" onfocusout="setSettingsKeys(this)" />`); 
		`<input type="number" class="input" value="${val}" onfocusout="setSettingsLevelProgression(this)" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);

	mStyleX(inp, { maleft: 12, mabottom: 4 });
	//mClass(inp, 'input');

	inp.game = game;
	inp.prop = prop;
}
function createGameSettingsUi() {
	//console.log('current game is', currentGame)
	let dParent = mBy('dGameSettings');
	clearElement(dParent);
	mAppend(dParent, createElementFromHTML(`<h1>Settings common to all games:</h1>`));

	let nGroupNumCommonAllGames = mInputGroup(dParent);
	setzeEineZahl(nGroupNumCommonAllGames, 'samples', 25, ['program', 'samplesPerLevel']);
	setzeEineZahl(nGroupNumCommonAllGames, 'minutes', 1, ['program', 'minutesPerUnit']);
	setzeEineZahl(nGroupNumCommonAllGames, 'correct streak', 5, ['program', 'incrementLevelOnPositiveStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'fail streak', 2, ['program', 'decrementLevelOnNegativeStreak']);
	setzeEineZahl(nGroupNumCommonAllGames, 'trials', 3, ['program', 'trials']);
	setzeEinOptions(nGroupNumCommonAllGames, 'show labels', ['toggle', 'always', 'never'], 'toggle', ['program', 'showLabels']);
	setzeEinOptions(nGroupNumCommonAllGames, 'language', ['E', 'D'], 'E', ['program', 'currentLanguage']);
	setzeEinOptions(nGroupNumCommonAllGames, 'vocabulary', [25, 50, 75, 100], 25, ['program', 'vocab']);

	return;
	mLinebreak(dParent);
	mAppend(dParent, createElementFromHTML(`<h1>Settings for ${GFUNC[currentGame].friendlyName}</h1>`));

	//simpler!
	//what are the special features for this game? look at Settings.games[g].levels[0]
	let gameInfo = Settings.games[currentGame];
	let needToSet = [];
	for (const k in gameInfo) {
		if (['samplesPerLevel', 'minutesPerUnit', 'incrementLevelOnPositiveStreak', 'decrementLevelOnNegativeStreak', 'showLabels', 'trials'].includes(k)) continue;
		if (k == 'levels') {
			for (const x in gameInfo.levels[0]) {
				needToSet.push(x);
			}
		} else needToSet.push(k);
	}
	console.log(needToSet);

	let gr = mTitleGroup(dParent, 'starting level:');
	let nGroupGame = mInputGroup(gr, { bg: 'transparent' });
	for (const h of needToSet) {
		setzeEineLevelZahl(nGroupGame, GameProps[h].friendly, '', currentGame, h);
	}
	//addLevelTable(dParent);
}

//#region old

async function loadHistory() {
	let url = SERVERURL + USERNAME;
	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	}).then(async data => {
		UserHistory = await data.json();
		//console.log('==>USER HISTORY touch pic level', UserHistory.id, UserHistory.gTouchPic.startLevel);
		_start();
		//SessionStart();
	});
} async function saveHistory() {
	//console.log('posting...');
	if (BlockServerSend) {
		console.log('...wait for unblocked...');
		setTimeout(saveHistory, 1000);
	} else {
		let url = SERVERURL + USERNAME;
		let sessionData = UserHistory;
		BlockServerSend = true;
		console.log('blocked...');
		fetch(url, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(sessionData)
		}).then(() => { BlockServerSend = false; console.log('unblocked...'); });
	}

}



function gameSettingsUiToSettings() {
	//need to set settings or not???
	console.log('gameSettingsUiToSettings')
}



function addLevelTable(dParent){
	let title = 'levels';
	let nGroup = mInputGroup(dParent);
	let headers = ['vocabulary', 'pictures', 'samples'];

	let tbl= document.createElement('table');
	let s='<tr><th></th>';
	for(const h of headers){
		s+=`<th>${h}</th>`;
	}
	s+='</tr>';

	let g = currentGame;
	for (const l in Settings.games[g].levels) {
		s+=`<tr><th>${l}</th>`;
		for(const h of headers){
			s+=`<td>12</td>`
		}
		s+='</tr>';
	}

	tbl.innerHTML= s;
	mAppend(nGroup,tbl);
	return;


	// let tbl = mProgressionGroup(dParent, title, ['vocabulary', 'pictures', 'samples']);
	// console.log(tbl, typeof(tbl)); //return;
	// let g = currentGame;
	// let s='',
	// for (const l in Settings.games[g].levels) {
	// 	//let trow = createElementFromHTML(`<tr></tr>`);
	// 	s += '<tr>'; //'</tr>';
	// 	//mAppend(tbl,trow);
	// 	for (const k in Settings.games[g].levels[l]) {
	// 		s += `<td id="${title + '_' + l + '_' + k}">`;
	// 		//let tcell = createElementFromHTML(`<td></td>`);
	// 		//mAppend(trow,tcell);
	// 		s += `<label>hallo<input type="number" class="input"/></label>`;
	// 		//setzeEineZahl(tcell, '', 25, ['games',g,'levels',k]);
	// 		s += '</td>';

	// 	}
	// 	s += '</tr>';
	// }
	// // let trow = createElementFromHTML(s);
	// // console.log(trow)
	// console.log(s);

	// mAppend(tbl.querySelector('tbody'), trow);

	// // let d = createCommonUi(dParent, resetGameSettingsToDefaults, () => { closeGameSettings(); startGame(); });
	// // mText('NOT IMPLEMENTED!!!!!!!!!!!!!', d, { fz: 50 });

}




async function loadProgram() {
	let program = Settings.program;
	let gameSequence = program.gameSequence;

	// which game?
	let gameIndex = 0;
	if (!RESTART_EACH_TIME) {
		gameIndex = program.currentGameIndex;
		if (isString(gameIndex)) { gameIndex = Number(gameIndex); }
		if (nundef(gameIndex) || gameIndex > gameSequence.length) { gameIndex = 0; }
	}
	Settings.program.currentGameIndex = gameIndex;

	let game = gameSequence[gameIndex];

	//use level saved in localstorage:
	let lastLevel = Settings.program.currentLevel;
	if (isString(lastLevel)) { lastLevel = Number(lastLevel); }
	if (nundef(lastLevel)) { lastLevel = 0; } //gameSequence[Settings.program.currentGameIndex].startLevel_; }

	let userStartLevel = getUserStartLevel(game);

	Settings.program.currentLevel = RESTART_EACH_TIME ? userStartLevel : Math.max(userStartLevel, lastLevel);

	//friendly output
	let i = 0;
	gameSequence.map(x => {
		if (i == Settings.program.currentGameIndex) console.log('=>', x); else console.log('', x);
		i += 1;
	});
	console.log('LOADED: gameIndex', Settings.program.currentGameIndex, 'level', Settings.program.currentLevel);
}

function createCommonUi(dParent,resetHandler,continueHandler) {
	
	clearElement(dParent);
	mClass(dParent, 'hMinus60');
	let dUpper = mDiv(dParent); 
	// let ta = mCreate(maintag);
	//ta.id = 'dSettings_ta';
	// mAppend(dUpper, ta);
	mClass(dUpper, 'hPercentMinus60');
	// if (maintag=='div') mStyleX(ta,{matop:32})
	// if (maintag == 'textarea') ta.value = 'hallo'; else ta.innerHTML = 'hallo';

	let bdiv = mDiv(dParent); mStyleX(bdiv, { height: 54,align:'right' });
	let b;

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'reset to defaults';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = resetHandler; // () => { resetSettingsToDefaults(); }

	b = mCreate('button');
	mAppend(bdiv, b);
	b.innerHTML = 'continue playing';
	mClass(b, 'buttonClass', 'buttonPlus');
	b.onclick = continueHandler; //() => { closeProgramSettings(); startGame(); }

	// dParent.style.backgroundColor='yellow';
	// dUpper.style.backgroundColor='orange';

	return dUpper;
}
function createProgramSettingsUi() {
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLL')
	let dParent = mBy('dProgram');
	let container = createCommonUi(dParent,resetSettingsToDefaults,() => { closeProgramSettings(); startGame(); });

	let maintag='textarea';
	let ta = mCreate(maintag);
	ta.id = 'dSettings_ta';
	mAppend(container, ta);
	mClass(ta, 'whMinus60');

}
function createProgramSettingsUi() {
	let dParent = mBy('dProgram');
	clearElement(dParent);
	let ta = mCreate('textarea');
	ta.id = 'dSettings_ta';
	mAppend(dParent, ta);
	ta.rows = 25;
	ta.cols = 100;
	ta.value = 'hallo';
	let b = mCreate('button');
	mAppend(dParent, b);
	b.innerHTML = 'save';
	b.onclick = () => { saveSettingsX(); loadSettingsFromLocalStorage(); }
}
function createMenuUi() {
	let dParent = mBy('dMenu');
	let dOuter = createCommonUi(dParent, resetMenuToDefaults, () => { closeMenu(); startGame(); });

	let b = getBounds(dOuter);
	let d = mDiv(dOuter, { h: b.height - 60, margin: 20, bg: 'blue', border: '20px solid transparent', rounding: 20 });
	mClass(d, 'flexWrap');

	//hier kommt main menu
	//einfach nur games gallery
	//current game markiert


	//jedes game bekommt ein logo =>GFUNC
	let games = Settings.program.gameSequence.map(x=>x.game);
	console.log(games)

	// let games = ['gTouchPic', 'gWritePic', 'gSayPic', 'gTouchColors', 'gMissingLetter', 'gPreMem']; //, 'gMem'];
	let labels = games.map(g => GFUNC[g].friendlyName);
	let keys = games.map(g => GFUNC[g].logo);
	let bgs = games.map(g => GFUNC[g].color);

	//console.log('-----------------bgs', bgs);

	//let b=getBounds(d);
	//console.log('____________ bounds',b)

	let pics = maShowPictures(keys, labels, d, onClickGame, { bgs: bgs, shufflePositions: false });
	pics.map(x=>x.div.id='menu_'+x.label.substring(0,3));

	// mLinebreak(d);
	// mText('NOT IMPLEMENTED!!!!!!!!!!!!!',d,{fz:50});
	// gridLabeledX(keys, labels, d, { rows: 2, layout: 'flex' });
}




//#region nov 2020

function ensureColors() {
	let colorlist = lookupSet(Settings, ['games', 'gTouchColors', 'colors'], SIMPLE_COLORS);
	//let shadeColor = lookupSet(Settings, ['games', 'gTouchColors', 'shadeColor'], 'red');
	let contrast = lookupSet(Settings, ['games', 'gTouchColors', 'contrast'], .35);
	let shade = anyColorToStandardString(shadeColor, contrast);
	console.log('===>shadeColor',shadeColor,'contrast',contrast,'shade',shade)
	return [colorlist, shade];
}
function maPicLabelButtonFitText(info, label, { w, h, shade, bgPic, contrast }, handler, dParent, styles, classes = 'picButton', isText, isOmoji, focusElement) {
	// if (nundef(handler)) handler = (ev) => {
	// 	let id = evToClosestId(ev);
	// 	let info = symbolDict[id.substring(1)];
	// 	if (isLabelVisible(id)) maHideLabel(id, info); else maShowLabel(id, info);
	// 	if (isdef(focusElement)) focusElement.focus(); else if (isdef(mBy('dummy'))) mBy('dummy').focus();
	// }
	let picLabelStyles = getHarmoniousStylesPlusPlus(styles, {}, {}, w, h, 65, 0, 'arial', bgPic, 'transparent', null, null, true);

	//console.log(label)
	let x = maPicLabelFitX(info, label.toUpperCase(), { wmax: w, shade: shade, contrast: contrast }, dParent, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji);
	x.id = 'd' + info.key;
	if (isdef(handler)) x.onclick = handler;
	x.style.cursor = 'pointer';
	x.lastChild.style.cursor = 'pointer';
	x.style.userSelect = 'none';
	mClass(x, classes);
	return x;
}
function maPicLabelFitX(info, label, { wmax, hmax, shade, contrast = '#00000030' }, dParent, containerStyles, picStyles, textStyles, isText = true, isOmoji = false) {
	let d = mDiv(dParent);
	//console.log('picStyles',picStyles);


	if (isdef(shade)) {

		//console.log('===>shade',shade,'contrast',contrast);
		//console.log(picStyles);
		let sShade = '0 0 0 ' + shade; //green';
		picStyles['text-shadow'] = sShade;// +', '+sShade+', '+sShade;
		picStyles.fg =  contrast; //'#00000080' '#00000030' 
	}

	let dPic = maPic(info, d, picStyles, isText, isOmoji);
	// mText(info.annotation, d, textStyles, ['truncate']);
	let maxchars = 15; let maxlines = 1;
	//console.log(containerStyles, picStyles, textStyles);

	//if (isdef(hmax))
	//console.log('maPicLabelFitX_', 'wmax', wmax, 'hmax', hmax)
	let wAvail, hAvail;
	hAvail = containerStyles.h - (containerStyles.patop + picStyles.h);// + containerStyles.pabottom);
	wAvail = containerStyles.w;
	//console.log('=>', 'wAvail', wAvail, 'hAvail', hAvail);
	if (isdef(hmax)) {
		hAvail = containerStyles.h - (containerStyles.patop + picStyles.h);// + containerStyles.pabottom);
		if (hmax != 'auto') {
			hAvail = Math.min(hAvail, hmax);
		}
	}
	if (isdef(wmax)) {
		wAvail = containerStyles.w;
		if (wmax != 'auto') {
			wAvail = Math.min(wAvail, wmax);
		}
	}
	let fz = textStyles.fz;
	//measure text height and width with this font!
	//console.log('_ avail:', wAvail, hAvail)
	let styles1 = textStyles;
	let size = getSizeWithStylesX(label, styles1, isdef(wmax) ? wAvail : undefined, isdef(hmax) ? hAvail : undefined);
	//console.log('__', 'size', size);
	let size1 = getSizeWithStylesX(label, styles1);//, isdef(wmax) ? wAvail : undefined, isdef(hmax) ? hAvail : undefined);
	//console.log('__', 'size1', size1);

	let f1 = wAvail / size1.w;
	let isTextOverflow = f1 < 1;
	if (f1 < 1) {
		textStyles.fz *= f1;
		textStyles.fz = Math.floor(textStyles.fz);
		//console.log('text overflow! textStyles', textStyles);
	}

	let [wBound, hBound] = [isdef(wmax) ? size.w : undefined, isdef(hmax) ? size.h : undefined];

	let isOverflow = isdef(wBound) && size.w > wAvail || isdef(hBound) && size.h > hAvail;
	//console.log('___ isOverflow',isOverflow);


	let dText = mTextFit(label, { wmax: wBound, hmax: hBound }, d, textStyles, isTextOverflow ? ['truncate'] : null);
	// d.style.textAlign = 'center';
	// dText.style.textAlign = 'center';
	// containerStyles.align = 'center';

	mStyleX(d, containerStyles);

	dText.style.margin = 'auto';
	// console.log('____', d.id, d.style.textAlign, d, containerStyles)

	////console.log(dParent,'\nd',d,'\ndPic',dPic,'\ndText',dText);

	return d;
}
function showPictures1(onClickPictureHandler, { colors, overlayShade } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics);
	//keys=['sun with face'];
	Pictures = maShowPictures(keys,labels,dTable,onClickPictureHandler,{lang:currentLanguage, colors:colors, overlayShade:overlayShade });return;

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;

	let ww = window.innerWidth;
	let wh = window.innerHeight;
	let hpercent = 0.60; let wpercent = .6;
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / NumPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = keys.length;
	} else {
		let dims = calcRowsColsX(NumPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	pictureSize = Math.max(50, Math.min(sz, 200));
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function showPicturesX(onClickPictureHandler, { border, colors, overlayShade, repeat = 1, shufflePositions = true } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics / repeat);
	console.log(repeat, NumPics);

	if (isdef(repeat)) {
		let keys1 = jsCopy(keys);
		for (let i = 0; i < repeat - 1; i++) { keys = keys.concat(keys1); }
		if (shufflePositions) shuffle(keys)
	}

	console.log(keys);

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	let bgPic = isdef(colors) ? 'white' : 'random';
	let bgs = {};
	for (const l of labels) {
		if (isdef(bgs[l])) continue;
		bgs[l] = computeColor(bgPic);
	}


	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(NumPics, lines);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	if (isdef(border)) stylesForLabelButton.border = border;

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgs[label], shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function showPicturesXt(onClickPictureHandler, { border, colors, overlayShade, repeat = 1, shufflePositions = true } = {}, keys, labels){
	let pics = Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler, { lang:currentLanguage, border:border, colors:colors, overlayShade:overlayShade, repeat:repeat, shufflePositions:shufflePositions } = {});
	
	let totalPics = pics.length;
	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(pics, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of pics) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}
}
function showPictures(onClickPictureHandler, { colors, overlayShade } = {}, keys, labels) {
	Pictures = [];

	if (nundef(keys)) keys = choose(currentKeys, NumPics);
	//Pictures = maPicShowPictures(keys,labels,dTable,onClickPictureHandler,{ colors, overlayShade });

	let infos = keys.map(x => getRandomSetItem(currentLanguage, x));
	if (nundef(labels)) {
		labels = [];
		for (const info of infos) {
			labels.push(info.best);
		}
	}

	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let bgPic = isdef(colors) ? 'white' : 'random';

	let lines = isdef(colors) ? colors.length : 1;

	let ww = window.innerWidth;
	let wh = window.innerHeight;
	let hpercent = 0.60; let wpercent = .6;
	let sz, picsPerLine;
	if (lines > 1) {
		let hpic = wh * hpercent / lines;
		let wpic = ww * wpercent / NumPics;
		sz = Math.min(hpic, wpic);
		picsPerLine = keys.length;
	} else {
		let dims = calcRowsColsX(NumPics);
		let hpic = wh * hpercent / dims.rows;
		let wpic = ww * wpercent / dims.cols;
		sz = Math.min(hpic, wpic);
		picsPerLine = dims.cols;
	}

	pictureSize = Math.max(50, Math.min(sz, 200));
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let info = infos[i];
			let label = labels[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dTable);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{
					w: pictureSize, h: pictureSize, bgPic: bgPic, shade: shade,
					overlayColor: overlayShade
				}, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			Pictures.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
		}
	}

	let totalPics = Pictures.length;

	if (Settings.program.labels) {
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - NumLabels);
		for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
	} else {
		for (const p of Pictures) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }

	}

}
function maShowPictures(keys, labels, dParent, onClickPictureHandler, { container, lang, border, bgs, colors, overlayShade, repeat = 1, shufflePositions = true } = {}) {
	let pics = [];

	console.log('keys', keys, '\n', 'labels', labels, '\n', 'bgs', bgs)

	let numPics = keys.length * repeat;

	//make a label for each key
	let items = [];
	for(let i=0;i<keys;i++){
		let k=keys[i];
		let info = isdef(lang)? getRnadomSetItem(lang,k):symbolDict[k];
		let bg = isList(bgs)?gsb[i]:isdef(colors)?'white':'random';
		let label = isList(labels)?labels[i]:isdef(lang)?info.best:k;
		items.push({key:k,info:info,label:label,bg:bg});
	}

	if (isdef(repeat)) {
		let items1 = jsCopy(items);
		for (let i = 0; i < repeat - 1; i++) { items = items.concat(items1); }
	}

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)){
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	// let infos = keys.map(x => symbolDict[x]);

	if (isdef(repeat)) {
		let keys1 = jsCopy(keys);
		for (let i = 0; i < repeat - 1; i++) { keys = keys.concat(keys1); }
	}

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		infos = keys.map(x => getRandomSetItem(lang, x));
		if (nundef(labels)) {
			labels = [];
			for (const info of infos) {
				labels.push(info.best);
			}
		}
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	console.log('bgs', bgs, typeof bgs)
	if (nundef(bgs)) {
		let bgPic = isdef(colors) ? 'white' : 'random';
		bgs = {};
		for (const l of labels) {
			if (isdef(bgs[l])) continue;
			bgs[l] = computeColor(bgPic);
		}
	} else if (isList(bgs)) {
		let bglist = bgs;
		bgs = {};
		for (let i = 0; i < bglist.length; i++) {
			bgs[labels[i]] = bglist[i];
		}

	}



	console.log(keys);

	let isText = true;
	let isOmoji = false;
	if (isdef(lang)) {
		infos = keys.map(x => getRandomSetItem(lang, x));
		if (nundef(labels)) {
			labels = [];
			for (const info of infos) {
				labels.push(info.best);
			}
		}
		let textStyle = getParamsForMaPicStyle('twitterText');
		isText = textStyle.isText;
		isOmoji = textStyle.isOmoji;
	}

	//sollte es so machen dass list of numList {info:info,key:key,label:label,bgs:bgs} habe
	//dann erst shuffle!
	if (shufflePositions) shuffle(keys);

	let lines = isdef(colors) ? colors.length : 1;
	let [pictureSize, picsPerLine] = calcDimsAndSize(numPics, lines, container);
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	if (isdef(border)) stylesForLabelButton.border = border;

	for (let line = 0; line < lines; line++) {
		let shade = isdef(colors) ? colors[line] : undefined;
		for (let i = 0; i < keys.length; i++) {
			let item = items[i];
			let info = item.info; //infos[i];
			let label = item.label; //labels[i];
			let bgPic = item.bg; //bgs[i];
			let ipic = (line * keys.length + i);
			if (ipic % picsPerLine == 0 && ipic > 0) mLinebreak(dParent);
			let id = 'pic' + ipic; // (line * keys.length + i);
			let d1 = maPicLabelButtonFitText(info, label,
				{ w: pictureSize, h: pictureSize, bgPic: bg, shade: shade, overlayColor: overlayShade },
				onClickPictureHandler, dParent, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
			d1.id = id;
			pics.push({ shade: shade, key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true, isSelected: false });
		}
	}

	return pics;


}
function layoutGrid(elist, dGrid, containerStyles, { rows, cols, isInline = false } = {}) {
	//console.log(elist, elist.length)

	let dims = calcRowsCols(elist.length, rows, cols);
	//console.log('dims', dims);

	let parentStyle = jsCopy(containerStyles);
	parentStyle.display = isInline ? 'inline-grid' : 'grid';
	parentStyle['grid-template-columns'] = `repeat(${dims.cols}, auto)`;
	parentStyle['box-sizing'] = 'border-box'; // TODO: koennte ev problematisch sein, leave for now!

	//console.log('parentStyle', parentStyle)

	mStyleX(dGrid, parentStyle);
	let b = getBounds(dGrid);
	return { w: b.width, h: b.height };

}
function onClickRestartProgram() {

	let i = Settings.program.currentGameIndex = 0;
	Settings.program.currentLevel = currentLevel = getUserStartLevel(i); //0; //Settings.program.gameSequence[0].startLevel_;

	localStorage.setItem(SETTINGS_KEY_FILE, JSON.stringify(Settings));
	loadSettingsFromLocalStorage();

}

function determineGame_dep(data) {
	//determining currentGame: data undefined, game name or game index
	if (nundef(data)) {
		if (GameSelectionMode == 'program') {
			data = gameSequence[Settings.program.currentGameIndex];
			currentGame = data.game;
			currentLevel = Settings.program.currentLevel;
		} else if (GameSelectionMode == 'training') {
			currentGame = 'gSayPicAuto';
			currentLevel = 0;
			//MASTER_VOLUME = 1;
			show('divControls');
		} else {
			console.log('hard-coded: currentGame', currentGame, 'currentLevel', currentLevel);
		}
	} else if (isNumber(data)) {
		GameSelectionMode = 'indiv';
		currentLevel = Number(data) % MAXLEVEL;

	} else if (isString(data)) {
		//data is the name of a game
		GameSelectionMode = 'indiv';
		currentGame = data;
		currentLevel = startAtLevel[currentGame];
	}
}
function scoreSummary() {

	let game = {};
	for (const gdata of CurrentSessionData.games) {
		//let gData=CurrentSessionData.games[gname];
		let gname = gdata.name;
		let nTotal = 0;
		let nCorrect = 0;
		for (const ldata of gdata.levels) {
			if (nundef(ldata.numTotalAnswers)) continue;
			nTotal += ldata.numTotalAnswers;
			nCorrect += ldata.numCorrectAnswers;
		}
		if (nTotal == 0) continue;
		if (isdef(game[gname])) {
			game[gname].nTotal += nTotal;
			game[gname].nCorrect += nCorrect;
		} else {
			game[gname] = { name: gname, nTotal: nTotal, nCorrect: nCorrect };
		}


	}
	console.log('game',game);
	for (const gname in game) {
		let tot=game[gname].nTotal;
		let corr = game[gname].nCorrect;
		console.log(gname,tot,corr)
		game[gname].percentage = (game[gname].nCorrect / Math.max(1, game[gname].nTotal))*100;
	}



	//let dParent=mBy('freezer2');
	let d = mBy('dContentFreezer2');
	clearElement(d);
	mStyleX(d, { fz: 20, matop: 40, bg: 'silver', fg: 'indigo', rounding: 20, padding: 25 })
	let style = { matop: 4 };
	mText('Unit Score:', d, { fz: 22 });
	
	for(const gname in game){
		//let name = gname.substring(1);
		let sc=game[gname];

		mText(`${GFUNC[gname].friendlyName}: ${sc.nCorrect}/${sc.nTotal} correct answers (${sc.percentage}%) `, d, style);

	}
	// mText('Writing: 10/15 correct answers (70%)', d, style);
	// mText('Speaking: 10/15 correct answers (70%)', d, style);
	// mText('Completing Words: 10/15 correct answers (70%)', d, style);
	// mText('Identifying Words: 10/15 correct answers (70%)', d, style);
	// mText('Colors and Words: 10/15 correct answers (70%)', d, style);

	//session scores should be downloaded!
	return game;

}

async function loadSession_yet(){
	fetch('http://localhost:3000/users/1', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		// body: JSON.stringify(payload)
	}).then(data => {
		CurrentSessionData = await data.json();
		console.log(CurrentSessionData);
		SessionStart();
	});
}
async function saveSession() {
	//localStorage.
	console.log('posting...');

	let payload = {
		"id": 1,
		"email": "john@doe.com"
	};
	fetch('http://localhost:3000/users/1', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(data => {
		console.log(data);
		// this.notifications.show({
		//     message: 'Изменения сохранены'
		// });
	});

	// const response = await fetch('http://localhost:3000/users', {
	// 	method: 'POST', // *GET, POST, PUT, DELETE, etc.
	// 	mode: 'no-cors', // no-cors, *cors, same-origin
	// 	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	// 	credentials: 'same-origin', // include, *same-origin, omit
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 		// 'Content-Type': 'application/x-www-form-urlencoded',
	// 	},
	// 	redirect: 'follow', // manual, *follow, error
	// 	referrerPolicy: 'no-referrer', // no-referrer, *client
	// 	body: JSON.stringify({ userId:566, name: 'toto' })}); // body data type must match "Content-Type" header
	//});
	//return await response.json(); // parses JSON response into native JavaScript objects

	// fetch('http://localhost:3000/users', {
	//   username: 'max',
	//   password: 'hallo',
	//   mode: 'no-cors',
	//   method: 'post',
	//   url: `http://localhost:3000`,
	//   credentials: 'include'
	// });
	//postData('https://localhost:3000/users', { userId:566, name: 'toto' })
}
//#endregion