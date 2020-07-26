async function createDocs() {
	//console.log('creating docs!');

	let vault = await createVault();
	//console.log('vault', vault);

	createCollapsibles(vault);

	activateCollapsibles();
}

function createCollapsibles(vault) {
	for (const p in vault) {
		let coll = genCollapsible(p);
		let linkContainer = mDiv(mBy('menu'));
		let contentContainer = mDiv(mBy('menu'));
		for (const signature in vault[p]) {
			//console.log(signature);
			let l = genLink(signature, linkContainer); //macht den link in der siderbar
			
			//soll ich hier den content von der func einfuegen???
			let c=genContent(signature,)
		}
	}
}

function activateCollapsibles(isOpen = true) {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", toggleCollapsible);
		if (isOpen) fireClick(coll[i]);
	}

}
function uncollapseAll() {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		let elem = coll[i];
		if (!isVisible(elem.nextElementSibling)) fireClick(elem);
	}
}
function collapseAll() {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		let elem = coll[i];
		if (isVisible(elem.nextElementSibling)) fireClick(elem);
	}
}
function toggleCollapsible() {
	this.classList.toggle("active");
	var content = this.nextElementSibling;
	if (content.style.display === "block") {
		content.style.display = "none";
	} else {
		content.style.display = "block";
	}
}

function genLink(fname,dParent) {
	let content = fname;
	// content = content.replace('(','( ');
	// content = content.replace(')',' )');

	//console.log('content', content, fname)
	//let dParent = mBy('menu');
	//console.log(d,dParent)
	let b = mLink(content, '#'+content, dParent, {padding:'0px 2px'}, null);



	// let b = mLink(content, null, dParent,{'font-size':'24pt', padding:2}, ['wordwrap']);
	//console.log(b);
	return b;
}
function genCollapsible(path) {
	let caption = stringAfterLast(path, '/');
	//console.log('caption', caption, path)
	let classes = ['collapsible'];
	let dParent = mBy('menu');
	//console.log(d,dParent)
	let b = mButton(caption, null, dParent, {}, classes);
	return b;
}
