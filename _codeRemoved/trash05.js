//#region june06
//#region orig absLayoutTests
const absLayoutTestsSolutions =
{
	"0": {
		"_1": {
			"w": 69,
			"h": 103
		},
		"_2": {
			"w": 19,
			"h": 19
		},
		"_3": {
			"w": 19,
			"h": 19
		},
		"_4": {
			"w": 23,
			"h": 82
		},
		"_5": {
			"w": 19,
			"h": 19
		},
		"_6": {
			"w": 19,
			"h": 19
		},
		"_7": {
			"w": 19,
			"h": 19
		}
	},
	"1": {
		"_8": {
			"w": 80,
			"h": 103
		},
		"_9": {
			"w": 19,
			"h": 19
		},
		"_10": {
			"w": 24,
			"h": 19
		},
		"_11": {
			"w": 28,
			"h": 82
		},
		"_12": {
			"w": 24,
			"h": 19
		},
		"_13": {
			"w": 24,
			"h": 19
		},
		"_14": {
			"w": 24,
			"h": 19
		}
	},
	"2": {
		"_15": {
			"w": 86,
			"h": 103
		},
		"_16": {
			"w": 24,
			"h": 19
		},
		"_17": {
			"w": 24,
			"h": 19
		},
		"_18": {
			"w": 82,
			"h": 40
		},
		"_19": {
			"w": 24,
			"h": 19
		},
		"_20": {
			"w": 24,
			"h": 19
		},
		"_21": {
			"w": 24,
			"h": 19
		}
	},
	"3": {
		"_22": {
			"w": 139,
			"h": 61
		},
		"_23": {
			"w": 24,
			"h": 19
		},
		"_24": {
			"w": 24,
			"h": 19
		},
		"_25": {
			"w": 82,
			"h": 40
		},
		"_26": {
			"w": 24,
			"h": 19
		},
		"_27": {
			"w": 24,
			"h": 19
		},
		"_28": {
			"w": 24,
			"h": 19
		}
	},
	"4": {
		"_29": {
			"w": 32,
			"h": 145
		},
		"_30": {
			"w": 24,
			"h": 19
		},
		"_31": {
			"w": 24,
			"h": 19
		},
		"_32": {
			"w": 28,
			"h": 82
		},
		"_33": {
			"w": 24,
			"h": 19
		},
		"_34": {
			"w": 24,
			"h": 19
		},
		"_35": {
			"w": 24,
			"h": 19
		}
	},
	"5": {
		"_36": {
			"w": 147,
			"h": 124
		},
		"_37": {
			"w": 24,
			"h": 19
		},
		"_38": {
			"w": 24,
			"h": 19
		},
		"_39": {
			"w": 143,
			"h": 61
		},
		"_40": {
			"w": 55,
			"h": 40
		},
		"_43": {
			"w": 24,
			"h": 19
		},
		"_44": {
			"w": 24,
			"h": 19
		},
		"_41": {
			"w": 24,
			"h": 19
		},
		"_42": {
			"w": 55,
			"h": 40
		},
		"_45": {
			"w": 24,
			"h": 19
		},
		"_46": {
			"w": 24,
			"h": 19
		}
	},
	"6": {
		"_47": {
			"w": 174,
			"h": 103
		},
		"_48": {
			"w": 24,
			"h": 19
		},
		"_49": {
			"w": 24,
			"h": 19
		},
		"_50": {
			"w": 116,
			"h": 82
		},
		"_51": {
			"w": 28,
			"h": 61
		},
		"_54": {
			"w": 24,
			"h": 19
		},
		"_55": {
			"w": 24,
			"h": 19
		},
		"_52": {
			"w": 24,
			"h": 19
		},
		"_53": {
			"w": 55,
			"h": 40
		},
		"_56": {
			"w": 24,
			"h": 19
		},
		"_57": {
			"w": 24,
			"h": 19
		}
	}
};
const absLayoutTests = {
	0: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_3': { fg: 'red', orientation: 'v' } } } },
	1: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_3': { orientation: 'v' } } } },
	2: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
	3: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } } },
	4: { func: makeTree33, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' }, '_3': { orientation: 'v' } } } },
	5: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
	6: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } } },
	7: { func: makeTree332x2, params: { rootContent: true, extralong: false, params: { '_6': { orientation: 'v' } } } },
};

var iAbsLayoutTest = 0;
function runAllAbsLayoutTests() {
	console.log('resetting AbsLayoutTests')
	iAbsLayoutTest = 0;
	startTestLoop();
	//testDict = {};

}
function isLastTest() {
	let numtests = Object.keys(absLayoutTests).length;
	//console.log('iAbsLayoutTest',iAbsLayoutTest,'numtests-1',numtests-1);
	return iAbsLayoutTest >= numtests - 1;
}
function startAbsTestLoop() {
	if (isLastTest()) {
		console.log('TESTS COMPLETED!');
	} else {
		nextAbsLayoutTest();
		if (!isLastTest()) setTimeout(startTestLoop, 1000);
	}
}
function nextAbsLayoutTest() {
	if (isLastTest()) {
		console.log('press next test again');
		return;
	}
	clearElement('table'); mBy('table').style.minWidth = 0; mBy('table').style.minHeight = 0;
	//console.log('halooooooooooooo')
	// console.log('iAbsLayoutTest',iAbsLayoutTest)
	// if (nundef(absLayoutTests[iAbsLayoutTest])){
	// 	console.log('sollte da nicht hinein!',iAbsLayoutTest);
	// 	iAbsLayoutTest+=1;
	// 	return;
	// }
	let { func, params } = absLayoutTests[iAbsLayoutTest];
	//console.log('test', iAbsLayoutTest, func, params);
	let root = makeTableTreeX(func, params);
	recMeasureAbs(R.tree.uid, R);
	updateOutput(R);
	adjustTableSize(R);
	let sols = {};
	recCollectSolutions(R.uiNodes[R.tree.uid], R, sols);
	//console.log('solutions to test', iAbsLayoutTest, sols);
	let changes = propDiffSimple(sols, absLayoutTestsSolutions[iAbsLayoutTest]);
	if (changes.hasChanged) {
		console.log('verifying test case', iAbsLayoutTest, 'FAIL!!!!!!!');
		//console.log('FAIL!!! ' + this.index, '\nis:', rTreeNow, '\nshould be:', rTreeSolution);
		console.log('changes:', changes)
	} else {
		console.log('verifying test case', iAbsLayoutTest, 'correct!');
		// console.log('*** correct! ', this.index, '***', rTreeNow)
	}

	testDict[iAbsLayoutTest] = sols;
	let len = Object.keys(absLayoutTests).length;
	iAbsLayoutTest += 1;// (iAbsLayoutTest + 1) % len;
	//console.log('iAbsLayoutTest incremented to',iAbsLayoutTest)
	if (isLastTest()) {
		console.log('last test in series! NOW should download solutions!');
		downloadFile(testDict, 'testDict');
	}
}
function testAbsolutePositioning() {

	//let root=makeTableTreeX(makeSimplestTree);
	//let root=makeTableTreeX(makeSimplestTree,{rootContent:false});
	//let root = makeTableTreeX(makeSimpleTree);
	//let root = makeTableTreeX(makeSimpleTree,{ rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeSimpleTree,{rootContent:false});
	// let root = makeTableTreeX(makeTree33,{rootContent:false});
	//let root = makeTableTreeX(makeTree332x2);
	//let root = makeTableTreeX(makeTree332x2,{rootContent:false});
	//let root = makeTableTreeX(()=>makeSimpleTree(20),{rootContent:false});
	//let root = makeTableTreeX(makeSimplestTree,{rootContent:true,extralong:true});
	//let root = makeTableTreeX(makeTree33,{rootContent:true,extralong:true});
	//let root = makeTableTreeX(()=>makeSimpleTree(3),{rootContent:true,extralong:true});
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } });
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: { '_2': { orientation: 'v' } } });
	// let root = makeTableTreeX(makeTree33, {
	// 	rootContent: true, extralong: false, params: {
	// 		'_1': { bg: 'black', orientation: 'v' },
	// 		'_4': { bg: 'inherit', orientation: 'v' }
	// 	}
	// });

	//mixed!
	//let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: true, params: { '_1': { orientation: 'v' } } });
	let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: true, params: { '_3': { orientation: 'v' } } });

	recMeasureAbs(R.tree.uid, R);

	updateOutput(R);

	adjustTableSize(R);
}
//#endregion obsolete

//#region june05
function horizontalSizeToContentCentered(uid, r) {

	console.log('horizontalSizeToContent');
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain='w';//!!!
	let ax2='h';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = axMainSum;//!!!

	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	
	for (const n1 of children) {
		y = y0 + (ax2Max - n1.size[ax2]) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
	let hParent = y0 + ax2Max + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}


function sizeToContentCentered(uid, r) {

	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//params that influence this layout
	let or = n.params.orientation;
	let centered = n.params.baseline == 'center';// n.params.sizing == 'sizeToContent';

	console.log('or', uid, 'is', or);

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	console.log('wTitle', wTitle, 'y0', y0);
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain, ax2;
	if (or == 'v') {
		axMain = 'h';//!!!
		ax2 = 'w';//!!!
	} else {
		axMain = 'w';//!!!
		ax2 = 'h';//!!!

	}
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	// let ax2Max = Math.max(...children.map(x => x.size.w));
	// let axMainSum = children.reduce((a, b) => a + (b.size.h || 0), 0);
	// axMainSum += childMargin * (children.length - 1);

	//***********HERE */
	//immer noch xoffset berechnen, nur statt sumChidrenWidth hab jetzt maxChildWidth

	// let xoff = 0;
	// if (wTitle > ax2Max) xoff = (wTitle - ax2Max) / 2;
	// let x0 = parentPadding + xoff;
	// let x = x0;
	// let y = y0;


	let wmax = (or == 'v' ? ax2Max : axMainSum);//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('x', x, 'y', y)
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {

		if (or == 'v') {
			x = x0 + centered? (ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + centered?(ax2Max - n1.size[ax2]) / 2:0;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	console.log('wTitle', wTitle, 'x', x, 'y', y)

	let wParent, hParent;
	if (or == 'v') {
		wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);
		hParent = y + parentPadding;
	} else {
		wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
		hParent = y0 + ax2Max + parentPadding;
	}
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}
//#region abs layout variants
function arrangeAbs(uid, R) {
	
	let n = R.uiNodes[uid];	//n is the parent
	if (n.params.orientation == 'v') return verticalSizeToContentCentered(uid, R);
	else return horizontalSizeToContentCentered(uid, R);

}
function horizontalSizeToContentCentered(uid, r) {
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	
	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain='w';//!!!
	let ax2='h';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	let wmax = axMainSum;//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wTitle, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	
	for (const n1 of children) {
		y = y0 + (ax2Max - n1.size[ax2]) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wTitle + parentPadding * 2, x + parentPadding);
	let hParent = y0 + ax2Max + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}
function verticalSizeToContentCentered(uid, r) {
	let n = R.uiNodes[uid];	//n is the parent
	if (nundef(n.children)) return { w: 0, h: 0 }
	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	//berechne wTitle und y0
	let y0 = 0;
	let wTitle = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wTitle = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wTitle += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;

	//have wTitle and y0 right unter title!
	let children = n.children.map(x => R.uiNodes[x]);

	let axMain = 'h';//!!!
	let ax2 = 'w';//!!!
	let ax2Max = Math.max(...children.map(x => x.size[ax2]));
	let axMainSum = children.reduce((a, b) => a + (b.size[axMain] || 0), 0);
	axMainSum += childMargin * (children.length - 1);

	// let ax2Max = Math.max(...children.map(x => x.size.w));
	// let axMainSum = children.reduce((a, b) => a + (b.size.h || 0), 0);
	// axMainSum += childMargin * (children.length - 1);

	//***********HERE */
	//immer noch xoffset berechnen, nur statt sumChidrenWidth hab jetzt maxChildWidth

	// let xoff = 0;
	// if (wTitle > ax2Max) xoff = (wTitle - ax2Max) / 2;
	// let x0 = parentPadding + xoff;
	// let x = x0;
	// let y = y0;

	let wmax = ax2Max;//!!!
	let xoff = 0;
	if (wTitle > wmax) xoff = (wTitle - wmax) / 2;
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wTitle', wTitle, 'maxChildWidth', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];

	for (const n1 of children) {

		if (axMain == 'h') {
			x = x0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			y += n1.size[axMain];
			if (n1 != lastChild) y += childMargin;
		} else {
			y = y0 + (ax2Max - n1.size[ax2]) / 2;
			n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
			x += n1.size.w;
			if (n1 != lastChild) x += childMargin;
		}

		n1.ui.style.left = n1.pos.x + 'px';
		n1.ui.style.top = n1.pos.y + 'px';

	}
	let wParent = Math.max(wTitle + parentPadding * 2, ax2Max + 2 * x0);

	let hParent = y + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };

}

function recPositionsAbs(uid, R) {
	let n = R.uiNodes[uid];
	if (!n.uidParent) {
		n.pos = { left: 0, top: 0 };
		n.apos = jsCopy(n.pos);
		n.rpos = jsCopy(n.pos);
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
		//console.log('no children', n.uid)
		return;
	}
	for (const uidChild of n.children) {
		recPositionsAbs(uidChild, R);
	}
}


function absLayout(n, R) {
	//arrange children of n and return size needed
	//is n resized here??? NO
	let b = getBounds(n.ui);

	let maxBottom = 0;
	let maxRight = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		let b1 = getBounds(n1.ui);
		//console.log(b1)
		n1.rpos = { left: b1.left - b.left, top: b1.top - b.top };
		n1.apos = { left: b1.left, top: b1.top };
		let m = n1.cssParams.margin; if (nundef(m)) m = 0;
		let bottom = b1.bottom + m - b.top;
		let right = b1.right + m - b.left;
		if (bottom > maxBottom) maxBottom = bottom;
		if (right > maxRight) maxRight = right;
		//console.log('BR', bottom, right);
	}
	return { w: maxRight, h: maxBottom };
}



function mixedOr2() {
	let params = {
		'_1': { bg: 'black', orientation: 'v' },
		'_4': { bg: 'inherit', orientation: 'v' }
	};
	let root = makeTableTreeX(makeTree33, { rootContent: true, extralong: false, params: params });
	return root;
}
function mixedOrientation() {
	let root = makeTableTreeX(makeTree33, {
		rootContent: true, extralong: false,
		params: {
			'_1': { bg: 'black', orientation: 'v' },
			'_4': { bg: 'inherit', orientation: 'v' }
		}
	});
	//_1 soll type v bekommen!
	root.params.orientation = 'v';
	return root;
}


function makeTableTree(fStruct, rootContent = true, extralong = false) {
	R = fStruct();
	if (!rootContent) delete R.tree.content; else if (extralong) R.tree.content = 'hallo das ist ein besonders langer string!!!';
	let d = mBy('table');
	d.style.position = 'relative';
	R.baseArea = 'table';
	recUiTest(R.tree, R);
	let root = R.root = R.uiNodes[R.tree.uid];
	//root.ui.position='relative';
	return root;
}

function arrangeAbsHorizontalFinal(uid, R) {

	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

function simplestContent() { return makeTableTree(makeSimplestTree); }
function simplestNoContent() { return makeTableTree(makeSimplestTree, false); }
function simple2Content() { return makeTableTree(makeSimpleTree); }
function simple2NoContent() { return makeTableTree(makeSimpleTree, false); }
function arrangeAbs_final(uid, R) {
	let n = R.uiNodes[uid];	//n is the parent

	if (nundef(n.children)) return { w: 0, h: 0 }

	parentPadding = isdef(n.params.paddingAroundChildren) ? n.params.paddingAroundChildren : PADDING;
	childMargin = isdef(n.params.gapBetweenChildren) ? n.params.gapBetweenChildren : GAP;

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		let b = getBounds(cont, true);
		wmin = b.width;// + 2 * parentPadding;
		if (isdef(n.params.padding)) wmin += 2 * n.params.padding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	let wmax = children.reduce((a, b) => a + (b.size.w || 0), 0);
	wmax += childMargin * (children.length - 1);
	let xoff = 0;
	if (wmin > wmax) xoff = (wmin - wmax) / 2;
	//console.log('hmax',hmax,'wmax',wmax);
	let x0 = parentPadding + xoff;
	let x = x0;
	let y = y0;
	console.log('wmin', wmin, 'wmax', wmax, 'parentPadding', parentPadding, 'childMargin', childMargin, '= x0', x0);
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';
		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
	}
	let wParent = Math.max(wmin + parentPadding * 2, x + parentPadding);

	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_0(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];

	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * GAP;
		y0 = GAP + b.top + b.height + GAP;
	} else y0 = GAP;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = GAP;
	let x = x0;
	let y = y0;
	let hmax = 0;
	for (const uid of n.children) {
		let n1 = R.uiNodes[uid];
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w + GAP;
		//y bleibt gleich!
		if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + 2 * PADDING;
	let hParent = y0 + hmax + 2 * GAP + PADDING;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}
function arrangeAbs_1(uid, R) {
	//das macht mehr oder weniger was adjustLayout gemacht hat!!!
	//console.log('arrangeAbs', uid)
	let n = R.uiNodes[uid];
	//n is the parent
	//let parentMargin = isdef(n.margin)?n.margin:PARENT_MARGIN;
	let parentPadding = PADDING;// 
	//parentPadding = isdef(n.params.padding)?n.params.padding:PADDING;
	let childMargin = GAP;//CHILD_MARGIN;


	if (nundef(n.children)) return { w: 0, h: 0 }

	// *******************************************************
	//1. horizontal,sizeToContent,default abstand,yCentered
	//1a.parent has content
	//sizeToContent bedeutet parent size is changed anyway!
	//for now use a fixed margin and padding of 2 each! and do NOT bother with margin and padding!!!
	//if parent has a content,need to measure that too!
	//how to find parent content width? measureText in parent font

	let y0 = 0;
	let wmin = 0;
	console.log('wmin', wmin)

	if (isdef(n.content)) {
		let uiParent = n.ui;
		let cont = uiParent.firstChild;
		//console.log('first child of parent is', cont);
		let b = getBounds(cont, true);
		//console.log('size of first child is', b.width, b.height);
		//console.log('bounds', b)
		wmin = b.width + 2 * parentPadding;
		y0 = parentPadding + b.top + b.height + parentPadding;
	} else y0 = parentPadding;
	//how to find parent y=0 (below its content)? look where first child has been placed naturally
	let x0 = parentPadding;
	let x = x0;
	let y = y0;
	let children = n.children.map(x => R.uiNodes[x]);
	let hmax = Math.max(...children.map(x => x.size.h));
	//console.log('hmax is',children,hmax);
	//let hmax = 0;
	let lastChild = R.uiNodes[n.children[n.children.length - 1]];
	for (const n1 of children) {
		//let n1 = R.uiNodes[uid];

		//if (n1.params.margin) childMargin = n1.params.margin;
		//console.log('childMargin',childMargin);

		y = y0 + (hmax - n1.size.h) / 2;
		n1.pos = { x: x, y: y, cx: x + n1.size.w / 2, cy: y + n1.size.h / 2 };
		let ui = n1.ui;
		ui.style.left = n1.pos.x + 'px';
		ui.style.top = n1.pos.y + 'px';

		x += n1.size.w;
		if (n1 != lastChild) x += childMargin;
		//y bleibt gleich!
		//if (n1.size.h > hmax) hmax = n1.size.h
	}
	let wParent = Math.max(wmin, x) + parentPadding;
	let hParent = y0 + hmax + parentPadding;
	//console.log('parent size should be', wParent, hParent);
	return { w: wParent, h: hParent };





	// console.log('type is', n.type);
	// return isdef(LAYOUT) && isdef(LAYOUT[n.type]) ? LAYOUT[n.type](n, R) : absLayout(n, R);
}

//#region june01
function transformParentsToBags(parents, R) {
	let parentPanels = [];
	for (const p of parents) {
		let nParent = R.uiNodes[p];
		let uidNewParent = p;
		// if parent has no child at all, make invisible container and use that for loc node
		if (isEmpty(nParent.children)) {
			console.log('parent', p, 'does NOT have any child!');

			//create an invisible node 
			let nPanel = addInvisiblePanel(p, R);
			uidNewParent = nPanel.uid;
			//also need to create uiNode for this panel!

			console.log(nParent);
			//parentPanels.push(nPanel.uid);
		}

		parentPanels.push(uidNewParent);
		//if this parent already has a child that is a container,
		//dann kann ich diesen container als echten parent nehmen

		//sonst mache einen container

		//was wenn parent genau 1 child hat aber das ist NICHT ein container?
		//dann mache ein weiteres child das ein container ist


	}
	console.log('parentPanels', parentPanels)
	return parentPanels;

}
function addInvisiblePanel(uidParent, R) {
	let uid = getUID();
	let n = { uid: uid, uidParent: uidParent, type: 'invisible' };
	R.rNodes[uid] = n;
	let rParent = R.rNodes[uidParent];
	if (nundef(rParent.children)) rParent.children = [];
	rParent.children.push(uid);
	recUi(n, uidParent, R);
	return n;
}

















