//#region server data change!
var TV={};
function testAddObject(R) {

	let oid = getUID('o');
	let o = { obj_type: 'card' };
	o.short_name = chooseRandom(['K', 'Q', 'J', 'A', 2, 3, 4, 5, 6, 7, 8]);
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addNewServerObjectToRsg(oid, o, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	//console.log(R.instantiable)
	updateOutput(R);
}
function testRemoveObject(R) {
	//hier mache policy not to remove board members!!!
	//lock in objects that are not independent! these are objects
	let data = dict2list(sData);
	//data = data.filter(x=>(isdef(x.map) || nundef(x.fields)) && nundef(x.neighbors));
	data = data.filter(x=>(nundef(x.fields)) && nundef(x.neighbors)); //board weg!
	if (isEmpty(data)) {
		console.log('no objects left in sData!!!');
		return;
	}
	let oid = chooseRandom(data).id;

	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	console.log('removed oid',oid);
	updateOutput(R);
}
function testAddLocObject(R) {
	let oid = getUID('o');
	let o = { name: 'felix' + oid, loc: 'p1' };
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	addNewServerObjectToRsg(oid, o, R);
	updateOutput(R);
}
function testAddBoard(R) {
	let oid = TV.boardOid; //detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	let o=TV.oBoard;
	console.log('boardOid is',oid);
	if (R.getO(oid)) {
		console.log('please click remove board first!');
		return;
	}
	// let o =
	// {
	// 	fields:
	// 	{
	// 		_set: [
	// 			{ _obj: '0' },
	// 			{ _obj: '1' },
	// 			{ _obj: '2' },
	// 			{ _obj: '3' },
	// 			{ _obj: '4' },
	// 			{ _obj: '5' },
	// 			{ _obj: '6' },
	// 			{ _obj: '7' },
	// 			{ _obj: '8' }]
	// 	},
	// 	rows: 3,
	// 	cols: 3,
	// 	obj_type: 'Board',
	// 	map: 'hallo',
	// };
	if (!serverData.table) serverData.table = {};
	serverData.table[oid] = o;
	sData[oid] = jsCopy(o);
	//console.log('adding a new object', oid);
	addNewServerObjectToRsg(oid, o, R);

	recAdjustDirtyContainers(R.tree.uid, R, true);

	updateOutput(R);
}
function testRemoveBoard(R) {

	let activate = R.isUiActive;
	if (activate) deactivateUis(R);

	let oid = detectFirstBoardObject(R); //chooseRandomDictKey(sData);
	console.log('testRemoveBoard: first board object detected has oid',oid);

	if (isdef(oid)) {TV.boardOid = oid;TV.oBoard=R.getO(oid);}
	if (!oid) {
		console.log('no objects left in sData!!!');
		return;
	}
	delete sData[oid];
	//also have to remove all the children!
	completelyRemoveServerObjectFromRsg(oid, R);
	//console.log('removed oid',oid);
	updateOutput(R);
	if (activate) activateUis(R);
}


//#region activate, deactivate
function testActivate(R) {
	activateUis(R);

}
function testDeactivate(R) {
	deactivateUis(R);

}
//#endregion

//#region helper function tests
function testLookupRemoveFromList() {
	//usage: lookupRemoveFromList({a:{b:[2]}}, [a,b], 2) => {a:{b:[]}} OR {a:{}} (wenn deleteIfEmpty==true)
	let d = { a: { b: [2] } };
	let res = lookupRemoveFromList(d, ['a', 'b'], 2);
	console.log('res', res, 'd', d);
	d = { a: { b: [2] } };
	res = lookupRemoveFromList(d, ['a', 'b'], 2, true);
	console.log('res', res, 'd', d);

	//usage: lookupRemoveFromList({a:{b:[2,3]}}, [a,b], 3) => {a:{b:[2]}}
	d = { a: { b: [2, 3] } };
	res = lookupRemoveFromList(d, ['a', 'b'], 3, true);
	console.log('res', res, 'd', d);

	//usage: lookupRemoveFromList({a:[ 0, [2], {b:[]} ] }, [a,1], 2) => { a:[ 0, [], {b:[]} ] }
	d = { a: [0, [2], { b: [] }] };
	res = lookupRemoveFromList(d, ['a', 1], 2);
	console.log('res', res, 'd', d);

}
function deepmergeTest() {
	//=> all 3 objects are different copies!!!
	let o1 = { a: 1, c: 1 };
	let o2 = { a: 2, b: 2 };

	let o3 = deepmerge(o1, o2);
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o1.a = 11;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o2.a = 22;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);

	o3.a = 33;
	logVals('___\no1', o1); logVals('o2', o2); logVals('o3', o3);
}
function logVals(title, o) {
	let s = title + ':  ';
	for (const k in o) { s += k + ':' + o[k] + ' '; }
	console.log(s);
}

//#endregion

//#region add or remove oid/key
function getRandomUidNodeWithAct(R) {
	//das geht garnicht!!!!!!!!!!!!!!!!!!!!!!!
	//der node existiert ja nicht mehr!
	//geht fuer remove aber nicht fuer add!!!!!
	let cands = Object.values(R.uiNodes).filter(x => isdef(x.act) && isdef(x.oid));
	//console.log(cands);
	if (isEmpty(cands)) return null;
	let n = chooseRandom(cands);
	//console.log(n);
	return n;
}
function testRemoveOidKey(R) {

	// let { oid, key } = getRandomOidAndKey(R);
	let n = getRandomUidNodeWithAct(R);
	if (!n) {
		console.log('there is no oid to remove!!!');
		return;
	}
	let [oid, key] = [n.oid, n.key];

	let nodeInstances = lookup(R.treeNodesByOidAndKey, [oid, key]);
	console.log('_________ testRemoveOidKey', 'remove all', oid, key, nodeInstances);
	//console.log('remove', oid, key);
	removeOidKey(oid, key, R);

	updateOutput(R);

}

function getRandomNodeThatCanBeAdded(R) {
	let nonEmpty = allCondDict(R.oidNodes, x => !isEmpty(x));
	//console.log(nonEmpty);
	// let random_oid = chooseRandom(nonEmpty);
	// let locs = Object.keys(R.oidNodes[random_oid]);
	// let random_loc = chooseRandom(locs);
	// return { oid: random_oid, loc: random_loc };
}
function testAddOidKey(R) {

	//let n=chooseRandom(R.instantiable);
	console.log(R.instantiable)
	let n = lastCond(R.instantiable, x => !lookup(R.treeNodesByOidAndKey, [x.oid, x.key]));
	if (!n) {
		console.log('all nodes are instantiated!!!');
		return;
	}
	//console.log(n);

	let [oid, key] = [n.oid, n.key];
	let o = R.getO(oid);
	if (!o) {
		console.log('no object with oid', oid, 'found!!!');
		return;
	}
	//console.log(' T_____________________ testAddOidLoc: add', oid, '/', key);
	if (o.loc) addOidByLocProperty(oid, key, R); else addOidByParentKeyLocation(oid, key, R);

	//hier brauch ich noch generateUi fuer neue nodes!!!
	//addOidByLocProperty(oid, key, R);

	updateOutput(R);

}
//#endregion


//#region filter stuff
function run109(){
	//this it how it should look like!
	let paper=mDivG('table',400,300,'blue');
	let svg = paper.parentNode;
	let u=`<use x="100" y="100" xlink:href="assets/svg/animals.svg#bird" />`;


	console.log(svg);
	return;
	let g = agShape(canvas, 'rect', 250, 250, 'gold');

	// let g = agShape(canvas, 'rect', 250, 250, 'gold');
	// aFilters(paper,{blur:2,gray:})
	// let u=`<use x="100" y="100" xlink:href="assets/svg/animals.svg#bird" />`;
}
function mDivSvg(area,w,h,color){
	let d = mDiv(mBy('table'));
	if (isdef(w)) mSize(d, w,h);
	if (isdef(color)) mColor(d, color);
	let g = aSvgg(d);
	return g;
}
function mDivG(area,w,h,color){
	let d = mDiv(mBy('table'));
	if (isdef(w)) mSize(d, w,h);
	if (isdef(color)) mColor(d, color);
	let g = aSvgg(d);
	return g;
}
function run108() {
	// var container = document.getElementById("svgContainer");
	let d = mDiv(mBy('table'));
	mSize(d, 400, 300);
	mColor(d, 'blue');
	let canvas = aSvgg(d);
	let svg = d.children[0];
	// var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	// svg.setAttribute("version", "1.1");
	// d.appendChild(svg);
	let g1 = agShape(canvas, 'rect', 250, 250, 'gold');
	
	let text = agText(g1, 'hallo', 'black', '16px AlgerianRegular').elem;
	
	let ci = g1.children[0];

	// var obj = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	// obj.setAttribute("width", "90");
	// obj.setAttribute("height", "90");

	var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

	var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
	filter.setAttribute("id", "f1");
	// filter.setAttribute("x", "0");
	// filter.setAttribute("y", "0");

	var gaussianFilter = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
	// gaussianFilter.setAttribute("in", "SourceGraphic");
	gaussianFilter.setAttribute("stdDeviation", "2");

	filter.appendChild(gaussianFilter);
	defs.appendChild(filter);
	svg.appendChild(defs);
	// text.elem.setAttribute("filter", "url(#f1)");
	text.setAttribute("filter", "url(#f1)");

	//svg.appendChild(obj);
}

//trial2 filter
function createcircle(posx, posy, radius, stroke, fill, filter) {
	var circle = document.createElementNS(svgns, "circle");
	circle.setAttributeNS(null, "id", "c" + circles);
	circle.setAttributeNS(null, "cx", posx);
	circle.setAttributeNS(null, "cy", posy);
	circle.setAttributeNS(null, "r", radius);
	circle.setAttributeNS(null, "stroke-width", stroke);
	circle.setAttributeNS(null, "fill", fill);
	circle.setAttributeNS(null, "filter", filter);
	circle.setAttributeNS(null, "data-posx", posx);
	svg.appendChild(circle);
	//    console.log(circle);
}
function createFilter(svg, posx, posy, sizex, sizey, type, data) {
	var svgns = "http://www.w3.org/2000/svg";
	var defs = document.createElementNS(svgns, "defs");
	svg.appendChild(defs);
	var filter = document.createElementNS(svgns, "filter");
	defs.appendChild(filter);
	filter.setAttribute("id", "filterBlur");
	filter.setAttribute("x", posx);
	filter.setAttribute("y", posy);
	filter.setAttribute("width", sizex);
	filter.setAttribute("height", sizey);

	for (z = 0; z < (data.length / 2); z++) {
		var filter = document.createElementNS(svgns, type[z]);
		filter.setAttributeNS(null, "in", "SourceGraphic");
		filter.setAttributeNS(null, data[2 * z], data[2 * z + 1]);
		document.getElementById("f" + circles).appendChild(filter);
	}
}
function run107() {
	let d = mDiv(mBy('table'));
	mSize(d, 400, 300);
	mColor(d, 'blue');
	let canvas = aSvgg(d);

	let svg = d.children[0];
	console.log('svg', svg);

	createfilter(svg, "-50%", "-50%", "200%", "200%", ["feGaussianBlur"], ["stdDeviation", "5"]);


	let g1 = agShape(canvas, 'circle', 50, 50, 'gold');

	let ci = g1.children[0];
	console.log(ci);

	addClass(d, 'blur')

	//addClass(ci,'blur')

	// mClass(shape,'grayscale'); //NO!
	// addClass(shape,'grayscale');
	//console.log(shape)


}


//trial1 filter
function createfilter1(posx, posy, sizex, sizey, type, data) {
	var svg = document.getElementById("canvas");
	var fs = document.getElementById("filters");
	var circles = 0;
	var svgns = "http://www.w3.org/2000/svg";
	var w = window.innerWidth;
	var filter = document.createElementNS(svgns, "filter");
	filter.setAttribute("id", "f" + circles);
	//filter.setAttribute("x",posx);
	//filter.setAttribute("y",posy);
	//filter.setAttribute("width",sizex);
	//filter.setAttribute("height",sizey);
	fs.appendChild(filter);
	for (z = 0; z < (data.length / 2); z++) {
		var filter = document.createElementNS(svgns, type[z]);
		filter.setAttributeNS(null, "in", "SourceGraphic");
		filter.setAttributeNS(null, data[2 * z], data[2 * z + 1]);
		document.getElementById("f" + circles).appendChild(filter);
	}
	//console.log(document.getElementById("f"+circles)); //to see if it has worked or not
}
function createcircle(posx, posy, radius, stroke, fill, filter) {
	var circle = document.createElementNS(svgns, "circle");
	circle.setAttributeNS(null, "id", "c" + circles);
	circle.setAttributeNS(null, "cx", posx);
	circle.setAttributeNS(null, "cy", posy);
	circle.setAttributeNS(null, "r", radius);
	circle.setAttributeNS(null, "stroke-width", stroke);
	circle.setAttributeNS(null, "fill", fill);
	circle.setAttributeNS(null, "filter", filter);
	circle.setAttributeNS(null, "data-posx", posx);
	svg.appendChild(circle);
	//    console.log(circle);
}
function test() {
	for (i = 0; i < 10; i++) {
		circles += 1;
		createcircle((i * w / 10), "50%", "100", "0", "hsla(" + (i * 36) + ",100%,50%,0.5)", "url(#f" + circles + ")"); createfilter("-50%", "-50%", "200%", "200%", ["feGaussianBlur"], ["stdDeviation", "5"]);
		//this works - the parameters are (posx,posy,radius,stroke,fill,filter) but currently I can only use a filter that I have created in the html svg element as my code doesn't work
	}

}
//#endregion

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





















