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





//#region MIST
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
function run07() {
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



//noch mehr mist
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


