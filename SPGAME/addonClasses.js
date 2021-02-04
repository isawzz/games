class AddonClass extends LiveObject {
	constructor(dbInfo, userInfo) {
		super();
		copyKeys(dbInfo, this);
		copyKeys(userInfo, this);
		if (nundef(this.tNext)) this.tNext = this.tStart;
		this.running = false;
		this.startTime = Date.now();
		this.callback = this.dScreen = this.dContent = null;
	}
	exit(){
		hide('dAddons');
		this.tNext *= this.tFactor;
		this.startTime = Date.now();
		console.log('tNext for addon',this.tNext);
		this.clear();
		this.callback();
	}
	init() {
		//console.log('addon init!!!!');
		[this.dScreen, this.dContent] = addonCreateScreen();
		this.running = true;
		this.present();
		mButton('Got it!', this.prompt.bind(this), this.dContent, { fz: 42, matop: 10 });
		this.TOList.push(setTimeout(anim1, 300, this.goal, 500));
	}
	isTimeForAddon() {
		if (!this.running) { return this.immediateStart; }
		let elapsed = Date.now() - this.startTime;
		let waitingTime = this.tNext;
		//console.log('elapsed', elapsed, 'total', waitingTime);
		return elapsed >= waitingTime;
	}
	present() { console.log('presenting initial information'); }
	prompt() { console.log('prompting user to do something') }
	processUI(){
		if (!this.uiActivated) return;
		this.uiActivated = false;
		//console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyeah', arguments)
		let isCorrect = this.eval(...arguments);
		if (isCorrect) {
			this.positive();
			this.exit();
		} else {
			this.negative();
			this.trialPrompt();
		}
	}
	positive() {
		//console.log('positive: should go back to callback!');
		this.trialNumber = null;
		delete this.dHint;
	}
	negative() {
		//console.log('negative: should start a lesson in memory!!!!!!!', this.trialNumber);
		if (nundef(this.trialNumber)) this.trialNumber = 1; else this.trialNumber += 1;
		//console.log('nach negative', this.trialNumber)
	}
	run() { 
		show('dAddons');
		//console.log('running:',this.running);
		if (this.running) { this.prompt(); } else this.init();  
	}

}
class APasscode extends AddonClass {
	constructor(dbInfo, userInfo) {
		super(dbInfo, userInfo);
		this.needNewPasscode = true;
	}

	present() {
		//console.log('presentation div',dParent)
		let keys = getRandomKeysFromGKeys(1); // choose(KeySets.nemo, 1);
		[this.pictures, this.rows] = getPictureItems(null, {}, { rows: 1 }, keys);

		this.goal = this.pictures[0];
		this.passcode = this.goal.label;

		//console.log('pics', this.pictures)
		//console.log('this.goal', this.goal);

		let dParent = this.dContent;
		let d_title = mDiv(dParent);
		showInstruction(this.goal.label, Settings.language == 'E' ? 'the passcode is' : 'das Codewort ist', d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(this.pictures, d_pics, this.rows);

		return d_pics;
	}
	prompt() {
		let keys = getRandomKeysIncluding(this.numPics, this.goal.key, 'all');
		//console.log('keys', keys);

		let iGoal = keys.indexOf(this.goal.key);
		[this.pictures, this.rows] = getPictureItems(this.processUI.bind(this), undefined, { rows: 2, showLabels: true }, keys);
		this.goal = this.pictures[iGoal];

		let dParent = this.dContent;
		clearElement(dParent);
		//let dContent = addonContentDiv(this.hPrompt); // mDiv(this.div, { matop: 50, display: 'flex', layout: 'vcs', fg: 'contrast', fz: 24, bg:'navy', padding:25, w:'100vw'  });
		let d_title = mDiv(dParent);
		showInstruction('', 'click ' + (Settings.language == 'E' ? 'the passcode' : 'das Codewort'), d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(this.pictures, d_pics, this.rows);

		this.activate();

	}
	trialPrompt() {
		// if (nundef(this.trialNumber)) this.trialNumber = 1; else this.trialNumber += 1;
		let hintLength, spoken;
		if (this.trialNumber > this.passcode.length * 2) {
			hintLength = this.passcode.length;
			spoken = 'click ' + this.passcode.toUpperCase() + '!!!';
		} else if (this.trialNumber > this.passcode.length * 2 - 1) {
			hintLength = this.passcode.length;
			spoken = (Settings.language == 'E' ? 'REMEMBER ' : 'MERKE DIR ') + this.passcode.toUpperCase() + '!!!';
		} else if (this.trialNumber > this.passcode.length) {
			hintLength = (this.trialNumber - this.passcode.length);
			let letters = this.passcode.substring(0, hintLength);
			let letters1 = letters.split();
			//console.log('letters', letters, 'letters1', letters1);
			//console.log('===>', letters1.join(' '));
			spoken = (Settings.language == 'E' ? 'the passcode starts with' : 'das Codewort beginnt mit') + ' ' + letters1.join(', ');
			// spoken = Settings.language == 'E' ? 'look at the hint!' : 'hier ein Tipp!'
		} else {
			hintLength = this.trialNumber;
			spoken = null;// Settings.language == 'E' ? 'look at the hint!' : 'hier ein Tipp!'
		}
		addonShowHint('Hint: ' + this.passcode.substring(0, hintLength), spoken);
		addonActivateUi();
	}
	eval(ev) {
		ev.cancelBubble = true;
		let item = findItemFromEvent(this.pictures, ev);

		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };
		Selected.reqAnswer = this.goal.label;
		Selected.answer = item.label;

		//console.log('eval addon:', item.label, this.goal.label)
		if (item.label == this.goal.label) { return true; } else { return false; }

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
		//let d = this.input = mInput('', this.goal.label, d_inp, { align: 'center' });
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
		} else if (this.hintLength < this.goal.label.length) this.hintLength += 1;

		let wr = substringOfMinLength(this.goal.label, this.correctPrefix.length, this.hintLength);
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
		let correctPrefix = this.correctPrefix = getCorrectPrefix(this.goal.label, this.input.value);
		return correctPrefix == this.goal.label;
	}
	positive() {
		//console.log('positive: should go back to callback!');
		this.trialNumber = null;
		delete this.dHint;
	}
	negative() {
		//console.log('negative: should start a lesson in memory!!!!!!!', this.trialNumber);
		if (nundef(this.trialNumber)) this.trialNumber = 1; else this.trialNumber += 1;
		//console.log('nach negative', this.trialNumber)
		// if (nundef(this.trialNumber)) this.trialNumber = 1;
		//or maybe just give hints over hints over hints......
	}
}








































