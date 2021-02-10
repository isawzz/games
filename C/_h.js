function _prepText1_dep(items, ifs, options) {
	//#region phase2: prepare items for container
	options.showLabels = true;

	let sz = options.sz;
	let padding = (isdef(ifs.padding) ? ifs.padding : 1);

	let bo = ifs.border;
	bo = isdef(bo) ? isString(bo) ? firstNumber(bo) : bo : 0;

	let szNet = sz - 2 * padding - 2 * bo;

	// let pictureSize = 0;
	// let picStyles = { w: szNet, h: isdef(options.center)?szNet : szNet + padding }; //if no labels!
	let textStyles, hText;
	if (options.showLabels) {
		let longestLabel = findLongestLabel(items);
		let oneWord = longestLabel.label.replace(' ', '_');

		textStyles = idealFontsize(oneWord, szNet, szNet, 22, 8); //, 'bold');	textStyles.weight='bold'
		hText = textStyles.h;

		// pictureSize = szNet - hText;
		// picStyles = { w: pictureSize, h: pictureSize };

		delete textStyles.h;
		delete textStyles.w;
	}

	let outerStyles = { rounding: 10, margin: sz / 12, display: 'inline-block', w: sz, padding: padding, bg: 'white', align: 'center', 'box-sizing': 'border-box' };
	outerStyles = deepmergeOverride(outerStyles, ifs);
	let pic, text;
	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let k = item.key;
		let d = mDiv();
		//add pic
		if (isdef(item.textShadowColor)) {
			let sShade = '0 0 0 ' + item.textShadowColor;
			textStyles['text-shadow'] = sShade;
			textStyles.fg = anyColorToStandardString('black', item.contrast); //'#00000080' '#00000030' 
		}

		//console.log('::::::::::::::',picStyles)
		// pic = zPic(k, null, picStyles, true, false);
		// delete pic.info;
		// mAppend(d, pic.div);
		//add text if needed
		if (options.showLabels) {
			textStyles.fg = item.fg;
			text = zText1Line(item.label, null, textStyles, hText);
			mAppend(d, text.div);
		}
		//style container div
		outerStyles.bg = item.bg;
		outerStyles.fg = item.fg;
		mStyleX(d, outerStyles);
		//console.log('===>iGroup',item.iGroup,i)
		d.id = getUID(); // 'pic' + (i + item.iGroup); //$$$$$
		d.onclick = options.onclick;
		//complete item info
		item.id = d.id;
		item.row = Math.floor(item.index / options.cols);
		item.col = item.index % options.cols;
		item.div = d;
		item.pic = null; //pic;
		item.isSelected = false;
		item.isLabelVisible = options.showLabels;
		item.dims = parseDims(sz, sz, d.style.padding);
		//console.log('index', item.index, 'row', item.row, 'col', item.col)
		if (options.showRepeat) addRepeatInfo(d, item.iRepeat, sz);
		// let fzPic = 0;//firstNumber(item.div.children[0].children[0].style.fontSize);
		// let docfz = item.pic.innerDims.fz;
		// console.assert(docfz == fzPic, 'fzPic is ' + fzPic + ', docfz is ' + docfz );
		// if (docfz != fzPic){
		// 	console.log('item',item)
		// }
		item.fzPic = 0;//fzPic;

		//console.log('picSize',sz)
	}
	//#endregion

}







//#region loading images cropped
function loadPic(filename, w, h, dParent, { x, y, row, col, scale } = {}, ext = 'jpg', dir = '../assets/images/postures/') {
	let dPic = mDiv(dParent);
	dPic.style.width = '' + w + 'px';
	dPic.style.height = '' + h + 'px';
	if (isdef(row)) row *= w;
	if (isdef(col)) col *= h;
	if (isdef(x)) col = x;
	if (isdef(y)) row = y;
	if (nundef(row)) row = 0;
	if (nundef(col)) col = 0;
	// console.log('row',row,'col',col)
	dPic.style.background = `url(${dir}${filename}.${ext}) -${col}px -${row}px`;
	if (isdef(scale)) dPic.style.transform = `scale(${scale})`;
}
function loadRandomExerciser2(dParent, i) {
	let w = 280;
	let h = 240;
	let filename = 'exercises2';
	let table = [[30, 30], [30, 260], [30, 480], [30, 730], [20, 940],
	[350, 30], [350, 245], [350, 450], [350, 650], [330, 890],
	[620, 0], [620, 245], [620, 460], [620, 700], [560, 920],
	[880, 0], [900, 245], [890, 460], [860, 700], [870, 920],
	[1150, 0], [1170, 320], [1150, 620], [1120, 900],
	[1350, 30], [1400, 330], [1380, 630], [1350, 890]
	];
	if (nundef(i)) i = randomNumber(0, table.length - 1);
	i = i % table.length;
	// let i=0; //10;
	let x = table[i][0]; //300;//0;//randomNumber(0,4);
	let y = table[i][1];//230;//randomNumber(0,5);
	if (i == 9) { w = 240; h = 280; }
	else if (i == 13) { w = 240; h = 200; }
	else if (i == 14) { w = 260; h = 260; }
	else if (i == 20 || i == 21 || i == 22) { w = 240; h = 260; }
	else if (i == 24) { w = 280; h = 280; }
	else if (i == 25) { w = 200; h = 290; }
	else if (i == 26) { w = 230; h = 260; }
	else if (i == 27) { w = 240; h = 250; }
	console.log('i' + i, x, y)
	//console.log(dParent,row,col)
	loadPic(filename, w, h, dParent, { x: x, y: y }, 'gif');
	// row*=100; //Math.round(Math.random()*10); //200;
	// col*=100; //Math.random()*500;
	// let dPic = mDiv(dParent);
	// dPic.style.width='100px';
	// dPic.style.height='100px';
	// dPic.style.background=`url('../assets/images/postures/exercises.gif') -${col}px -${row}px`;
	// dPic.style.transform = 'scale(1.5)';
	// //dPic.style.marginTop = '-100px';
}

function loadExerciser(dParent, row, col) {
	//console.log(dParent,row,col)
	loadPic('exercises', 100, 100, dParent, { row: row, col: col, scale: 1.5 }, 'gif');
	// row*=100; //Math.round(Math.random()*10); //200;
	// col*=100; //Math.random()*500;
	// let dPic = mDiv(dParent);
	// dPic.style.width='100px';
	// dPic.style.height='100px';
	// dPic.style.background=`url('../assets/images/postures/exercises.gif') -${col}px -${row}px`;
	// dPic.style.transform = 'scale(1.5)';
	// //dPic.style.marginTop = '-100px';
}
function loadRandomExerciser(dParent) {
	mLinebreak(dParent, 75);
	loadExerciser(dParent, randomNumber(0, 5), randomNumber(0, 7));
	mLinebreak(dParent, 25);

}
function loadWalker(dParent) { loadExerciser(dParent, 3, 2); }
function loadRandomTaeOrPosturePic(dpics) {
	let imgs = ['tae', 'posture'];
	mImage(`../assets/images/postures/${chooseRandom(imgs)}0${randomNumber(1, 8)}.jpg`, dpics, 200, 200);

}
//#endregion







