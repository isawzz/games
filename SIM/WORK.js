function aniTurnFaceDown(pic, msecs = 5000, fadeBackground = false) {
	let ui = pic.div;
	for (const p1 of ui.children) {
		p1.style.transition = `opacity ${msecs}ms ease-in-out`;
		//p1.style.transition = `opacity ${msecs}s ease-in-out, background-color ${msecs}s ease-in-out`;
		p1.style.opacity = 0;
		//p1.style.backgroundColor = 'dimgray';
		//mClass(p1, 'transopaOff'); //aniSlowlyDisappear');
	}
	if (fadeBackground){
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

function showPics(dParent, { lang = 'E', num = 1, repeat = 1, sameBackground = true, keys, labels, clickHandler, colors, contrast, border } = {}) {
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
		if (NumLabels == totalPics) return;
		let remlabelPic = choose(pics, totalPics - NumLabels);
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

	console.log('spoken', spoken);

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
function setPicsAndGoal(pics) { Pictures = pics; Goal = pics[0]; console.log(pics); return pics[0]; }

















