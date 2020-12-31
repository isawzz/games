window.onload = start;

function checkGoal() {
	return target.div.innerHTML = 'JA';
}
function onDrop(o, target) {
	target.div.innerHTML = o.div.innerHTML;
	checkGoal();
}

function onDrop(target) {
	console.log('dropped on', target)
}

function start() {
	// let dRepo = mBy('dRepo');
	// //	mFlexWrap(dRepo);

	// //mClass(dRepo, 'dropzone');
	// //dRepo.onmouseover = onDragOver;

	// //console.log(dRepo);
	// let dTable = mBy('dTable');
	// //mFlexWrap(dTable)
	// console.log(dTable);

	// //console.log(range(20))
	// let objs = [];
	// for (const i of range(1)) {
	// 	let d = mDiv(dRepo);
	// 	d.id = 'o' + i;
	// 	d.innerHTML = d.id;
	// 	let o = { div: d, id: d.id };
	// 	mClass(d, 'draggable', 'block')
	// 	d.onmousedown = onDragStart; // e => { DDD = o; onDDStart(e); }
	// 	d.onmousemove = onDragMove;
	// 	d.onmouseout = e => { e.out = true; onDragEnd(e); }
	// 	d.onmouseup = onDragEnd; //e => { onDDEnd(e); onDrop(e.target); }
	// 	mStyleX(d, { w: 40, h: 40, bg: 'random', margin: 4 });
	// 	objs.push(o);
	// }
	// console.log(objs);
}





