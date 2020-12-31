var DDD = null;
function onDDStart(ev) {
	DDD = ev.target;
	console.log('DDStart','target is',ev.target.id); 
	ev.preventDefault();
	var clone = ev.target.cloneNode(true);

	clone.classList.add("dragging");

	clone.onmousemove = onDDMove;


	document.body.appendChild(clone);
	let pos=clone.getBoundingClientRect();
	console.log('pos von getBoundingClientRect after appending to body',pos)
	// clone.style.left= pos.left;
	// clone.style.top = pos.top;


	// ev.target.parentNode.appendChild(clone);
	var style = getComputedStyle(clone);
	let x=(ev.pageX || (ev.clientX + document.body.scrollLeft)) - clone.offsetLeft + parseInt(style.marginLeft);
	let y = (ev.pageY || (ev.clientY + document.body.scrollTop)) - clone.offsetTop + parseInt(style.marginTop);
	clone.drag = {
		x: (ev.pageX || (ev.clientX + document.body.scrollLeft)) - clone.offsetLeft + parseInt(style.marginLeft),
		y: (ev.pageY || (ev.clientY + document.body.scrollTop)) - clone.offsetTop + parseInt(style.marginTop),
		source: ev.target
	};

	clone.drag = {x:x,y:y,pos:pos,source:ev.target};

	// clone.style.left=x;
	// clone.style.top = y;
	// console.log(clone.drag.x,clone.drag.y)
}

function onDDMove(ev) {
	if (!ev.target.drag) { return; }
	console.log('still moving clone!!!')
	ev.target.style.left = ((ev.pageX || (ev.clientX + document.body.scrollLeft)) - ev.target.drag.x) + "px";
	ev.target.style.top = ((ev.pageY || (ev.clientY + document.body.scrollTop)) - ev.target.drag.y) + "px";
}

function onDDEnd(ev) {
	if (!ev.target.drag) { return; }
	// Define persist true to let the source persist and drop the target, otherwise persist the target.
	var persist = true;
	if (persist || ev.out) {
		ev.target.parentNode.removeChild(ev.target);
	} else {
		ev.target.parentNode.removeChild(ev.target.drag.source);
	}
	ev.target.classList.remove("dragging");
	ev.target.drag = null;
}

function onDDOver(ev) { ev.preventDefault(); }