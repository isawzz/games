//#region DOC
function genCollapsible(path, info) {
	let caption = stringAfterLast(path, '/');
	let classes = ['collapsible'];
	let dParent = mBy('menu');
	let b = mButton(caption, null, dParent, {}, classes);
	b.id = info.idLink;

	//let bView = mButton('view', e => showCollapsibleContent(e), b, { float: 'right' }, null);
	let bView = mPicButtonSimple('search', e => showCollapsibleContent(e), b,
	//  { float: 'right', margin: 0, 'background-color': 'dimgray' }, null);
	 { float: 'right', margin: 0 }, null);

	//let bView = mPicButton('search', e => showCollapsibleContent(e), b, { float: 'right', margin: 0 }, null);

	bView.addEventListener('mouseenter', ev => {
		let domel = ev.target;
		//domel.origColor = domel.style.backgroundColor;
		//domel.style.backgroundColor = 'red';
		domel.classList.remove('picButton');
		domel.classList.add('picButtonHover');
		console.log('==>classList',domel.classList);//,'\norig color',domel.origColor,domel);
		//mClass(domel,'picButtonHover');
		//ev.cancelBubble = true; 
		ev.stopPropagation = true; 
		//ev.defaultPrevented = true;
		//console.log('entering view button', '\nevent', ev, '\nbutton', this);
	});
	bView.addEventListener('mouseleave', ev => {
		let domel = ev.target;
		domel.classList.remove('picButtonHover')
		domel.classList.add('picButton');
		console.log('==>classList',domel.classList);
		// domel.style.backgroundColor = domel.origColor; //'violet';
		//ev.cancelBubble = true; 
		ev.stopPropagation = true; 
		//ev.defaultPrevented = true;
		// console.log('leaving view button', '\nevent', ev, '\nbutton', this);
	});

	//console.log('haaaaaaaaaaaaaaaaalo',b.style.padding)
	b.style.padding = '4px';

	return b;
}
//#endregion













