function aniTurnFaceDown(pic, msecs = 5000, fadeBackground = false) {
	let ui = pic.div;
	for (const p1 of ui.children) {
		p1.style.transition = `opacity ${msecs}ms ease-in-out`;
		//p1.style.transition = `opacity ${msecs}s ease-in-out, background-color ${msecs}s ease-in-out`;
		p1.style.opacity = 0;
		//p1.style.backgroundColor = 'dimgray';
		//mClass(p1, 'transopaOff'); //aniSlowlyDisappear');
	}
	if (fadeBackground) {
		ui.style.transition = `background-color ${msecs}ms ease-in-out`;
		ui.style.backgroundColor = 'dimgray';
	}
	//ui.style.backgroundColor = 'dimgray';
	pic.isFaceUp = false;

}
function aniInstruct(dTarget, spoken) {
	if (isdef(spoken)) Speech.say(spoken, .7, 1, .7, 'random'); //, () => { console.log('HA!') });
	mClass(dTarget, 'onPulse');
	setTimeout(() => mRemoveClass(dTarget, 'onPulse'), 500);

}
function showPics(dParent, { lang = 'E', num = 1, repeat = 1, numLabels, sameBackground = true, keys, labels, clickHandler, colors, contrast, border } = {}) {
	let pics = [];

	if (nundef(keys)) keys = choose(symKeysBySet['nosymbols'], num);
	//keys[0]='man in manual wheelchair';
	//keys=['sun with face'];
	//console.log(keys,repeat)
	//console.log(labels)
	pics = maShowPictures(keys, labels, dParent, clickHandler,
		{ repeat: repeat, sameBackground: sameBackground, border: border, lang: lang, colors: colors, contrast: contrast });

	// if (nundef(keys)) keys = choose(currentKeys, NumPics);
	// Pictures = maShowPictures(keys,labels,dTable,onClickPictureHandler,{ colors, contrast });

	let totalPics = pics.length;
	//console.log(totalPics,NumLabels)
	if (nundef(Settings.program.labels) || Settings.program.labels) {
		if (nundef(numLabels) || numLabels == totalPics) return pics;
		let remlabelPic = choose(pics, totalPics - numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of pics) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}
	return pics;

}
function turnFaceDown(pic) {
	let ui = pic.div;
	for (const p1 of ui.children) p1.style.opacity = 0; //hide(p1);
	ui.style.backgroundColor = 'dimgray';
	pic.isFaceUp = false;

}
function turnFaceUp(pic) {
	let div = pic.div;
	for (const ch of div.children) {
		ch.style.transition = `opacity ${1}s ease-in-out`;
		ch.style.opacity = 1; //show(ch,true);
		if (!pic.isLabelVisible) break;
	}
	div.style.transition = null;
	div.style.backgroundColor = pic.bg;
	pic.isFaceUp = true;
}
function toggleFace(pic) { if (pic.isFaceUp) turnFaceDown(pic); else turnFaceUp(pic); }

function turnPicsDown(pics, msecs, fadeBackground) {
	//console.log(arguments)
	for (const p of pics) { aniTurnFaceDown(p, msecs, fadeBackground); }
}
function wait() { console.log('waiting...'); }
function instruct(tEmphasis, htmlPrefix, dParent, isSpoken, tSpoken) {
	//use: symbolDict
	//console.assert(title.children.length == 0,'TITLE NON_EMPTY IN SHOWINSTRUCTION!!!!!!!!!!!!!!!!!')
	clearElement(dParent);
	let d = mDiv(dParent);
	mStyleX(d, { margin: 15 })
	mClass(d, 'flexWrap');

	if (isDict(tEmphasis)) tEmphasis = tEmphasis.label;

	let spoken;
	if (isdef(tSpoken)) { spoken = tSpoken; }
	else if (isSpoken) {
		if (htmlPrefix.includes('/>')) {
			let elem = createElementFromHTML(htmlPrefix);
			spoken = stringBefore(htmlPrefix, '<') + ' ' + stringAfter(htmlPrefix, '>');
			spoken = stringBefore(htmlPrefix, '<');
		} else spoken = htmlPrefix;
		spoken = spoken + " " + tEmphasis;
	}
	else spoken = null;

	//console.log('spoken', spoken);

	let msg = htmlPrefix + " " + `<b>${tEmphasis.toUpperCase()}</b>`;
	let d1 = mText(msg, d, { fz: 36, display: 'inline-block' });
	let sym = symbolDict.speaker;
	let d2 = mText(sym.text, d, {
		fz: 38, weight: 900, display: 'inline-block',
		family: sym.family, 'padding-left': 14
	});

	d.addEventListener('click', () => aniInstruct(dParent, spoken));

	if (!isSpoken) return;

	Speech.say(spoken, .7, 1, .7, 'random');
	return d;

}
function setPicsAndGoal(pics) {
	Pictures = pics;
	Goal = pics[0];
	//console.log(pics);
	return pics[0];
}

function catFiltered(cats, name, best) {
	console.log(cats, name)
	let keys = setCategories(cats);

	let bestName = null;
	let k1 = keys.filter(x => best.includes(x));
	if (k1.length > 80) bestName = name + '100';
	else if (k1.length > 40) bestName = name + '50';
	else if (k1.length > 20) bestName = name + '25';
	let result = {};
	result[name] = keys;
	if (bestName) result[bestName] = k1;

	return result;
}
function getKeySets() {
	let ks=localStorage.getItem('KeySets');
	if (isdef(ks)) return JSON.parse(ks);
	
	let allKeys = symKeysBySet.nosymbols;
	let keys = allKeys.filter(x => isdef(symbolDict[x].best100));
	let keys1 = allKeys.filter(x => isdef(symbolDict[x].best100) && isdef(symbolDict[x].bestE));
	let keys2 = allKeys.filter(x => isdef(symbolDict[x].best50));
	let keys3 = allKeys.filter(x => isdef(symbolDict[x].best25));
	let res = { best25: keys3, best50: keys2, best75: keys1, best100: keys, all: allKeys };
	let res1 = catFiltered(['nosymemo'], 'nemo', res.best100);
	let res2 = catFiltered(['animal', 'plant', 'fruit', 'vegetable'], 'life', res.best100);
	let res3 = catFiltered(['object'], 'object', res.best100);
	let res4 = catFiltered(['gesture', 'emotion'], 'emo', res.best100);
	let res5 = catFiltered(['activity', 'role', 'sport', 'sports', 'game'], 'action', res.best100);
	for (const o of [res1, res2, res3, res4, res5]) {
		for (const k in o) res[k] = o[k];
	}
	localStorage.setItem('KeySets',JSON.stringify(res));
	return res;

}
function activate({ onclickPic }) {
	if (isdef(onclickPic) && nundef(Pictures[0].div.onclick)) Pictures.map(x => x.div.onclick = onclickPic);
	uiActivated = true;
}

function chainEx(taskChain, onComplete) { let akku = []; return _chainExRec(akku, taskChain, onComplete); }
function _chainExRec(akku, taskChain, onComplete) {
	if (taskChain.length > 0) {
		let task = taskChain[0], f = task.f, parr = task.parr, t = task.msecs, waitCond = task.waitCond, tWait = task.tWait;

		if (CancelGame) { clearTimeout(ChainTimeout); return akku; }

		if (isdef(waitCond) && !waitCond()) {
			if (nundef(tWait)) tWait = 300;
			ChainTimeout = setTimeout(() => _chainExRec(akku, taskChain, onComplete), tWait);
		} else {
			for (let i = 0; i < parr.length; i++) {
				let para = parr[i];
				if (para == '_last') parr[i] = arrLast(akku);
				else if (para == '_all' || para == '_list') parr[i] = akku;
				else if (para == '_first') parr[i] = akku[0];

			}

			let result = f(...parr);
			if (isdef(result)) akku.push(result);

			if (isdef(t)) {
				ChainTimeout = setTimeout(() => _chainExRec(akku, taskChain.slice(1), onComplete), t);
			} else {
				_chainExRec(akku, taskChain.slice(1), onComplete);
			}

		}


	} else { onComplete(akku); }
}
function interact(func) {
	return uiActivated ? func : null;
}
function selectOnClick(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;

	let i = firstNumber(id);
	let item = Pictures[i];
	Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

	Selected.reqAnswer = Goal.label;
	Selected.answer = item.label;
	return item;
}
function revealAndSelectOnClick(ev) {
	let pic = selectOnClick(ev);
	turnFaceUp(pic);

}
function evalSelectGoal() {
	if (Goal == Selected.pic) {
		//console.log('????????WIN!!!');
		return true;
	} else {
		//console.log('FAIL!');
		return false;
	}
}

function scorePlus1IfWin(isCorrect) {
	if (isCorrect) Score += 1;
}

function toggleSelectionOfPicture(pic,selectedPics) {
	let ui = pic.div;
	//if (pic.isSelected){pic.isSelected=false;mRemoveClass(ui,)}
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selectedPics)){
		if (pic.isSelected) {
			console.assert(!selectedPics.includes(pic),'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
			selectedPics.push(pic);
		}else{
			console.assert(selectedPics.includes(pic),'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
			removeInPlace(selectedPics,pic);
		}
	}
}












