const LAYOUT={};
function recMeasureAbs(uid, R) {
	console.log('measureAbs', uid);
	let n = R.uiNodes[uid];

	if (isdef(n.children)) {
		for (const ch of n.children) {
			recMeasureAbs(ch, R);
		}
	}

	n.sizeMeasured = calcSizeMeasured(uid, R); //das ist mit getBounds, also ist size
	//console.log('measured:',n.sizeMeasured)
	n.sizeNeeded = arrangeAbs(uid, R);

	n.size = {
		w: Math.max(n.sizeMeasured.w, n.sizeNeeded.w),
		h: Math.max(n.sizeMeasured.h, n.sizeNeeded.h)
	}
	console.log('final size', n.uid, n.size);
	showSizes(n, R);
}
function arrangeAbs(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	console.log('arrangeAns', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	console.log('type is',n.type);
	return isdef(LAYOUT) && isdef(LAYOUT[n.type])? LAYOUT[n.type](n,R):absLayout(n,R);
}
function recPositionsAbs(uid, R) {
	let n = R.uiNodes[uid];
	if (!n.uidParent) {
		n.pos = {left:0,top:0};
		n.apos=jsCopy(n.pos);
		n.rpos=jsCopy(n.pos);
	} else {
		nParent = R.uiNodes[n.uidParent];
		n.apos = {
			left: nParent.apos.left + n.rpos.left,
			top: nParent.apos.top + n.rpos.top
		};
		n.pos = jsCopy(n.apos);
	}
	n.rcenter = {
		x: n.rpos.left + n.size.w / 2,
		y: n.rpos.top + n.size.h / 2
	};
	n.acenter = {
		x: n.apos.left + n.size.w / 2,
		y: n.apos.top + n.size.h / 2
	};
	if (nundef(n.children)) {
		console.log('no children',n.uid)
		return;
	}
	for(const uidChild of n.children){
		recPositionsAbs(uidChild,R);
	}
}


function absLayout(n,R){
	//arrange children of n and return size needed
	//is n resized here??? NO
	for(const ch of n.children){
		let n1 = R.uiNodes[ch];
		let b=getBounds(n1.ui);
		let m=n1.cssParams.margin;if (nundef(m)) m=0;
		let bottom = b.bottom+m;
		let right = b.right+m;
		console.log('BR',bottom,right);
		return {w: right,h:bottom};
	}
}












