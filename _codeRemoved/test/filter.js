//#region filter tests
function run09() {
	//this it how it should look like!
	let paper = mDivG('table', 400, 300, 'blue');
	let svg = paper.parentNode;
	let u = `<use x="100" y="100" xlink:href="assets/svg/animals.svg#bird" />`;


	console.log(svg);
	return;
	let g = agShape(canvas, 'rect', 250, 250, 'gold');

	// let g = agShape(canvas, 'rect', 250, 250, 'gold');
	// aFilters(paper,{blur:2,gray:})
	// let u=`<use x="100" y="100" xlink:href="assets/svg/animals.svg#bird" />`;
}
function mDivSvg(area, w, h, color) {
	let d = mDiv(mBy('table'));
	if (isdef(w)) mSize(d, w, h);
	if (isdef(color)) mColor(d, color);
	let g = aSvgg(d);
	return g;
}
function mDivG(area, w, h, color) {
	let d = mDiv(mBy('table'));
	if (isdef(w)) mSize(d, w, h);
	if (isdef(color)) mColor(d, color);
	let g = aSvgg(d);
	return g;
}
function run08() {
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

	let text = agText(g1, 'hallo', 'black', 'yellow', '16px AlgerianRegular').elem;

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
//#region filter functions
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



//#region old filter functions
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



