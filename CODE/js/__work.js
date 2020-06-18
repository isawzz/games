function makeUiOnBoardMember(n, uidParent, R) {
	let ui;
	let divParent = findAncestorElemOfType(mBy(uidParent), 'div');
	n.idUiParent = divParent.id;
	let directParent = mBy(uidParent); //parent of robber
	console.log('\ndivParent is', divParent, '\ndirectParent is', directParent,'\nn.content',n.content);

	//ui = mTextDiv(n.content	); 
	//ui = isdef(n.content)?mNode(n.content, divParent):mDiv(divParent);
	ui = mNode(n.content, divParent);

	//als erstes alle stylings!
	let pre = ui.children[0];
	if (!n.content) {
		pre.innerHTML = '';
		n.adirty = true;
	} else {
		pre.style.fontSize = '10pt';
	}
	ui.style.borderRadius = '6px';
	ui.style.padding = '2px 10px 2px 8px';

	applyCssStyles(ui, n.cssParams);

	//als zweites append damit getBounds functioniert
	mAppend(divParent, ui);

	//als LETZTES: positioning!
	let bmk = getBounds(directParent, false, divParent);//false,mBy('table'));
	ui.style.position = 'absolute';
	ui.style.display = 'inline-block';

	//das darf erst NACH inline-block sein weil size veraendert!!!!!!!!!
	let bel = getBounds(ui);
	ui.style.left = (bmk.left + (bmk.width - bel.width) / 2) + 'px';
	ui.style.top = (bmk.top + (bmk.height - bel.height) / 2) + 'px';
	n.uiType = 'childOfBoardElement';
	n.potentialOverlap = true;
	return ui;

}































