
function mPanel(n, R, area) {
	//console.log('panel.......', n.uid, n.idUiParent);

	let dParent = mBy(n.idUiParent);

	if (getTypeOf(dParent) == 'g') { return gPanel(n, R, area); }

	let ui = n.ui;
	if (n.changing && isdef(ui)) {
		clearIncludingAttr(ui);
		delete n.changing;
	} else {
		ui = mDiv(dParent);
	}

	//content
	if (isdef(n.content)) {
		let d1 = mText(n.content, ui);
	}

	return ui;
}
function gPanel(n, R, area) {
	gParent = mBy(area);
	n.idUiParent = gParent.id;

	if (isdef(n.ui)) {
		// removeAllEvents(n.ui);
		// n.act = null;
		delete n.changing;
		return n.ui;
	}

	//console.log('EIN NEUES G PANEL?????? ECHT?????')
	let ui = agG(gParent);
	n.uiType = 'g';
	return ui;
}

