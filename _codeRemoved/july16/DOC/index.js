var DOC_UIS;
var DOC_vault;
var DOC_dvIndex;
var DOC_CURRENT_PATH_INDEX;
var DOC_CURRENT_FUNC;

async function createDocs(uncollapsed = false) {
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
		//console.log('WAS???',item,item.id,x);
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
	createCollapsibles(dv, DOC_dvIndex, uncollapsed);

	setCurrentPath('_rparse.js');

}
function setCurrentPath(fname) {
	let pathDictionary = DOC_vault;
	let key = firstCondDict(pathDictionary, x => x.filename == fname);
	//console.log(fname,key)
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
function addComment(s, dParent) {
	// s is a block!
	return mMultiline(s,2,dParent);
	// for (const ch of s) { console.log('ch=' + ch) }
	// s = s.replace('\t', '  ');
	// let el = mCreate('pre');
	// el.innerHTML = s;
	// mAppend(dParent, el);
	// //el.style.whiteSpace = 'pre'
	// convertPre2(el);
	// //convertPre1(el)
	// return el;
}
function getLinkContainerId(linkId){return 'd'+linkId;}
function createCollapsibles(dv, lst, uncollapsed) {
	let pageContent = mBy('pageContent');
	for (const item of lst) {
		let path = item;
		let info = dv[path];
		let coll = genCollapsible(path, dv[path]);
		dv[path].collapsible = coll;
		DOC_UIS[coll.id] = dv[path];

		let signatureLinkContainer = mDiv(mBy('menu'));
		signatureLinkContainer.id = getLinkContainerId(coll.id);
		//console.log(coll.id,signatureLinkContainer.id)

		let pathContainer = mDiv(pageContent);

		pathContainer.id = info.idPathContainer;

		let pathTitle = mDiv(pathContainer);
		pathTitle.innerHTML = info.filename;
		pathTitle.classList.add('pathTitle');
		let pathContent = mDiv(pathContainer);

		if (!isEmpty(info.topComment)) addComment(info.topComment, pathContent);
		//pathContent.innerHTML = info.topComment; //'comment anfang von file path.....';


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

			//console.log('funcDict entry',entry);
			//wie muss ich l.id setzen 
			//wie komme ich von l.id zu funcDict entry?
			//hier hab ich ja den index

			let fDiv0 = mDiv(pathContent);
			fDiv0.id = entry.idDiv;
			let fDiv = mCreate('p');
			fDiv0.appendChild(fDiv);
			let fSignature = mDiv(fDiv);
			fSignature.innerHTML = signature;
			fSignature.classList.add('signature');

			let fComments = mDiv(fDiv);
			fComments.innerHTML = comments;
			fComments.classList.add('comments');

			//console.log('link',l)
			//soll ich hier den content von der func einfuegen???

			//let c=genContent(signature,)
		}

		hide(pathContainer);
	}
	let coll = document.getElementsByClassName("collapsible");
	for (let i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", toggleCollapsible);
		//if (uncollapsed) fireClick(coll[i]);
	}

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
		//console.log('collapseAll',elem.id,getLinkContainerId(elem.id),isVisible(mBy(getLinkContainerId(elem.id))))
		//if (isVisible(mBy(getLinkContainerId(elem.id)))) fireClick(elem);
		if (isVisible(getLinkContainerId(elem.id))) fireClick(elem);
	}
}
function onClickFilter(){
	console.log('clicked filter!')
}
function onClickCollapse(){	collapseAll();}
function onClickExpand(){	uncollapseAll();}
function showCollapsibleContent(ev) {
	let id = evToClosestId(ev);
	mBy('pageContent').scrollTo(0,0);
	ev.cancelBubble = true;
	setCurrentPathIndex(firstNumber(id));
}
function showSignatureContent(ev) {
	let id = evToClosestId(ev);
	ev.cancelBubble = true;
	let ifunc = firstNumber(id);
	let path = stringAfter(id, '@');
	let pathEntry = DOC_vault[path];
	//console.log('clicked on',id,ifunc,path,'\n',pathEntry);
	let funcName = pathEntry.funcIndex[ifunc];
	let funcEntry = pathEntry.funcDict[funcName];
	//console.log('funcName',funcName,'funcEntry',funcEntry);
	//console.log(pathEntry.idPathContainer)
	let divPath = document.getElementById(pathEntry.idPathContainer);
	if (!isVisible(divPath)) setCurrentPath(pathEntry.filename);
	let funcDiv = mBy(funcEntry.idDiv);
	//console.log('funcDiv',funcDiv)
	funcDiv.scrollIntoView(true);
}
function toggleCollapsible(ev) {
	let b=ev.target;
	//console.log('arguments',arguments)
	b.classList.toggle("active");
	var content =getLinkContainerId(b.id);// mBy(getLinkContainerId(b.id)); //this.nextElementSibling;

	//let funcNameContainer = mBy(getLinkContainerId(b.id));
	//console.log('visible',funcNameContainer.id,'?',isVisible(funcNameContainer))

	if (isVisible(content)) hide(content); else show(content);
	// if (content.style.display === "block") {
	// 	content.style.display = "none";
	// } else {
	// 	content.style.display = "block";
	// }
}
function openCollapsible(){
	if (!isVisible(this)){toggleCollapsible(this)}
}
function genLink(fname, dParent) {
	let content = fname;
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

	let bView = mButton('view', e => showCollapsibleContent(e), b, { float: 'right' }, null);

	return b;
}
