window.onload = _loader;
window.onunload = saveServerData;

async function _loader() { loadSIMA(_start); }
async function _start() {
	loadUser(); initTable(); initSidebar(); initAux();

	console.log('table', dTable)
	let inp = mInput(dTable, { val: 'hallo', classes: ['editableText'] });



}









