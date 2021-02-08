class GNamit extends Game {
	constructor(name) { super(name); }
	startGame(){	G.correctionFunc = showCorrectPictureLabels;	}
	prompt() {
		showPicturesSpeechTherapyGames(() => fleetingMessage('just enter the missing letters!'), {}, { showLabels: false });

		Goal = {pics:Pictures};

		//setGoal();
		showInstruction('', Settings.language == 'E' ? 'drag labels to pictures' : "ordne die texte den bildern zu", dTitle, true);
		mLinebreak(dTable);

		setDropZones(Pictures, (pic) => console.log('clicked', pic));

		mLinebreak(dTable, 50);

		this.letters = createDragWords(Pictures, evaluate);
		mLinebreak(dTable, 50);

		mButton('Done!', evaluate, dTable, { fz: 32, matop: 10, rounding:10, padding:16, border:8 },['buttonClass']);

		activateUi();

	}
	trialPrompt() {
		sayTryAgain();
		setTimeout(() => {
			this.inputs.map(x => x.div.innerHTML = '_')
			// mClass(d, 'blink');
		}, 1500);

		return 10;
	}
	eval() {
		this.piclist = Pictures;
		Selected = { piclist: this.piclist, feedbackUI: this.piclist.map(x => x.div), sz: getBounds(this.piclist[0].div).height };
		for (const p of Pictures) {
			let label = p.label;
			console.log(label)
			if (nundef(p.div.children[1])) {
				console.log('you did not finish!!!!!!!');
				return false;
			} else {
				let text = p.div.children[1].innerHTML;
				console.log('label', label, 'text', text);
				//Selected.feedbackUI = p.div;
				if (text != label) {Goal=p;Selected.feedbackUI = p.div;return false;}
			}
		}
		// Selected.feebackUI=Pictures.map(x=>x.div);
		return true;
		//Selected = { answer: w, reqAnswer: word, feedbackUI: Goal.div }; //this.inputs.map(x => x.div) };
		//console.log(Selected);
		//return w == word;
	}

}





