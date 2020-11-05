//#region init UI
function initTable() {
	let table = mBy('table');
	clearElement(table);

	initLineTop();
	initLineTitle();
	initLineTable();
	initLineBottom();
}
function initSidebar() {
	let title = mText('badges:', mBy('sidebar'));
	dLeiste = mDiv(mBy('sidebar'));
	mStyleX(dLeiste, { 'max-height': '100vh', display: 'flex', 'flex-flow': 'column wrap' });
}
function initLineTop() {
	dLineTopOuter = mDiv(table); dLineTopOuter.id = 'lineTopOuter';
	dLineTop = mDiv(dLineTopOuter); dLineTop.id = 'lineTop';
	dLineTopLeft = mDiv(dLineTop); dLineTopLeft.id = 'lineTopLeft';
	dLineTopRight = mDiv(dLineTop); dLineTopRight.id = 'lineTopRight';
	dLineTopMiddle = mDiv(dLineTop); dLineTopMiddle.id = 'lineTopMiddle';

	dScore = mDiv(dLineTopMiddle);
	dScore.id = 'dScore';

	dLevel = mDiv(dLineTopLeft);
	dLevel.id = 'dLevel';

	mLinebreak(table);
}
function initLineTitle() {
	dLineTitleOuter = mDiv(table); dLineTitleOuter.id = 'lineTitleOuter';
	dLineTitle = mDiv(dLineTitleOuter); dLineTitle.id = 'lineTitle';
	dLineTitleLeft = mDiv(dLineTitle); dLineTitleLeft.id = 'lineTitleLeft';
	dLineTitleRight = mDiv(dLineTitle); dLineTitleRight.id = 'lineTitleRight';
	dLineTitleMiddle = mDiv(dLineTitle); dLineTitleMiddle.id = 'lineTitleMiddle';

	mLinebreak(table);
}
function initLineTable() {
	dLineTableOuter = mDiv(table); dLineTableOuter.id = 'lineTableOuter';
	dLineTable = mDiv(dLineTableOuter); dLineTable.id = 'lineTable';
	dLineTableLeft = mDiv(dLineTable); dLineTableLeft.id = 'lineTableLeft';
	dLineTableMiddle = mDiv(dLineTable); dLineTableMiddle.id = 'lineTableMiddle';
	mClass(dLineTableMiddle, 'flexWrap');
	dLineTableRight = mDiv(dLineTable); dLineTableRight.id = 'lineTableRight';

	mLinebreak(table);
}
function initLineBottom() {
	dLineBottomOuter = mDiv(table); dLineBottomOuter.id = 'lineBottomOuter';
	dLineBottom = mDiv(dLineBottomOuter); dLineBottom.id = 'lineBottom';
	dLineBottomLeft = mDiv(dLineBottom); dLineBottomLeft.id = 'lineBottomLeft';
	dLineBottomRight = mDiv(dLineBottom); dLineBottomRight.id = 'lineBottomRight';
	dLineBottomMiddle = mDiv(dLineBottom); dLineBottomMiddle.id = 'lineBottomMiddle';

	mLinebreak(table);
}
//#endregion

function aniFadeInOut(elem,secs){
	mClass(elem,'transopaOn');
	//dLineBottomMiddle.opacity=0;
	//mClass(dLineBottomMiddle,'aniFadeInOut');
	setTimeout(()=>{mRemoveClass(elem,'transopaOn');mClass(elem,'transopaOff');},secs*1000);

}
function fleetingMessage(msg){
	dLineBottomMiddle.innerHTML=msg;
	mStyleX(dLineBottomMiddle,{fz:28,matop:50})
	//dLineBottomMiddle.style.fontSize='24pt';
	aniFadeInOut(dLineBottomMiddle,2);

	// mClass(dLineBottomMiddle,'transopaOn');
	// setTimeout(()=>{mRemoveClass(dLineBottomMiddle,'transopaOn');mClass(dLineBottomMiddle,'transopaOff');},2000)
}

//#region ui
function beforeActivationUI() { uiPaused |= beforeActivationMask; uiPaused &= ~hasClickedMask; }
function activationUI(){uiPaused &= ~beforeActivationMask;}
function hasClickedUI(){uiPaused |= hasClickedMask;}
function pauseUI() { uiPausedStack.push(uiPaused); uiPaused |= uiHaltedMask; }
function resumeUI() { uiPaused = uiPausedStack.pop(); }


