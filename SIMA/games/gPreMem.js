var MemPM;
var TOPM;
function clearPM(){ clearTimeout(TOPM);}
function startGamePM() { }
function startLevelPM() { levelPM(); }
function levelPM() {
	G.trials = getGameOrLevelInfo('trials', 2);
	G.numPics = getGameOrLevelInfo('numPics', 4);
	G.numRepeat = getGameOrLevelInfo('numRepeat', 2);
	G.numLabels = getGameOrLevelInfo('numLabels', G.numPics*G.numRepeat);

	let vinfo = getGameOrLevelInfo('vocab', 100);
	vinfo = ensureMinVocab(vinfo,G.numPics);

	G.keys = setKeys({lang:Settings.language,nbestOrCats:vinfo}); //isNumber(vinfo) ? KeySets['best' + vinfo] : setKeys(vinfo);
}
function startRoundPM() {
	uiActivated = false;
	
}
function OneTwoThree(ev) {
	ev.cancelBubble = true;
	if (uiPaused || ev.ctrlKey || ev.altKey) return;

	let id = evToClosestId(ev);
	let i = firstNumber(id);
	let pic = Pictures[i];
	let div = pic.div;
	//console.log('clicked', pic.key);
	if (!isEmpty(MemPM) && MemPM.length < G.numRepeat-1 && MemPM[0].label != pic.label) return;
	toggleSelectionOfPicture(pic,MemPM);
	if (isEmpty(MemPM)) {
		showInstruction('', 'click any picture', dTitle, true);
	}else if (MemPM.length < G.numRepeat-1) {
		//set incomplete: more steps are needed!
		//frame the picture
		showInstruction(pic.label, 'click another', dTitle, true);
	}else if (MemPM.length == G.numRepeat-1) {
		// look for last picture with x that is not in the set
		let picGoal = firstCond(Pictures,x=>x.label == pic.label && !x.isSelected);
		setGoal(picGoal.index);
		showInstruction(picGoal.label, 'click the '+(G.numRepeat == 2?'other':'last'), dTitle, true);
	} else {
		//set is complete: eval
		evaluate(MemPM);
	}
	//console.log(MemPM)

}
function promptPM() {
	MemPM = [];
	//console.log('{{{{{{{{{{{{{',G.numPics,G.numRepeat)
	showPictures(OneTwoThree, { repeat: G.numRepeat, sameBackground:true, border: '3px solid #ffffff80' });
	//setGoal();
	showInstruction('', 'click any picture', dTitle, true);
	activateUi();
	//return 10;
}
function trialPromptPM() {
	for (const p of MemPM) { toggleSelectionOfPicture(p); }
	MemPM = [];
	Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
	//shortHintPic();
	return 10;
}
function activatePM() {
	uiActivated = true;
}
function evalPM(piclist) {

	Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getBounds(piclist[0].div).height };

	let req = Selected.reqAnswer = piclist[0].label;
	// let eachAnswerSame = true;
	// for (const p of piclist) { if (p.label != req) eachAnswerSame = false; }
	Selected.answer = piclist[piclist.length - 1].label;
	if (Selected.answer == req) { return true; } else { return false; }
}

