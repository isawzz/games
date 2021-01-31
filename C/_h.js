function loadPic(filename,w,h,dParent,{x,y,row,col,scale}={},ext='jpg',dir='../assets/images/postures/'){
	let dPic = mDiv(dParent);
	dPic.style.width=''+w+'px';
	dPic.style.height=''+h+'px';
	if (isdef(row)) row*=w;
	if (isdef(col)) col*=h;
	if (isdef(x)) row=x;
	if (isdef(y)) col=y;
	if (nundef(row)) row=0;
	if (nundef(col)) col=0;
	// console.log('row',row,'col',col)
	dPic.style.background=`url(${dir}${filename}.${ext}) -${col}px -${row}px`;
	if (isdef(scale)) dPic.style.transform = `scale(${scale})`;
}

function loadExerciser(dParent,row,col){
	//console.log(dParent,row,col)
	loadPic('exercises',100,100,dParent,{row:row,col:col,scale:1.5},'gif');
	// row*=100; //Math.round(Math.random()*10); //200;
	// col*=100; //Math.random()*500;
	// let dPic = mDiv(dParent);
	// dPic.style.width='100px';
	// dPic.style.height='100px';
	// dPic.style.background=`url('../assets/images/postures/exercises.gif') -${col}px -${row}px`;
	// dPic.style.transform = 'scale(1.5)';
	// //dPic.style.marginTop = '-100px';
}
function loadRandomExerciser(dParent){	loadExerciser(dParent,randomNumber(0,5),randomNumber(0,7));}
function loadWalker(dParent){	loadExerciser(dParent,3,2);}
function loadRandomTaeOrPosturePic(dpics){
	let imgs = ['tae', 'posture'];
	mImage(`../assets/images/postures/${chooseRandom(imgs)}0${randomNumber(1,8)}.jpg`, dpics,200,200);

}








