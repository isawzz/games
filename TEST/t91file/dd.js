var counter = 0;

function genMouseDown(ev){
//	console.log('===>genMouseDown',ev.target,ev.offsetX,ev.offsetY,ev.clientX,ev.clientY,ev)
}

function onDragElementMouseDown(ev){
	//assumes element is simple (no children unless pointer-events:none)
	let source = ev.target;
	console.log(ev)

// 	var clone = DClone = source.cloneNode(true);
// 	document.body.appendChild(clone);

// 	// let offsetX=ev.clientX;
// 	// let offsetY=ev.clientY;
// 	clone.offset={x:ev.offsetX,y:ev.offsetY};

// 	let x=ev.x-ev.offsetX;
// 	let y=ev.y-ev.offsetY;
// 	console.log(ev.x,ev.y, ';',ev.clientX,ev.clientY,';',ev.offsetX,ev.offsetY,';',x,y,source.id)

// 	let b = getBounds(source, false, document.body);
// //	console.log(b);

// 	mStyleX(DClone, { position: 'fixed', left: x, top: y, bg: 'red', border: '1px solid black' })
// 	// DClone.style.left = b.left+'px';
// 	// DClone.style.top = b.top+'px';



// 	document.body.onmouseup = onMouseUpBody;

// 	document.body.onmousemove = onMouseMoveBody;

}

function onMouseUpBody(ev) {
	//console.log('clone up!');
	if (DClone != null) {
		//console.log('hallo');
		let x = ev.clientX;
		let y = ev.clientY;
		mStyleX(DClone, { left: x, top: y });
		DClone = null;
	}
}
function onMouseMoveBody(ev) {
	//console.log('mouse move on body! '+counter,ev);counter+=1;
	if (DClone != null) {
		//console.log('hallo');
		let x = ev.clientX;
		let y = ev.clientY;
		mStyleX(DClone, { left: x, top: y });
	}
}
function addInfoToClone(source) {

//	console.log(source);

	let b = getBounds(source, false, document.body);
//	console.log(b);

	mStyleX(DClone, { position: 'fixed', left: b.left, top: b.top, bg: 'red', border: '1px solid black' })
	// DClone.style.left = b.left+'px';
	// DClone.style.top = b.top+'px';



	document.body.onmouseup = onMouseUpBody;

	document.body.onmousemove = onMouseMoveBody;
	//console.log(DClone);


}