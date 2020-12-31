window.onload = start;

function start() {
	console.log('start 94');

	test02();


	//test01();
}
var DragSource = null; var DragElem = null;
function onMovingCloneAround(ev) {

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

	// von jetzt an un solange DragElem != null ist muss der clone sich mit der maus mitbewegen
	document.body.onmousemove = onMovingCloneAround;

	//der clone bekommt ein 
}
function test02() {

	let letters = Array.from(mBy('dLetters').children);
	console.log('letters', letters);
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


