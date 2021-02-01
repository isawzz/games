
class APasscode{
	present(dParent){
		showPasscode(dParent);//showTest00();

		this.goal = Goal;

		TOMain = setTimeout(anim1, 300, Goal, 500, () => {
			mButton('Got it!', promptAddon, dParent, { fz: 42, matop: 10 });
		});
	
	}
	prompt(dParent){
		let keys = [this.goal.key].concat(getRandomKeys(3));
		shuffle(keys);
		let iGoal = keys.indexOf(this.goal.key);
		GroupCounter = 0;
		let res = getPictureItems(null, { border: '3px solid pink' }, { rows: 2 }, keys);
		Pictures = res.items;
		Goal = Pictures[iGoal];

		let w = (Settings.language == 'E' ? 'the passcode' : 'das Codewort');
		let d_title = mDiv(dParent);
		showInstruction('', 'click '+w, d_title, true);

		let d_pics = mDiv(dParent);
		presentItems(Pictures, d_pics, res.rows);
		mRemoveClass(d_pics, 'flexWrap')
	
	}
	activate(){}
	eval(){}
	positive(){}
	negative(){}
}



















