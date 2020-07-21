function mDefault(n, area, R) {
	let ui;
	let dParent = mBy(n.idUiParent);
	ui = mDiv(dParent);
	if (isdef(n.content)) {
		//console.log('..........',isSizedNode(n))
		let d = mNode(n.content, ui, n.title, isSizedNode(n));
		if (isdef(n.params['text-align'])) d.style.textAlign = n.params['text-align'];
	}
	addClassInfo(ui,n);
	//let b = getBounds(ui, true);console.log('________mBare: ', n.uid, '\n', ui, '\nbounds', b.width, b.height);
	return ui;

}








