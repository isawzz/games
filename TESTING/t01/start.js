window.onload = loadSIMA_local(_start);;
async function loadSIMA_local(callback) {
	//console.log('...loading...');
	let url = SERVERURL;
	fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	}).then(async data => {
		let sData = await data.json();
		DB = sData[0];
		//console.log(DB)
		//hier kann ich assets laden!!!
		if (CLEAR_LOCAL_STORAGE) localStorage.clear();
		await loadAssetsSIMA('../../assets/');

		if (isdef(callback)) callback();
	});
}
function _start() {
	console.log('DONE!', symbolDict);
	//test01();test02();	test03();
	test01a();
}
function test01(){
	let dropzones = document.querySelectorAll('.dropzone');

	let droppable = new Draggable.Droppable(
		dropzones,
		{
			draggable: '.draggable',
			dropzone: '.dropzone',
			mirror: { constrainDimensions: true }
		}
	);
}
function test01b(){

}
function test01a(){
	let dropzones = document.querySelectorAll('.dropzone');

	dropzones = Array.from(dropzones);
	draggable = mBy('o1');

	let droppable = new Draggable.Droppable(
		dropzones,
		{
			draggable: '#o1', // geht nur mit selector!!!! //draggable, //'.draggable',
			dropzone: '.dropzone',
			mirror: { constrainDimensions: true }
		}
	);
}
function test02(){
	// //mBy('hallo').ondragover = (e)=>mClass(document.body,'dragging');
	// //mBy('hallo').ondragleave = (e)=>mRemoveClass(document.body,'dragging')

	// document.addEventListener('dragover', (e) => e.preventDefault(), true)
	// document.addEventListener('dragleave', (e) => e.preventDefault(), true)
	// document.addEventListener('dragenter', (e) => e.preventDefault(), true)
	// document.addEventListener('drop', (e) => e.preventDefault(), true)

	// var obj = mBy('ironman');
	// // obj.addEventListener('dragstart', (e) => e.preventDefault(), true)
	// // obj.addEventListener('drag', (e) => e.preventDefault(), true)
	// // obj.addEventListener('dragend', (e) => e.preventDefault(), true)

	// obj.ondragstart = function (e) { e.preventDefault(); document.body.style.cursor = 'help'; console.log("dragstart"); };
	// obj.ondrag = function (e) { e.preventDefault(); obj.style.cursor = 'grab'; console.log("dragenter"); };
	// obj.ondragend = function (e) { e.preventDefault(); obj.style.cursor = 'grab'; console.log("dragleave"); };
}
function test03(){
	let doppable = UniqueDropzone();
}

function UniqueDropzone() {
  const containers = document.querySelectorAll('.dropzone');

  if (containers.length === 0) {
    return false;
  }

  const droppable = new Draggable.Droppable(containers, {
    draggable: '.draggable',
    dropzone: '.dropzone',
    mirror: {
      constrainDimensions: true,
    },
  });

  let droppableOrigin;

  // --- Draggable events --- //
  droppable.on('drag:start', (evt) => {
    droppableOrigin = evt.originalSource.parentNode.dataset.dropzone;
  });

  droppable.on('droppable:dropped', (evt) => {
    if (droppableOrigin !== evt.dropzone.dataset.dropzone) {
      evt.cancel();
    }
  });

  return droppable;
}
