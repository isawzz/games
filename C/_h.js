
function getRandomItems(n, keyOrSet, text = true, pic = true) {
	let keys = getRandomKeys(n, keyOrSet);
	//console.log(keys)
	if (pic) {
		let [pics, rows] = getPictureItems(() => console.log('click'), undefined, { rows: 2, showLabels: text }, keys);
		console.log(pics)
		return pics;
	} else {
		let [pics, rows] = getTextItems(() => console.log('click'), undefined, { rows: 2, showLabels: true }, keys);
		return pics;
	}
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







