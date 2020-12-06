
function defaultOnFocusEditableText(inp) {
	inp.style.backgroundColor = 'white';
}
function defaultOnLostFocusEditableText(inp) {
	//console.log('lost focus!!!')
	inp.style.backgroundColor = 'transparent';
}
function mEditableInput(dParent, { type, label, onFocus, onLostFocus, val, styles, classes } = {}) {
	let inp = mInput(dParent, type, label, styles);

	console.log(inp)

	if (nundef(onFocus)) onFocus = defaultOnFocusEditableText;
	if (nundef(onLostFocus)) onLostFocus = defaultOnLostFocusEditableText;

	let defStyles = { maleft: 12, mabottom: 4 };
	styles = nundef(styles) ? defStyles : deepMergeOverride(defStyles, styles);
	mStyleX(inp, styles);

	// mClass(inp, 'input', ...classes);
	mClass(inp, 'editableText');
	inp.value = 'hallo'

	inp.addEventListener('focus',ev=>onFocus(ev.target));
	inp.addEventListener('focusout',ev=>onLostFocus(ev.target));
	// if (isdef(onFocus)) inp.onfocus = ()=>onFocus(inp);//"${onFocusName}(this)" onfocusout="${onLostFocusName}(this)" 
	// if (isdef(onLostFocus)) inp.onfocusout = ()=>onLostFocus(inp);
	inp.addEventListener('keyup', e => { if (e.key == 'Enter') inp.blur(); });

	return inp;

}
function mInput(dParent, type, label, styles){
	let d = mDiv(dParent);

	if (nundef(type)) type = "text";
	if (nundef(label)) label = "";

	let inp = createElementFromHTML(`<input type="${type}" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);
	if (isdef(styles)) mStyleX(inp);
	return inp;
}
















