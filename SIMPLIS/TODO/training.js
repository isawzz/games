
function trainNextLanguage() {
	currentLanguage = 'D'; 
	console.log('switching language to',currentLanguage)
	//startGame();
}
function trainNextGroup() {
	const trainingGroups = ['kitchen', 'math', 'drink', 'misc',
		'activity', 'animal', 'body', 'clock', 'emotion', 'family', 'fantasy', 'food', 'fruit', 'game', 'gesture',
		'object', 'person', 'place', 'plant', 'punctuation', 'role', 'shapes', 'sport', 'sternzeichen', 'symbols', 'time', 'toolbar',
		'transport', 'vegetable'];
	let cats = currentCategories[0];
	let idx = trainingGroups.indexOf(cats);
	idx += 1;
	if (idx < trainingGroups.length) { currentCategories = [trainingGroups[idx]]; startGame(); }
}