function mGrid(n, R, uidParent) { //enspricht jetzt dem basic type grid!!!!
	// *** stage 3: prep container div/svg/g (board) as posRel ***
	let dParent = mBy(n.idUiParent);

	let boardDiv = stage3_prepContainer(dParent); //macht nur mDiv,mPosRel

	addTitleToGrid(n, boardDiv)

	let boardSvg = gSvg();

	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	boardSvg.setAttribute('style', style);
	boardSvg.id = n.uid + '_svg';
	boardDiv.appendChild(boardSvg);

	let boardG = gG();
	boardSvg.appendChild(boardG);

	n.bi.boardDiv = boardDiv;
	// mColor(boardDiv, 'blue'); //apply stylings?
	boardDiv.id = n.uid + '_div';
	n.bi.boardSvg = boardSvg;
	let ui = n.bi.boardG = boardG;
	n.uiType = 'h';

	n.uidDiv = n.uidStyle = boardDiv.id;
	n.uidSvg = boardSvg.id;
	n.uidG = n.uid;

	//do your own styling!or WHAT??????????

	return ui;

}

function lGrid(n,R){
	//console.log('YES!')
	resizeBoard(n, R);

	//only NOW arrange of children of board members is done!!! 
	for (const uidMember of n.children) {
		let tile = R.uiNodes[uidMember];
		if (nundef(tile.children)) continue;

		//simpleLayoutForOneChildPosition(n,tile,R);
		wrapLayoutPosition(n, tile, R);
	}
	return { w: n.wTotal, h: n.hTotal };

}