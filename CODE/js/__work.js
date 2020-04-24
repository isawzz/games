function layoutHand(n){
	if (isdef(n.params.overlap) && n.children.length > 1){
		let cards = n.children.map(x=>x.ui);
		let clast = last(cards);
		//console.log('card',clast);
		let b=getBounds(clast);
		//console.log('bounds',b);
		let wIs = b.width;
		let overlap = firstNumber(n.params.overlap);
		let sOverlap = ''+overlap;
		let unit=stringAfter(n.params.overlap,sOverlap);
		//console.log('num',overlap,'unit',unit)
		let wSoll = 0;
		if (unit == '%'){
			overlap /= 100;
			wSoll = wIs - wIs*overlap;
			
		}else{ wSoll = wIs - overlap;}
		//console.log('wSoll ...', wSoll);
		let wTotal = wIs + wSoll * (cards.length-1);
		n.ui.style.maxWidth = '' + (wTotal+2) + 'px';
	}
}

function pictoDiv(key, color, w, h) { let d = mPic(key); mColor(d, color); mSizePic(d, w, h); return d; }

function picDiv(size) { return o=>pictoDiv(o.key, o.color, size, size); }

function makePictoPiece(mk, o, sz, color) {

	//console.log('unit',unit,'percent',percent,'sz',sz);
	let [w, h] = [sz, sz];

	let sym = o.obj_type;
	if (sym in SPEC.symbol) { sym = SPEC.symbol[sym]; }
	if (!(sym in iconChars)) {
		//console.log("didn't find key", sym);
		symNew = Object.keys(iconChars)[randomNumber(5, 120)]; //abstract symbols
		//console.log('will rep', sym, 'by', symNew)
		SPEC.symbol[sym] = symNew;
		sym = symNew;
	}
	//console.log(iconChars,sym,iconChars[sym])
	mk.ellipse({ w: w, h: h, fill: color, alpha: .3 });
	let pictoColor = color == 'black' ? randomColor() : color;
	mk.pictoImage(sym, pictoColor, sz * 2 / 3); //colorDarker(color),sz*2/3);
}












var R = null;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root unless is single(!) panel
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes (_id & _ref) disappear?
	//console.log(jsCopy(R.lastSpec));
	
	R.gen14(); // merges type nodes into spec nodes =>spec type names disappear!
	//also: DParams added to each node (except grid type!), params merged w/ defs!s

	R.gen15();



	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	//console.log('detectBoardParams1 has been called', countDetectBoardParamsCalls,'times!!!!!')


	//R.gen30(); //NOT IMPLEMENTED!!!

	presentGeneration(R.lastSpec,'results')
	//presentRoot(R.lastSpec.ROOT, 'results');

}

function detectType(n,defType){
	for(const [k,v] of Object.entries(RCONTAINERPROP)){
		if (isdef(n[v])) return k; //n.type = k;
	}
	if (n.data) return 'info';
	return null;
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


