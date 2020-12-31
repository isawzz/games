window.onload = start;

function start() {
	console.log('start 94');
	
	//test01();
}
function test01(){
	let source = mBy('d1');
	mStyleX(source,{bg:'pink',cursor:'pointer',display:'inline'})
	source.onmousedown = onDragElementMouseDown;
}
function test00(){
	let source = mBy('d1');
	var clone = DClone = source.cloneNode(true);
	// clone.classList.add("dragging");
	document.body.appendChild(clone);
	addInfoToClone(source);
}


