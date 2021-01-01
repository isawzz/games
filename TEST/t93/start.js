window.onload = start;

function start() {
	console.log('start 94');

	test02();


	//test01();
}
var DragElem = null; //var DropZones=[];
function onMovingCloneAround(ev) {

	if (DragElem === null) return;

	let mx=ev.clientX;
	let my=ev.clientY;
  let dx=mx-DragElem.drag.offsetX;
	let dy=my-DragElem.drag.offsetY;
	mStyleX(DragElem,{left:dx,top:dy});
}
function onRelease(ev){
	let els = allElementsFromPoint(ev.clientX,ev.clientY);
	console.log('_________',els);
	let inputs = Array.from(mBy('dInputs').children);
	for(const inp of inputs){
		if (els.includes(inp)){
			console.log('yes, we are over',inp.id);
			inp.innerHTML = DragElem.innerHTML;

		}
	}
	//destroy clone
	DragElem.remove();
	DragElem = null;
	document.body.onmousemove = document.body.onmouseup = null;
}
function allElementsFromPoint(x, y) {
	var element, elements = [];
	var old_visibility = [];
	while (true) {
			element = document.elementFromPoint(x, y);
			if (!element || element === document.documentElement) {
					break;
			}
			elements.push(element);
			old_visibility.push(element.style.visibility);
			element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
	}
	for (var k = 0; k < elements.length; k++) {
			elements[k].style.visibility = old_visibility[k];
	}
	elements.reverse();
	return elements;
}
function onMouseDownOnLetter(ev) {
	ev.preventDefault();
	let id = evToClosestId(ev);
	console.log('mouse down on', id);
	let d = mBy(id);
	DragSource = d;

	//d wird gecloned
	var clone = DragElem = DragSource.cloneNode(true);

	//clone muss an body attached werden
	mAppend(document.body, clone);
	mClass(clone, 'letter')

	//der clone muss class 'dragelem' sein
	mClass(clone, 'dragelem');

	//der clone wird richtig plaziert
	mStyleX(clone, { left: ev.clientX - ev.offsetX, top: ev.clientY - ev.offsetY });

	clone.drag={offsetX:ev.offsetX,offsetY:ev.offsetY};
	// von jetzt an un solange DragElem != null ist muss der clone sich mit der maus mitbewegen
	document.body.onmousemove = onMovingCloneAround;
	document.body.onmouseup = onRelease;// ev=>console.log('mouse up')
	// wenn clone losgelassen wird, remove it 
	// if I am in dropzone for this clone, copy its innerHTML to dropzone
	// console.log('DropZones',jsCopy(DropZones.map(x=>x.id)));
	// for(const d of DropZones){

	// 	d.onmouseup = e=>{
	// 		console.log('releasing element',d.id)
	// 		OnReleasingClone(d);
	// 	};
	// }
}
function test02() {

	let letters = Array.from(mBy('dLetters').children);
	console.log('letters', letters);

	DropZones = Array.from(mBy('dInputs').children);

	for (const d of letters) {
		d.onmousedown = onMouseDownOnLetter;
	}


}
function test01() {
	let source = mBy('d1');
	mStyleX(source, { bg: 'pink', cursor: 'pointer', display: 'inline' })
	source.onmousedown = onDragElementMouseDown;
}
function test00() {
	let source = mBy('d1');
	var clone = DClone = source.cloneNode(true);
	// clone.classList.add("dragging");
	document.body.appendChild(clone);
	addInfoToClone(source);
}


