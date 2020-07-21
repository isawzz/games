function mCard(n, uidParent, R) {
	let dParent = mBy(n.idUiParent);

	//fuer solution 2:
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');
	let ui = mTextDiv(n.content, uiWrapper);
	addClass(ui, 'cardStyle');

	// let ui = mTextDiv(n.content, dParent);
	// addClass(ui,'cardStyle'); 

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}
function lCard(){}