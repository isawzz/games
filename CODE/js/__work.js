function gPanel(n, gParent, R) {
	if (isdef(n.ui)) {
		// removeAllEvents(n.ui);
		// n.act = null;
		delete n.changing;
		return n.ui;
	}

	console.log('EIN NEUES G PANEL?????? ECHT?????')
	let ui = agG(gParent);
	n.uiType = 'g';
	return ui;
}
function gInfo(n, gParent, R) {
	let pf = n.params;
	let ui = gShape(pf.shape, pf.size, pf.size, pf.bg, pf.rounding);
	gParent.appendChild(ui);
	if (n.content) {
		let color = nundef(pf.fg) ? nundef(pf.bg) ? null : colorIdealText(pf.bg) : pf.fg;
		n.label = agText(ui, n.content, color, pf.font);
	}
	return ui;
}

function mPanel(n, dParent, R) {

	if (getTypeOf(dParent) == 'g') { return gPanel(n, dParent, R); }

	let ui = n.ui;
	if (n.changing && isdef(ui)) {
		// console.log(n)
		// n.act.deactivate();
		// n.act = null;
		clearIncludingAttr(ui);
		delete n.changing;
	} else {
		ui = mDiv(dParent);
	}

	//content
	if (isdef(n.content)) {
		let d1 = mTextDiv(n.content, ui);
	}

	//apply n.typParams!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// }
	// else if (n.uiType == 'g'){
	// 	//now dParent is a g element!

	// }

	return ui;
}


























class Engine {
	constructor() {
		this.examples = { a: 5, b: 0 };
		this.sDataExamples = ['a00', 'b00'];
		this.urls = [];
		let serverDataName = null;
		this.iTest = 0;
		for (const [k, v] of Object.entries(this.examples)) {
			let urlServerData = '/EXAMPLES/' + k + '00/serverData.yaml';
			for (let i = 0; i <= v; i++) {
				let fdName = k + '0' + i;
				let testInfo = {
					urlSpec: '/EXAMPLES/spec/' + fdName + '.yaml',
					urlServerData: urlServerData,
				}
				this.urls.push(testInfo);
			}
		}
		console.log(this.urls);
	}
	loadNextExample() {

	}
}


