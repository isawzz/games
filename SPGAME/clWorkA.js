
class APasscode {
	constructor() {
		this.needNewPasscode = true;
	}
	clear() { clearTimeout(this.TO); }

	isTimeForAddon() {
		if (nundef(this.time)) return true;
		let elapsed = Date.now() - this.startTime;
		let timeTotal = this.time;
		console.log('elapsed',elapsed,'total',timeTotal)
		return Date.now() - this.startTime >= this.time;
	}
	present(dParent) {
		if (this.needNewPasscode) {
			this.time = 5000;
			this.startTime = Date.now();
			this.needNewPasscode = false;
			showPasscode(dParent);//showTest00();

			this.goal = Goal;

			this.TO = setTimeout(anim1, 300, Goal, 500, () => {
				mButton('Got it!', promptAddon, dParent, { fz: 42, matop: 10 });
			});
		}else{
			this.time*=2;
			this.startTime = Date.now();
			promptAddon();
		}
	}
	prompt(dParent) {
		let keys = getRandomKeys(4);
		if (!keys.includes(this.goal.key)) {
			//randomly replace one of the keys by this one!
			let i = randomNumber(0, 3);
			keys.splice(i, 1, this.goal.key);
		}
		shuffle(keys);

		console.log('keys', keys);

		let iGoal = keys.indexOf(this.goal.key);
		GroupCounter = 0;
		let res = getPictureItems(addonEvaluate, { border: '3px solid pink' }, { rows: 2 }, keys);
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
	activate() { }
	eval(ev) {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		let i = firstNumber(id);
		let item = Pictures[i];
		Selected = { pic: item, feedbackUI: item.div, sz: getBounds(item.div).height };

		console.log('Selected', Selected.pic.key, 'id', id)

		Selected.reqAnswer = Goal.label;
		Selected.answer = item.label;

		console.log('eval addon:', item.label, Goal.label)
		if (item.label == Goal.label) { return true; } else { return false; }

	}
	positive() {
		console.log('positive: should go back to callback!')
	}
	negative() {
		console.log('negative: should start a lesson in memory!!!!!!!');
		//or maybe just give hints over hints over hints......
	}
	getHint(i) {
		return i < Goal.label.length ? Goal.label.substring(0, i) : Goal;
	}
}


















