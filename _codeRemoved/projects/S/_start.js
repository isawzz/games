window.onload = SPEECHStart;

async function SPEECHStart() {
	USE_LOCAL_STORAGE = true;
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();
	initTable();
	initSidebar();
	setGroup(startingCategory);
	if (immediateStart) onClickStartButton();
}













