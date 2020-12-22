function showPictures(onClickPictureHandler, { showRepeat = false, sz, bgs, colors, contrast, repeat = 1,
	sameBackground = true, border, textColor, fz = 20 } = {}, keys, labels) {
	Pictures = [];
	if (nundef(keys)) keys = choose(G.keys, G.numPics);
	//keys=['toolbox','tiger']; //keys[0] = 'butterfly'; //keys[0]='man in manual wheelchair';	//keys=['sun with face'];

	//#region experimental code not activated yet!!!
	// let sCont = {}; if (isdef(sz)) sCont.w = sCont.h = sz; if (isdef(border)) sCont.border = border; //sCont.padding=8;
	// let sPic = {}; if (isdef(contrast)) sPic.contrast = contrast;
	// let sText = { fz: fz };
	// Pictures = maShowPicturesX3(keys, labels, dTable, onClickPictureHandler,
	// 	{ showRepeat: showRepeat, bgs: bgs, repeat: repeat, sameBackground: sameBackground, lang: Settings.language, colors: colors, textColor: textColor },
	// 	//	{ sCont: sCont, sPic: sPic, sText: sText });
	// 	{ sCont: { w: 200, h: 200, padding: 10, align: 'center' }, sPic: { contrast: .3 }, sText: { fz: 20 } });
	// //use this in case of broken!!!!	
	//#endregion

	Pictures = maShowPictures(keys, labels, dTable, onClickPictureHandler,
		{
			showRepeat: showRepeat, picSize: sz, bgs: bgs, repeat: repeat, sameBackground: sameBackground, border: border,
			lang: Settings.language, colors: colors, contrast: contrast
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
function toggleSelectionOfPicture(pic,selectedPics) {
	let ui = pic.div;
	//if (pic.isSelected){pic.isSelected=false;mRemoveClass(ui,)}
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');

	//if picList is given, add or remove pic according to selection state
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























