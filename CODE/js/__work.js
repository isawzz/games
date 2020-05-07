
function completeUiTree(R){
	// rtree is complete by this time!!!!!!!
	let uiRoot = R.uiNodes[R.tree.uid];
	console.log('uiRoot is',uiRoot);
}

function mPanel(n, dParent, R) {
	//console.log('add panel', n.content);
	let ui = n.ui;
	// console.log('HALLO!!!!',nundef(ui)?ui:jsCopy(ui),isEmpty(ui));
	if (n.changing){
		//console.log('CHANGING!!!!!!!!!!!!!!!!!!!!!')
		clearIncludingAttr(ui);
		//clearElement(ui);
		delete n.changing;
	// }
	// if (isdef(ui) && ui!={} && !isEmpty(ui)) //isdef(ui)) 
	// { 
	// 	clearElement(ui);
	// 	//clearIncludingAttr(ui); 
	} else {
		//console.log('else....')
		ui = mDiv(dParent);
	}
	//if (isdef(ui)) {clearElement(ui);}else ui = mDiv(dParent);
	// 	clearElement(ui); 
	// 	removeAttributes(ui);
	// }else ui = mDiv(dParent);

	if (isdef(n.content)) {
		let d1 = mTextDiv(n.content, ui);
		//mStyle(d1,{padding:10});
	}

	//apply n.typParams!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// let params = decodeParams(n,{},R);
	// mStyle(ui,params);
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


