class AddonClass extends LiveObject {
	constructor(dbInfo, userInfo) {
		console.log('haaaaaaaaaaaaaaaaalllllllllllllooooooooooooooo', dbInfo, userInfo)
		super();
		copyKeys(dbInfo, this);
		copyKeys(userInfo, this);
		if (nundef(this.tNext)) this.tNext = this.tStart;
		this.running = false;
		this.startTime = Date.now();
		this.callback = this.dScreen = this.dContent = null;
	}
	init() {
		//present for the first time!
		console.log('presenting addon information')
		[this.dScreen, this.dContent] = addonCreateScreen();
		this.present(this.dContent);
	}
	present(){}
	prompt() {
		console.log('prompting user to do something')
	}
	isTimeForAddon() {
		if (!this.running) { return this.immediateStart; }

		let elapsed = Date.now() - this.startTime;
		let waitingTime = this.tNext;
		console.log('elapsed', elapsed, 'total', waitingTime);
		return elapsed >= waitingTime;
	}
	run() {
		if (this.running) { this.prompt(); } else this.init();
		//this.activate();

	}

}
class APasscode extends AddonClass {
	constructor(dbInfo, userInfo) {
		super(dbInfo, userInfo);
		this.needNewPasscode = true;
		this.fPresent = showPasscode;
	}
	clear() { clearTimeout(this.TO); }

	present(dParent) {
		if (this.needNewPasscode) {
			//this.time = 5000;
			this.startTime = Date.now();
			this.needNewPasscode = false;
			this.fPresent(dParent);//showTest00();

			this.goal = Goal;
			this.passcode = this.goal.label;
			mButton('Got it!', promptAddon, dParent, { fz: 42, matop: 10 });

			this.TO = setTimeout(anim1, 300, Goal, 500, () => {
				//console.log('animation done!')	
			});
		} else {
			this.tNext *= this.tFactor;
			this.startTime = Date.now();
			Goal = { label: this.passcode }
			promptAddon();
		}
	}
	prompt(dParent) {
		let keys = getRandomKeysIncluding(AD.numPics, this.goal.key, 'all');
		console.log('keys', keys);

		let iGoal = keys.indexOf(this.goal.key);
		let res = getPictureItems(addonEvaluate, undefined, { rows: 2, showLabels: true }, keys);
		Pictures = res.items;
		Goal = Pictures[iGoal];

		let d_title = mDiv(dParent);
		showInstruction('', 'click ' + (Settings.language == 'E' ? 'the passcode' : 'das Codewort'), d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(Pictures, d_pics, res.rows);
		//mRemoveClass(d_pics, 'flexWrap') ???????

		addonActivateUi();

	}
	trialPrompt() {
		// if (nundef(AD.trialNumber)) AD.trialNumber = 1; else AD.trialNumber += 1;
		let hintLength, spoken;
		if (AD.trialNumber > this.passcode.length * 2) {
			hintLength = this.passcode.length;
			spoken = 'click ' + this.passcode.toUpperCase() + '!!!';
		} else if (AD.trialNumber > this.passcode.length * 2 - 1) {
			hintLength = this.passcode.length;
			spoken = (Settings.language == 'E' ? 'REMEMBER ' : 'MERKE DIR ') + this.passcode.toUpperCase() + '!!!';
		} else if (AD.trialNumber > this.passcode.length) {
			hintLength = (AD.trialNumber - this.passcode.length);
			let letters = this.passcode.substring(0, hintLength);
			let letters1 = letters.split();
			console.log('letters', letters, 'letters1', letters1);
			console.log('===>', letters1.join(' '));
			spoken = (Settings.language == 'E' ? 'the passcode starts with' : 'das Codewort beginnt mit') + ' ' + letters1.join(', ');
			// spoken = Settings.language == 'E' ? 'look at the hint!' : 'hier ein Tipp!'
		} else {
			hintLength = AD.trialNumber;
			spoken = null;// Settings.language == 'E' ? 'look at the hint!' : 'hier ein Tipp!'
		}
		addonShowHint('Hint: ' + this.passcode.substring(0, hintLength), spoken);
		addonActivateUi();
	}
	activate() { }
	eval(ev) {
		ev.cancelBubble = true;
		let item = findItemFromEvent(Pictures, ev);

		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };
		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		console.log('eval addon:', item.label, Goal.label)
		if (item.label == Goal.label) { return true; } else { return false; }

	}
	positive() {
		console.log('positive: should go back to callback!');
		AD.trialNumber = null;
		delete AD.dHint;
	}
	negative() {
		console.log('negative: should start a lesson in memory!!!!!!!', AD.trialNumber);
		if (nundef(AD.trialNumber)) AD.trialNumber = 1; else AD.trialNumber += 1;
		console.log('nach negative', AD.trialNumber)
		// if (nundef(AD.trialNumber)) AD.trialNumber = 1;
		//or maybe just give hints over hints over hints......
	}
	getHint(i) {
		return i < Goal.label.length ? Goal.label.substring(0, i) : Goal;
	}
}

class AAddress extends APasscode {
	constructor() {
		super();
		this.fPresent = showPasscodeAddress;
	}
	clear() { clearTimeout(this.TO); Speech.setLanguage(Settings.language); }
	prompt(dParent) {

		Speech.setLanguage('E');
		let d_title = mDiv(dParent);
		showInstruction('', 'enter your address', d_title, true);

		let d_inp = mDiv(dParent, { padding: 25 });
		//let d = this.input = mInput('', '1 7   44,8n e3', d_inp, { align: 'center' });
		// let d = this.input = mInput('', '17448 ne 98th way Redmond 9805sss', d_inp, { align: 'center' });
		let d = this.input = mInput('', '', d_inp, { align: 'center' });
		//let d = this.input = mInput('', Goal.label, d_inp, { align: 'center' });
		d.id = 'inputAddress';
		mStyleX(d, { w: 600, fz: 24 });
		this.defaultFocusElement = d.id;

		let dHint = addonShowHint('w ');
		//console.log('dHint',dHint)
		mStyleX(dHint, { opacity: 0 });

		this.nCorrect = 0;
		addonActivateUi();
	}
	trialPrompt() {
		let oldHintLength = isdef(this.hintLength) ? this.hintLength : 0;
		if (nundef(this.hintLength)) this.hintLength = 1;
		this.input.value = this.correctPrefix;

		let progress = this.correctPrefix.length > this.nCorrect;
		if (this.correctPrefix.length > this.nCorrect) {
			//user got more good letters. hint length will be reduced to 1
			this.hintLength = 1;
			this.nCorrect = this.correctPrefix.length;
		} else if (this.hintLength < Goal.label.length) this.hintLength += 1;

		let wr = substringOfMinLength(Goal.label, this.correctPrefix.length, this.hintLength);
		this.hintLength = wr.length;
		//console.log('old hintLength',oldHintLength,'new hintLength is:',this.hintLength);

		if (oldHintLength == this.hintLength && !progress) {
			//Speech.setLanguage(Settings.language)
			sayRandomVoice('complete the address!')
		}

		addonShowHint('Hint: ' + wr);
		addonActivateUi();
	}
	activate() {
		window.onclick = () => mBy(this.defaultFocusElement).focus();
		this.input.onkeyup = ev => {
			//if (!canAct()) return;
			if (ev.key === "Enter") {
				ev.cancelBubble = true;
				//console.log('clicked enter!!!');
				addonEvaluate(ev);
			}
		};
		this.input.focus();
	}
	eval(ev) {
		let correctPrefix = this.correctPrefix = getCorrectPrefix(Goal.label, this.input.value);
		return correctPrefix == Goal.label;
	}
	positive() {
		//console.log('positive: should go back to callback!');
		AD.trialNumber = null;
		delete AD.dHint;
	}
	negative() {
		//console.log('negative: should start a lesson in memory!!!!!!!', AD.trialNumber);
		if (nundef(AD.trialNumber)) AD.trialNumber = 1; else AD.trialNumber += 1;
		//console.log('nach negative', AD.trialNumber)
		// if (nundef(AD.trialNumber)) AD.trialNumber = 1;
		//or maybe just give hints over hints over hints......
	}
	getHint(i) {
		return i < Goal.label.length ? Goal.label.substring(0, i) : Goal;
	}
}

















