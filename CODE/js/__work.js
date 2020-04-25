

function generalGrid(n, area, R) {

	console.log('board',n)
	let bpa = n.params = detectBoardParams(n, R);
	//bpa sind jetzt die params incl defs fuer board itself
	//n.bi.params ={fields:params_fuer_fields, ...}

//	console.log('board params:', n.params);

	n.children = [];
	createUi(n,area,R);
	//console.log('board ist:',n)
	//n.ui ... need to do that hiere!!!!!!!

	for (const name of ['fields', 'edges', 'corners']) {
		let bMemberParams = n.bi.params[name];
		let group = n.bi[name];
		for (const oid in group) {
			let n1 = group[oid];
			n1.params = jsCopy(bMemberParams);



			n1 = mergeInBasicSpecNodesForOid(oid,n1,R);

			//if n1 does not have a type it will NOT BE PRESENTED!!!!!!!
			if (nundef(n1.type)) continue;

			n1.uiType = 'g';
			n1.content = calcContent(n1.o, n1.data);
			
			//if (n1.type == 'info') { createLabel(n1, R); }

			//console.log('vor createUI von',n1.oid,n1,n.ui);
			createUi(n1,n.uid,R);// *************************** HIER !!!!!!!!!!!!!!!!!!!!!!

			n.children.push(n1); //n.bi[name][oid] = n1;
		}
	}

	// *** stage 4: layout! means append & positioning = transforms... ***
	let boardInfo = n.bi.board.info;
	let fSpacing = bpa.field_spacing;// = bpa.fields.size+bpa.gap;
	if (nundef(fSpacing)) fSpacing = 60;
	let margin = bpa.margin;
	if (nundef(margin)) margin = 8;
	let [fw, fh] = [fSpacing / boardInfo.wdef, fSpacing / boardInfo.hdef];

	let cornerSize = isEmpty(n.bi.corners) ? 0 : isdef(bpa.corners) ? bpa.corners.size : 15;
	// console.log('cornerSize',cornerSize)

	let [wBoard, hBoard] = [fw * boardInfo.w + cornerSize, fh * boardInfo.h + cornerSize];
	let [wTotal, hTotal] = [wBoard + 2 * margin, hBoard + 2 * margin];

	//console.log(wBoard,hBoard)

	let boardDiv = n.bi.boardDiv;
	let boardG = n.ui;
	mStyle(boardDiv, { 'min-width': wTotal, 'min-height': hTotal, 'border-radius': margin, margin: 'auto 4px' });
	boardG.style.transform = "translate(50%, 50%)"; //geht das schon vor append???

	for(const f of n.children){
		let uiChild = f.ui;
		//console.log(uiChild);
		boardG.appendChild(uiChild);
		if (f.params.shape == 'line') agLine(f.ui, f.info.x1 * fw, f.info.y1 * fw, f.info.x2 * fw, f.info.y2 * fw);
		else gPos(f.ui, fw * f.info.x, fh * f.info.y);
	}
}



















function layoutHand(n) {
	if (isdef(n.params.overlap) && n.children.length > 1) {
		let cards = n.children.map(x => x.ui);
		let clast = last(cards);
		//console.log('card',clast);
		let b = getBounds(clast);
		//console.log('bounds',b);
		let wIs = b.width;
		let overlap = firstNumber(n.params.overlap);
		let sOverlap = '' + overlap;
		let unit = stringAfter(n.params.overlap, sOverlap);
		//console.log('num',overlap,'unit',unit)
		let wSoll = 0;
		if (unit == '%') {
			overlap /= 100;
			wSoll = wIs - wIs * overlap;

		} else { wSoll = wIs - overlap; }
		//console.log('wSoll ...', wSoll);
		let wTotal = wIs + wSoll * (cards.length - 1);
		n.ui.style.maxWidth = '' + (wTotal + 2) + 'px';
	}
}

function pictoDiv(key, color, w, h) { let d = mPic(key); mColor(d, color); mSizePic(d, w, h); return d; }

function picDiv(size) { return o => pictoDiv(o.key, o.color, size, size); }

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
var phase = 0;
function run03(sp, defaults, sdata) {

	R = new RSG(sp, defaults, sdata);

	phase = 1013;
	R.gen10(); //addSourcesAndPools, need cond to add _rsg to objects!
	//console.log(R.lastSpec.ROOT);

	R.gen11(); // add top level panel to root unless is single(!) panel
	R.gen12(); // creates places & refs and adds a specKey prop to each spec Node
	R.gen13(); // merges _ref nodes into _id nodes (_id & _ref) disappear?
	//console.log(jsCopy(R.lastSpec));
	
	phase = 14;
	R.gen14(); // merges type nodes into spec nodes =>spec type names disappear!
	//NO, REVERTED!!! also: DParams added to each node (except grid type!), params merged w/ defs!s

	//gen15 GEHT SO NICHT!!!!!!!!!!!!!!!!!!!!!
	// phase = 15;
	// //ne, das ist alles mist!!!!!!!!!!!! kann nicht einfach mergen!!!!
	// R.gen15();
	// console.log(R.oidNodes)

	phase = 20;
	R.gen20('table'); // expands root, creates 1 node for each ui and uis

	//console.log('detectBoardParams1 has been called', countDetectBoardParamsCalls,'times!!!!!')


	//R.gen30(); //NOT IMPLEMENTED!!!

	presentGeneration(R.lastSpec, 'results')
	//presentRoot(R.lastSpec.ROOT, 'results');

}

function detectType(n, defType) {
	for (const [k, v] of Object.entries(RCONTAINERPROP)) {
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


