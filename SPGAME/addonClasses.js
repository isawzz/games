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
	//#region internal
	_createDivs(){
		this.dInstruction = mDiv(this.dContent);
		this.dMain = mDiv(this.dContent);
		this.dHint = mDiv(this.dContent); this.dHint.innerHTML = 'hallo'; this.dHint.style.opacity=0;
	}
	_createScreen() {
		show(mBy('dAddons'));
		let bg = colorTrans('silver', .25);
		let dScreen = mScreen(mBy('dAddons'), { bg: bg, display: 'flex', layout: 'vcc' });
		let dContent = mDiv(dScreen, { display: 'flex', layout: 'vcs', fg: 'contrast', fz: 24, bg: 'silver', patop: 50, pabottom: 50, matop: -50, w: '100vw' });
		return [dScreen, dContent];
	}
	//#endregion
	exit(){
		hide('dAddons');
		this.tNext *= this.tFactor;
		this.startTime = Date.now();
		//console.log('tNext for addon',this.tNext);
		this.clear();
		this.callback();
	}
	init() {
		//console.log('addon init!!!!');
		[this.dScreen, this.dContent] = this._createScreen();
		this._createDivs();
		this.running = true;
		this.presentInit();
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
	presentInit() { console.log('presenting initial information'); }
	presentPrompt() { console.log('prompting user to do something') }
	prompt() {
		clearElement(this.dContent);
		this._createDivs();
		this.presentPrompt();
		this.activate();
	}
	processInput(){
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
	trialPrompt() {
		let [wr,sp] = this.getHint();
		this.hintLength = wr.length;

		if (isdef(sp))	sayRandomVoice(sp);

		this.dHint.innerHTML = 'Hint: '+wr;  this.dHint.style.opacity=1;

		this.activate();
	}

}

class APasscode extends AddonClass {
	constructor(dbInfo, userInfo) {
		super(dbInfo, userInfo);
		this.needNewPasscode = true;
	}
	presentInit() {
		let keys = getRandomKeysFromGKeys(1); // choose(KeySets.nemo, 1);
		[this.pictures, this.rows] = getPictureItems(null, {}, { rows: 1 }, keys);

		this.goal = this.pictures[0];
		this.passcode = this.goal.label;

		let dParent = this.dContent;
		let d_title = mDiv(dParent);
		showInstruction(this.goal.label, Settings.language == 'E' ? 'the passcode is' : 'das Codewort ist', d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(this.pictures, d_pics, this.rows);

		return d_pics;
	}
	presentPrompt() {
		let keys = getRandomKeysIncluding(this.numPics, this.goal.key, 'all');
		//console.log('keys', keys);

		let iGoal = keys.indexOf(this.goal.key);
		[this.pictures, this.rows] = getPictureItems(this.processInput.bind(this), undefined, { rows: 2, showLabels: true }, keys);
		this.goal = this.pictures[iGoal];

		showInstruction('', 'click ' + (Settings.language == 'E' ? 'the passcode' : 'das Codewort'), this.dInstruction, true);

		presentItems(this.pictures, this.dMain, this.rows);

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
	getHint() {
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
		return [this.passcode.substring(0, hintLength),spoken];
	}
}

class AAddress extends APasscode {
	constructor(dbInfo, userInfo) {
		super(dbInfo, userInfo);
	}
	clear() { super.clear(); Speech.setLanguage(Settings.language); }
	presentInit() {
		this.goal = { label: '17448 NE 98th Way Redmond 98052' };
		Speech.setLanguage('E')
		let wr = 'your address is:';
		let sp = 'your address is 1 7 4 4 8 - North-East 98th Way - Redmond, 9 8 0 5 2';

		showInstruction(this.goal.label, wr, this.dInstruction, true, sp, 12);

		this.goal.div = mText(this.goal.label, this.dMain, { fz: 40 });

	}
	presentPrompt() {
		Speech.setLanguage('E');
		showInstruction('', 'enter your address', this.dInstruction, true);

		let val = ''; // '1 7   44,8n e3' | '17448 ne 98th way Redmond 9805sss' | this.goal.label
		let d_inp = mDiv(this.dMain, { padding: 25 });
		let d = this.input = mInput('', val, d_inp, { align: 'center' });
		d.id = 'inputAddress';
		mStyleX(d, { w: 600, fz: 24 });
		this.defaultFocusElement = d.id;
		this.nCorrect = 0;
	}
	activate() {

		window.onclick = () => mBy(this.defaultFocusElement).focus();
		this.input.onkeyup = ev => {
			//console.log('hallo!!!!')
			if (ev.key === "Enter") {
				ev.cancelBubble = true;
				//console.log('clicked enter!!!');
				this.processInput(ev);
			}
		};
		this.input.focus();
		super.activate();
	}
	eval() {
		let correctPrefix = this.correctPrefix = getCorrectPrefix(this.goal.label, this.input.value);
		return correctPrefix == this.goal.label;
	}
	getHint(){
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
		let sp = oldHintLength == this.hintLength && !progress? 'complete the address':null;
		return [wr,sp];
	}
}




