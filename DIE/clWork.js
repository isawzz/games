class Game {
	constructor(name) { this.name = name; }
	clear() { clearTimeout(this.TO); clearFleetingMessage(); }
	startGame() { }
	startLevel() { }
	startRound() { }
	prompt() {
		showPictures(evaluate);
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
	trialPrompt() {
		sayTryAgain();
		if (!calibrating() && Settings.showHint) shortHintPic();
		return 10;
	}
	activate() { }
	interact() { }
	eval(ev) {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		if (item.label == Goal.label) { return true; } else { return false; }
	}
}

class GElim extends Game {
	constructor(name) { super(name); }
	startGame() { G.correctionFunc = ()=>playSound('incorrect1'); }
	startLevel() {
		G.keys = G.keys.filter(x => containsColorWord(x));
	}
	prompt() {
		this.piclist = [];
		let colorKeys = G.numColors > 1 ? choose(G.colors, G.numColors) : null;
		let showRepeat = G.numRepeat > 1;
		showPictures(this.interact.bind(this), { showRepeat: showRepeat, colorKeys: colorKeys, contrast: G.contrast, repeat: G.numRepeat });
		
		let [sSpoken,sWritten,piclist] = logicSetSelector(Pictures);
		this.piclist = piclist;
		Goal={pics:this.piclist, sammler:[]};
		showInstructionX(sWritten,dTitle,sSpoken,14);
		// // this.keys = Pictures.filter(x => x.iRepeat == 1 && x.row == 0).map(x => x.key);
		// // console.log('=========>>>keys:', this.keys)

		// //am leichtesten ist eliminate all 
		// //goal muss exakt definiert sein
		// //habe: all, one of each, every second, all except ..., content== or !=,number <.<=,==,>,=> 
		// //color blue and/or not
		// //comprehension: x|x.color== or != && x.label== or != and 
		// Goal = chooseRandom(Pictures);
		// let [sSpoken,sWritten] = logicSelector(5);
		// // let sWritten = 'Mission: eliminate all except';
		// showInstruction('', sWritten, dTitle, true);

		activateUi();
	}
	trialPrompt() {
		for (const p of this.piclist) { toggleSelectionOfPicture(p); }
		this.piclist = [];
		sayTryAgain();
		return 10;
	}
	interact(ev) {
		ev.cancelBubble = true;
		if (!canAct()) return;

		let id = evToClosestId(ev);
		let pic = firstCond(Pictures, x => x.div.id == id);
		playSound('hit')
		removePicture(pic);
		maLayout(Pictures, dTable);

		if (Goal.pics.includes(pic)){console.log('YES!!!!'); Goal.sammler.push(pic);}

		if (Goal.pics.length == Goal.sammler.length) evaluate(true);
		else if (!Goal.pics.includes(pic)) evaluate(false);
		// if (pic.label == Goal.label) evaluate(false);
		// else { removePicture(pic);maLayout(Pictures,dTable) }

	}
	eval(isCorrect) {
	//	console.log('eval', isCorrect);
		// console.log('piclist', this.piclist)
		Selected = { piclist: this.piclist, feedbackUI: dTable };
		return isCorrect;
	}
}
