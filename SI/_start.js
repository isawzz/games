window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();


	initTable();
	initSidebar();
	if (immediateStart) onClickStartButton();
}













