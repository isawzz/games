
class APasscode {
	constructor() {
		this.needNewPasscode = true;
		this.fPresent = showPasscode;
	}
	clear() { clearTimeout(this.TO); }

	isTimeForAddon() {
		if (nundef(this.time)) return true;
		let elapsed = Date.now() - this.startTime;
		let timeTotal = this.time;
		console.log('elapsed', elapsed, 'total', timeTotal)
		return Date.now() - this.startTime >= this.time;
	}
	present(dParent) {
		if (this.needNewPasscode) {
			this.time = 5000;
			this.startTime = Date.now();
			this.needNewPasscode = false;
			this.fPresent(dParent);//showTest00();

			this.goal = Goal;
			this.passcode = this.goal.label;

			this.TO = setTimeout(anim1, 300, Goal, 500, () => {
				mButton('Got it!', promptAddon, dParent, { fz: 42, matop: 10 });
			});
		} else {
			this.time *= 2;
			this.startTime = Date.now();
			promptAddon();
		}
	}
	prompt(dParent) {
		let keys = getRandomKeysIncluding(AD.numPics,this.goal.key,'all');
		console.log('keys', keys);

		let iGoal = keys.indexOf(this.goal.key);
		let res = getPictureItems(addonEvaluate, { border: '3px solid yellow' }, { rows: 2, showLabels: true }, keys);
		Pictures = res.items;
		Goal = Pictures[iGoal];

		let w = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
		let d_title = mDiv(dParent);
		showInstruction('', 'click ' + w, d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(Pictures, d_pics, res.rows);
		mRemoveClass(d_pics, 'flexWrap')

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
		let item = findItemFromEvent(Pictures,ev);

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
	prompt(dParent) {

		let html = `<form id="calculator" onSubmit="return multiply()" method="post">
			<input type="number" id="first"> *
			<input type="number" id="second">
			<input type="submit"> = <span id="answer"></span>
		</form>`;
		let elem = createElementFromHTML(html);
		mAppend(dParent, elem);

		//hier soll ein input zeigen und sagen enter the passcode!
		let d_title = mDiv(dParent);
		showInstruction('', 'enter your address', d_title, true);

		let d = this.input = mInput('', '', dParent, { align: 'center' });
		d.type = 'submit';
		mStyleX(d, { w: 600, fz: 22 });
		d.focus();

		mButton('Submit!', () => addonEvaluate(this.input.value), dParent, { fz: 42, matop: 10 });

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
	activate() { this.input.focus(); }
	eval(txt) {
		console.log(txt);

		let req = Goal.label.toLowerCase();
		let answer = txt.toLowerCase();

		let req1 = removeNonAlphanum(req);
		let answer1 = removeNonAlphanum(answer);

		let common = findCommonPrefix(req1, answer1);
		//now find common prefix
		console.log(req1, answer1, common);
		//return true;

		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		console.log('Selected', Selected.pic.key, 'id', id)

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

















