class GameBase {
	startGame() { console.log('starting', this.friendlyName); }
	startLevel() { }
	startRound() { uiActivated = false; }
	prompt() { }
	trialPrompt() {
		Speech.say(currentLanguage == 'D' ? 'nochmal!' : 'try again!');
		//shortHintPic();
		return 10;
	}
	activate() { uiActivated = true; }
	eval() { }
	interrupt() { }
}

class GMem extends GameBase {
	constructor() {
		super();
		console.log('hallo was ist da los???')
		this.friendlyName = 'Memory!';
		this.logo = 'memory';
		//console.log('GREEN',GREEN)
		this.color = GREEN; //'#3cb44b'
		
	}
	startLevel() {
		clearTimeout(MemMMTimeout);
		MaxNumTrials = getGameOrLevelInfo('trials', 2);
		NumPics = getGameOrLevelInfo('numPics', 4);
		NumRepeat = getGameOrLevelInfo('numRepeat', 1);
		NumLabels = getGameOrLevelInfo('numLabels', NumPics * NumRepeat);

		let vinfo = getGameOrLevelInfo('vocab', 100);
		vinfo = ensureMinVocab(vinfo, NumPics);

		currentKeys = setKeys({ lang: currentLanguage, nbestOrCats: vinfo }); //isNumber(vinfo) ? KeySets['best' + vinfo] : setKeys(vinfo);
	}
	prompt() {

		showPictures(interactMM, { repeat: NumRepeat, sameBackground: true, border: '3px solid #ffffff80' });
		setGoal();

		if (currentLevel > 2) { showInstruction('', 'remember all', dTitle, true); }
		else { showInstruction(Goal.label, 'remember', dTitle, true); }

		let secs = calcTimingMM();
		setTimeout(()=>this.prompt2(secs),300); //needed fuer ui update! sonst verschluckt er last label
	}
	prompt2(secs){
		for (const p of Pictures) { slowlyTurnFaceDown(p, secs - 1); }
		MemMMTimeout = setTimeout(() => {
			if (!isUiInterrupted() || currentGame != 'gMem') {
				showInstruction(Goal.label, 'click', dTitle, true);
				activateUi();
			}
		}, secs * 1000);

	}
	eval(ev) {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = bestWord;
		Selected.answer = item.label;

		if (item.label == bestWord) { return true; } else {
			return false;
		}
	}

}







