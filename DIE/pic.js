//#region NEW
function logicSetSelector() {
	//should return sSpoken,sWritten,piclist and set Goal
	let props = { label: { vals: getDistinctVals(Pictures, 'label'), friendly: '' } };
	if (G.numColors > 1) props.colorKey = { vals: getDistinctVals(Pictures, 'colorKey'), friendly: 'color' };
	if (G.numRepeat > 1) props.iRepeat = { vals: getDistinctVals(Pictures, 'iRepeat'), friendly: 'number' };

	//console.log('props', props)

	//level 0: eliminate all backpacks | eliminate all with color=blue | elim all w/ number=2
	let lstSpoken, lstWritten, piclist=[];
	if (G.level >= 0) {
		let prop = chooseRandom(Object.keys(props));
		//console.log('prop is', prop, 'vals', props[prop].vals)
		let val = chooseRandom(props[prop].vals);
		//console.log('val chosen', val)
		//val = chooseRandom(myProps[prop])
		let lst = ['eliminate', 'all'];
		if (prop == 'label') {
			lst.push(val + (Settings.language == 'E' ? 's' : ''));
			piclist = Pictures.filter(x=>x.label == val);
		} else {
			lst = lst.concat(['with', props[prop].friendly, val]);
			piclist = Pictures.filter(x=>x[prop] == val);
		}
		lstSpoken = lst;
		//console.log(lstSpoken)
	}
	if (nundef(lstWritten)) lstWritten = lstSpoken;

	return [lstSpoken.join(' '), lstWritten.join(' '),piclist];

}
function logicCheck(pic) {
	//should return reue if pic is part of set to be clicked and remove that pic
	//return false if that pic does NOT belong to piclist
}
function logicReset() {
	//resets piclist;
}





function showPictures(onClickPictureHandler, { showRepeat = false, sz, bgs, colorKeys, contrast, repeat = 1,
	sameBackground = true, border, textColor, fz = 20 } = {}, keys, labels) {
	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
		{
			showRepeat: showRepeat, picSize: sz, bgs: bgs, repeat: repeat, sameBackground: sameBackground, border: border,
			lang: Settings.language, colorKeys: colorKeys, contrast: contrast
		});

	// label hiding
	let totalPics = Pictures.length;
	if (nundef(Settings.labels) || Settings.labels) {
		if (G.numLabels == totalPics) return;
		let remlabelPic = choose(Pictures, totalPics - G.numLabels);
		for (const p of remlabelPic) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}
	} else {
		for (const p of Pictures) {
			//console.log('hi1');
			maHideLabel(p.id, p.info); p.isLabelVisible = false;
		}

	}

}

//#region card face up or down
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

//#region selection of picture
function toggleSelectionOfPicture(pic, selectedPics) {
	let ui = pic.div;
	//if (pic.isSelected){pic.isSelected=false;mRemoveClass(ui,)}
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selectedPics)) {
		if (pic.isSelected) {
			console.assert(!selectedPics.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
			selectedPics.push(pic);
		} else {
			console.assert(selectedPics.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
			removeInPlace(selectedPics, pic);
		}
	}
}























