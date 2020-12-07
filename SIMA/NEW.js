
function defaultOnFocusEditableText(inp) {
	inp.style.backgroundColor = 'white';
}
function defaultOnLostFocusEditableText(inp) {
	//console.log('lost focus!!!')
	inp.style.backgroundColor = 'transparent';
}
function mEditableInput_dep(dParent, { type, label, onFocus, onLostFocus, val, styles, classes } = {}) {
	let inp = mInput(dParent, type, label, styles);

	//console.log(inp)

	if (nundef(onFocus)) onFocus = defaultOnFocusEditableText;
	if (nundef(onLostFocus)) onLostFocus = defaultOnLostFocusEditableText;

	let defStyles = { maleft: 12, mabottom: 4 };
	styles = nundef(styles) ? defStyles : deepmergeOverride(defStyles, styles);
	mStyleX(inp, styles);

	// mClass(inp, 'input', ...classes);
	mClass(inp, 'editableText');
	//inp.value = 'hallo'

	inp.addEventListener('focus', ev => onFocus(ev.target));
	inp.addEventListener('focusout', ev => onLostFocus(ev.target));
	// if (isdef(onFocus)) inp.onfocus = ()=>onFocus(inp);//"${onFocusName}(this)" onfocusout="${onLostFocusName}(this)" 
	// if (isdef(onLostFocus)) inp.onfocusout = ()=>onLostFocus(inp);
	inp.addEventListener('keyup', e => { if (e.key == 'Enter') inp.blur(); });
	if (isdef(val)) inp.value = val;

	return inp;

}
function mEditableInput(dParent, val) {

	let elem = createElementFromHTML(`<span contenteditable="true" spellcheck="false">${val}</span>	`)
	elem.addEventListener('keydown', (ev) => {
		if (ev.key === 'Enter') {
			ev.preventDefault();
			mBy('dummy').focus();
		}
	});
	mAppend(dParent, elem);
	return elem;
	//<div contenteditable = "true" class = "fluidInput" data-placeholder = ""></div>
	let inp = mDiv(dParent, styles);

	inp.contenteditable = true;
	inp['data-placeholder'] = '';
	if (isdef(val)) inp.innerHTML = val;

	return inp;

	//console.log(inp)

	if (nundef(onFocus)) onFocus = defaultOnFocusEditableText;
	if (nundef(onLostFocus)) onLostFocus = defaultOnLostFocusEditableText;

	let defStyles = { maleft: 12, mabottom: 4 };
	styles = nundef(styles) ? defStyles : deepmergeOverride(defStyles, styles);
	mStyleX(inp, styles);

	// mClass(inp, 'input', ...classes);
	mClass(inp, 'editableText');
	//inp.value = 'hallo'

	inp.addEventListener('focus', ev => onFocus(ev.target));
	inp.addEventListener('focusout', ev => onLostFocus(ev.target));
	// if (isdef(onFocus)) inp.onfocus = ()=>onFocus(inp);//"${onFocusName}(this)" onfocusout="${onLostFocusName}(this)" 
	// if (isdef(onLostFocus)) inp.onfocusout = ()=>onLostFocus(inp);
	inp.addEventListener('keyup', e => { if (e.key == 'Enter') inp.blur(); });
	if (isdef(val)) inp.value = val;

	return inp;

}
function mInput(dParent, type, label, styles) {
	let d = mDiv(dParent);

	if (nundef(type)) type = "text";
	if (nundef(label)) label = "";

	let inp = createElementFromHTML(`<input type="${type}" />`);
	let labelui = createElementFromHTML(`<label>${label}</label>`);
	mAppend(d, labelui);
	mAppend(labelui, inp);
	if (isdef(styles)) mStyleX(inp, styles);

	inp.addEventListener('input', resizeInput);
	//resizeInput.call(inp);
	return inp;
}
function resizeInput() { this.style.minWidth = this.value.length + "ch"; }















