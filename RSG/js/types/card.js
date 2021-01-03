
function mCard(n, R, uidParent) {
	let dParent = mBy(n.idUiParent);

	console.log('...MCARD')
	//fuer solution 2:
	let uiWrapper = mDiv(dParent);
	addClass(uiWrapper, 'cardWrapper');
	let ui = mText(n.content, uiWrapper);
	addClass(ui, 'cardStyle');

	// let ui = mText(n.content, dParent);
	// addClass(ui,'cardStyle'); 

	// let params = decodeParams(n,{},R);
	// mStyle(ui, params);

	return ui;
}
function lCard(){}