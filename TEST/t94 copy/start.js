window.onload = start;

function start() {
	console.log('start 94')
	let source = mBy('d1');

	var clone = DClone = source.cloneNode(true);
	// clone.classList.add("dragging");
	document.body.appendChild(clone);
	addInfoToClone(source);
}