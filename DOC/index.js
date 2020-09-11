var DOC_UIS;
var DOC_vault;
var DOC_dvIndex;
var DOC_CURRENT_PATH_INDEX;
var DOC_CURRENT_FUNC;


async function createDocs(collapsed = true) {
	let dv = DOC_vault = await createVault();
	DOC_UIS = {};

	let pkeys = Object.keys(dv).map(x => dv[x].filename);
	pkeys.sort();
	let lst = dict2list(dv);
	let sortedlst = lst.sort(fieldSorter(['filename']));
	//repair path indices
	i = 0;
	for (const item of sortedlst) {
		let id = item.id;
		let x = dv[item.id];
		x.index = i;
		x.idLink = 'a_path_' + i;
		x.idPathContainer = 'div_path_' + i;
		i += 1;
	}

	//repair func indices
	for (const p in dv) {
		let funcDict = dv[p].funcDict;
		let keys = Object.keys(funcDict);
		keys.sort();
		dv[p].funcIndex = keys;
		for (let i = 0; i < keys.length; i++) { funcDict[keys[i]].index = i; }
	}
	//console.log(dv)
	DOC_dvIndex = sortedlst.map(x => x.id);
	//console.log('collapsed', collapsed)
	createCollapsibles(dv, DOC_dvIndex, collapsed);

	setCurrentPath('assetHelpers.js');

	//new ResizeObserver(outputsize).observe(textbox)
	//resizeObserver.observe(mBy('sidebar'));
	//maxWidthPreserver.add('sidebar');
}

function setCurrentPath(fname) {
	//console.log(fname,DOC_vault)
	let pathDictionary = DOC_vault;
	let key = firstCondDict(pathDictionary, x => sameCaseInsensitive(x.filename, fname));
	let entry = DOC_vault[key];
	let index = entry.index;
	setCurrentPathIndex(index);
}
function setCurrentPathIndex(i) {
	if (i == DOC_CURRENT_PATH_INDEX) {
		console.log('current path already set to', i);
		return;
	}
	//das muss besser gehen als ueber die id!
	let curPath = isdef(DOC_CURRENT_PATH_INDEX) ? DOC_dvIndex[DOC_CURRENT_PATH_INDEX] : null;
	let newPath = i >= 0 && i <= DOC_dvIndex.length ? DOC_dvIndex[i] : null;
	if (curPath) {
		let curEntry = DOC_vault[curPath];
		let idDiv = curEntry.idPathContainer;
		hide(idDiv);
	}
	if (newPath) {
		let newEntry = DOC_vault[newPath];
		let idDiv = newEntry.idPathContainer;
		show(idDiv);
		DOC_CURRENT_PATH_INDEX = i;
	}
}
function addComment(s, dParent) { return mMultiline(s, 2, dParent); }
function getLinkContainerId(linkId) { return 'd' + linkId; }
function createCollapsibles(dv, lst, collapsed) {
	let pageContent = mBy('pageContent');
	for (const item of lst) {
		let path = item;
		let info = dv[path];
		let coll = genCollapsible(path, dv[path]);
		dv[path].collapsible = coll;
		DOC_UIS[coll.id] = dv[path];

		let signatureLinkContainer = mDiv(mBy('menu'));
		signatureLinkContainer.id = getLinkContainerId(coll.id);

		let pathContainer = mDiv(pageContent);
		pathContainer.id = info.idPathContainer;

		let pathTitle = mDiv(pathContainer);
		pathTitle.innerHTML = info.filename;
		pathTitle.classList.add('pathTitle');
		let pathContent = mDiv(pathContainer);

		if (!isEmpty(info.topComment)) addComment(info.topComment, pathContent);

		pathContent.classList.add('comments');

		for (const signature of dv[path].funcIndex) {

			let entry = dv[path].funcDict[signature];
			let comments = entry.comments;
			//console.log('comments for signature', signature, 'entry', entry, typeof comments, comments)

			let l = genLink(signature, signatureLinkContainer); //macht den link in der sidebar
			let functionName = stringBefore(signature, '(').trim();
			l.id = 'a_' + entry.index + '@' + entry.path;
			entry.idLink = l.id;
			entry.idDiv = 'div' + entry.index + '@' + entry.path;

			let fDiv0 = mDiv(pathContent);
			fDiv0.id = entry.idDiv;
			let fDiv = mCreate('p');
			fDiv0.appendChild(fDiv);
			let fSignature = mDiv(fDiv);
			fSignature.innerHTML = signature;
			fSignature.classList.add('signature');

			let fComments = mDiv(fDiv);
			// // fComments.innerHTML = comments;
			if (!isEmpty(comments)) addComment(comments, fComments);
			fComments.classList.add('comments');
		}

		hide(pathContainer);
	}
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", toggleCollapsible);
	}
	if (collapsed) collapseAll();

}
function uncollapseAll() {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		let elem = coll[i];
		if (!isVisible(getLinkContainerId(elem.id))) fireClick(elem);
	}
}
function collapseAll() {
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		let elem = coll[i];
		if (isVisible(getLinkContainerId(elem.id))) fireClick(elem);
	}
	//maxWidthPreserver.reset('sidebar');
}
function onClickFilter() {
	console.log('clicked filter!')
}
function onClickTop() {
	mBy('sidebar').scrollTo(0, 0); //console.log('clicked filter!')
	mBy('pageContent').scrollTo(0, 0); //console.log('clicked filter!')
}

function onClickCollapse() { collapseAll(); }
function onClickExpand() { uncollapseAll(); }
function showCollapsibleContent(ev) {
	let id = evToClosestId(ev);
	mBy('pageContent').scrollTo(0, 0);
	ev.cancelBubble = true;
	setCurrentPathIndex(firstNumber(id));
}
function showSignatureContent(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;
	let ifunc = firstNumber(id);
	let path = stringAfter(id, '@');
	let pathEntry = DOC_vault[path];
	let funcName = pathEntry.funcIndex[ifunc];
	let funcEntry = pathEntry.funcDict[funcName];
	let divPath = document.getElementById(pathEntry.idPathContainer);
	if (!isVisible(divPath)) setCurrentPath(pathEntry.filename);
	let funcDiv = mBy(funcEntry.idDiv);
	funcDiv.scrollIntoView(true);
}
function toggleCollapsible(ev) {
	let b = ev.target; //das ist scheinbar 'this' bei aufruf!
	b.classList.toggle("active");
	var content = getLinkContainerId(b.id);
	if (isVisible(content)) hide(content); else show(content);
}
function genLink(fname, dParent) {
	let content = stringBefore(fname, '(');
	//console.log('fname is',content)
	let b = mLink(content, '#' + content, dParent, { padding: '0px 2px' }, null);
	b.addEventListener('click', showSignatureContent);
	return b;
}
function genCollapsible(path, info) {
	let caption = stringAfterLast(path, '/');
	let classes = ['collapsible'];
	let dParent = mBy('menu');
	let b = mButton(caption, null, dParent, {}, classes);
	b.id = info.idLink;

	let bView = maPicButton('search', e => showCollapsibleContent(e), b, { float: 'right', w:25, padding:2, margin: 2, rounding:4 });

	bView.addEventListener('mouseenter', ev => {
		// let domel = ev.target;
		// domel.classList.remove('picButton');
		// domel.classList.add('picButtonHover');
		// console.log('==>classList',domel.classList);//,'\norig color',domel.origColor,domel);
		ev.stopPropagation = true;
	});
	bView.addEventListener('mouseleave', ev => {
		// let domel = ev.target;
		// domel.classList.remove('picButtonHover')
		// domel.classList.add('picButton');
		// console.log('==>classList',domel.classList);
		ev.stopPropagation = true;
	});

	b.style.padding = '4px';
	return b;
}
