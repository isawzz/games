function mDefault(n, R, area) {
	let ui;
	let dParent = mBy(n.idUiParent);
	ui = mDiv(dParent);
	if (isdef(n.content)) {
		//console.log('-------------',n.type)
		let d;
		if (n.type != 'manual00') d = mNode(n.content, ui, n.title, isSizedNode(n));
		else d = mNode(n.content, ui, n.title);
		if (isdef(n.params['text-align'])) d.style.textAlign = n.params['text-align'];
	}
	if (n.type != 'manual00') addClassInfo(ui, n);
	return ui;

}








