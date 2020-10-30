window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();
	initTable();
	initSidebar();
	setGroup(startingCategory);
	if (immediateStart) onClickStartButton();
}













