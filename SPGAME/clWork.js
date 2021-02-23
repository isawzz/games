class GStory extends Game {
	constructor(name) { super(name); }
	prompt() {
		let showLabels = G.showLabels == true && Settings.labels == true;
		//console.log(G.showLabels, Settings.labels, showLabels)
		myShowPics(evaluate, {}, { showLabels: showLabels });
		setGoal();
		showInstruction(Goal.label, 'click', dTitle, true);
		activateUi();
	}
}





