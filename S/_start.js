window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();
	initTable();
	setGroup(startingCategory);
	if (immediateStart) onClickStartButton();
}


//helpers












