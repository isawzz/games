window.onload = _loader;
window.onunload = saveUser;


async function _loader() {
	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	} else { loadSIMA(_start); }

}
async function _start() {
	//mBy('hallo').ondragover = (e)=>mClass(document.body,'dragging');
	//mBy('hallo').ondragleave = (e)=>mRemoveClass(document.body,'dragging')

	document.addEventListener('dragover', (e) => e.preventDefault(), true)
	document.addEventListener('dragleave', (e) => e.preventDefault(), true)
	document.addEventListener('dragenter', (e) => e.preventDefault(), true)
	document.addEventListener('drop', (e) => e.preventDefault(), true)

	var obj = mBy('ironman');
	// obj.addEventListener('dragstart', (e) => e.preventDefault(), true)
	// obj.addEventListener('drag', (e) => e.preventDefault(), true)
	// obj.addEventListener('dragend', (e) => e.preventDefault(), true)

	obj.ondragstart = function (e) { e.preventDefault(); document.body.style.cursor='help'; console.log("dragstart"); };
	obj.ondrag = function (e) { e.preventDefault();obj.style.cursor='grab'; console.log("dragenter"); };
	obj.ondragend = function (e) { e.preventDefault();obj.style.cursor='grab'; console.log("dragleave"); };
}
