class Game {
	constructor() {
	}
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }//console.log(getFunctionCallerName()); }
	startGame() { }//console.log(getFunctionCallerName()); }
	startLevel() { }//console.log(getFunctionCallerName()); }
	startRound() { }//console.log(getFunctionCallerName()); }
	prompt() {
		//console.log(getFunctionCallerName());
		showPictures(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		//console.log(getFunctionCallerName());
		Speech.say(Settings.language == 'D' ? 'nochmal!' : 'try again!');
		if (Settings.showHint) shortHintPic();
		return 10;
	}
	activate() { }//console.log(getFunctionCallerName()); }
	interact() { }//console.log(getFunctionCallerName()); }
	eval(ev) {
		//console.log(getFunctionCallerName());
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
	recycle() { }//console.log(getFunctionCallerName()); }
}

class GPremem extends Game {
	constructor() {
		super();
		this.picList = [];
	}
	clear() { clearTimeout(this.TO); showMouse(); }
	prompt() {
		this.picList = [];
		//console.log(this.picList)
		showPictures(this.interact.bind(this), { repeat: G.numRepeat, sameBackground: true, border: '3px solid #ffffff80' });
		showInstruction('', 'click any picture', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		for (const p of this.picList) { toggleSelectionOfPicture(p); }
		this.picList = [];
		showInstruction('', 'try again: click any picture', dTitle, true);
		return 10;
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let id = evToClosestId(ev);
		let i = firstNumber(id);
		let pic = Pictures[i];
		let div = pic.div;
		if (!isEmpty(this.picList) && this.picList.length < G.numRepeat - 1 && this.picList[0].label != pic.label) return;
		toggleSelectionOfPicture(pic, this.picList);
		console.log('clicked', pic.key, this.picList);//,picList, GPremem.PicList);
		if (isEmpty(this.picList)) {
			showInstruction('', 'click any picture', dTitle, true);
		} else if (this.picList.length < G.numRepeat - 1) {
			//set incomplete: more steps are needed!
			//frame the picture
			showInstruction(pic.label, 'click another', dTitle, true);
		} else if (this.picList.length == G.numRepeat - 1) {
			// look for last picture with x that is not in the set
			let picGoal = firstCond(Pictures, x => x.label == pic.label && !x.isSelected);
			setGoal(picGoal.index);
			showInstruction(picGoal.label, 'click the ' + (G.numRepeat == 2 ? 'other' : 'last'), dTitle, true);
		} else {
			//set is complete: eval
			evaluate(this.picList);
		}
	}
	eval(piclist) {
		Selected = { piclist: piclist, feedbackUI: piclist.map(x => x.div), sz: getBounds(piclist[0].div).height };
		let req = Selected.reqAnswer = piclist[0].label;
		Selected.answer = piclist[piclist.length - 1].label;
		if (Selected.answer == req) { return true; } else { return false; }
	}
}


function interact(ev) {
	console.log('ha!', ev)
	ev.cancelBubble = true;
	if (!canAct()) return;

	let id = evToClosestId(ev);
	let i = firstNumber(id);
	let pic = Pictures[i];
	let div = pic.div;
	console.log('clicked', pic.key, this.pickList, GPremem.PicList);
	if (!isEmpty(this.picList) && this.picList.length < G.numRepeat - 1 && this.picList[0].label != pic.label) return;
	toggleSelectionOfPicture(pic, this.picList);
	if (isEmpty(this.picList)) {
		showInstruction('', 'click any picture', dTitle, true);
	} else if (this.picList.length < G.numRepeat - 1) {
		//set incomplete: more steps are needed!
		//frame the picture
		showInstruction(pic.label, 'click another', dTitle, true);
	} else if (this.picList.length == G.numRepeat - 1) {
		// look for last picture with x that is not in the set
		let picGoal = firstCond(Pictures, x => x.label == pic.label && !x.isSelected);
		setGoal(picGoal.index);
		showInstruction(picGoal.label, 'click the ' + (G.numRepeat == 2 ? 'other' : 'last'), dTitle, true);
	} else {
		//set is complete: eval
		evaluate(this.picList);
	}
	//console.log(this.picList)
}
