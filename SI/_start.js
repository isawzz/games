window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();

	hide(dSettings);
	addEventListener('dblclick', (ev) => {
		toggleSettings();
		// if (ev.ctrlKey && ev.key == 'q') {
		// 	toggleSettings();
		// }
	});

	initTable();
	initSidebar();
	if (immediateStart) onClickStartButton();

}













