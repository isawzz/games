
function recPresentNode(n, R, trickle) {
	//console.log('trickle', n.uid, trickle);

	if (isdef(n.children)) {
		for (const ch of n.children) {
			let n1 = R.uiNodes[ch];
			recPresentNode(n1, R, trickleDown(n1, R, trickle));
		}
	}

	//hier muss dann das sizing machen
	if (n.params.display == 'flex') {
		//console.log('flex type', n.type);
		if (isdef(n.children)) n.size = panelLayout(n, R);
		else n.size = measureElement(n.ui);
		//console.log(n.size);
	} else {
		//console.log('NOT IMPLEMENTED!', n.type, n.params);
	}
	return;
}
function measureElement(elem) {	let b = getBounds(elem, true);	return { w: b.width, h: b.height };}


