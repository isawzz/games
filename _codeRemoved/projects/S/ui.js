//#region init UI
function initTable() {
	let table = mBy('table');
	clearElement(table);

	initLine1();
	initLineTop();
	initLineMiddle();
	//initLineBottom();
}
function initSidebar(){
	let title=mText('badges:',mBy('sidebar'));
	dLeiste = mDiv(mBy('sidebar'));//mBy('dLeiste'));
	mStyleX(dLeiste,{'max-height':'100vh',display:'flex','flex-flow':'column wrap'});
	//showBadges(dLeiste,level,levelColors);

}
function initLine1() {
	dLine1Outer = mDiv(table); dLine1Outer.id = 'line1Outer';
	dLine1 = mDiv(dLine1Outer); dLine1.id = 'line1';
	dLine1Left = mDiv(dLine1); dLine1Left.id = 'line1Left';
	dLine1Right = mDiv(dLine1); dLine1Right.id = 'line1Right'; //dLine1Right.innerHTML = 'O';
	dLine1Middle = mDiv(dLine1); dLine1Middle.id = 'line1Middle';

	dScore = mDiv(dLine1Middle);
	dScore.id = 'dScore';
	//dScore.innerHTML = "<span>score:</span><span id='scoreSpan'></span>";
	// mLinebreak(table);
	dLevel = mDiv(dLine1Left);
	dLevel.id = 'dLevel';

	// let b = mButton(immediateStart ? 'NEXT' : 'start', onClickStartButton, dLineTopMiddle, {}, ['bigCentralButton2']);
	// b.id = 'bStart';

	mLinebreak(table);
}
function initLineTop() {
	dLineTopOuter = mDiv(table); dLineTopOuter.id = 'lineTopOuter';
	dLineTop = mDiv(dLineTopOuter); dLineTop.id = 'lineTop';
	dLineTopLeft = mDiv(dLineTop); dLineTopLeft.id = 'lineTopLeft';
	dLineTopRight = mDiv(dLineTop); dLineTopRight.id = 'lineTopRight'; //dLineTopRight.innerHTML = 'O';
	dLineTopMiddle = mDiv(dLineTop); dLineTopMiddle.id = 'lineTopMiddle';

	// let dScore = mDiv(dLineTopRight);
	// dScore.id = 'scoreDiv';
	// dScore.innerHTML = "<span>score:</span><span id='scoreSpan'>0</span>";
	// mLinebreak(table);

	// let b = mButton(immediateStart ? 'NEXT' : 'start', onClickStartButton, dLineTopMiddle, {}, ['bigCentralButton2']);
	// b.id = 'bStart';

	mLinebreak(table);
}
function initLineMiddle() {
	dLineMidOuter = mDiv(table); dLineMidOuter.id = 'lineMidOuter';
	dLineMid = mDiv(dLineMidOuter); dLineMid.id = 'lineMid';
	dLineMidLeft = mDiv(dLineMid); dLineMidLeft.id = 'lineMidLeft'; //dLineMidLeft.innerHTML = 'O';
	dLineMidMiddle = mDiv(dLineMid); dLineMidMiddle.id = 'lineMidMiddle';
	mClass(dLineMidMiddle, 'flexWrap');
	dLineMidRight = mDiv(dLineMid); dLineMidRight.id = 'lineMidRight'; //dLineMidRight.innerHTML = 'O';

	mLinebreak(table);
}
function initLineBottom() {
	dLineBottomOuter = mDiv(table); dLineBottomOuter.id = 'lineBottomOuter';
	dLineBottom = mDiv(dLineBottomOuter); dLineBottom.id = 'lineBottom';
	dLineBottomLeft = mDiv(dLineBottom); dLineBottomLeft.id = 'lineBottomLeft';
	dLineBottomRight = mDiv(dLineBottom); dLineBottomRight.id = 'lineBottomRight'; dLineBottomRight.innerHTML = 'O';
	dLineBottomMiddle = mDiv(dLineBottom); dLineBottomMiddle.id = 'lineBottomMiddle';

	mLinebreak(table);
}
