
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.lastSpec = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
	}
	registerNode(n) { n.uid = getUID(); this.UIS[n.uid] = n; }
	//TODO: delete ui also if exists and all its links!
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}
	gen11() {
		let gen = jsCopy(this.lastSpec);
		gen.ROOT = { type: 'panel', panels: gen.ROOT };
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
	}
	gen20(area) {
		let spec = jsCopy(this.lastSpec);

		this.ROOT = createLC(spec.ROOT, area, this);
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}
	// lastGen() { return last(this.gens); }

}

function createLC(n, area, R) {
	// n ist already a copy of the node to be created

	R.registerNode(n);
	//console.log('_____________________ createLC');
	//showNodeInfo(n, 'n');
	let content = n.content;

	//inner node
	if (isContainerType(n.type)) {

		n.ui = mDiv(mBy(area));

		if (isdef(content) && isList(content)) {
			//pass as pool to container content
			let prop = RCONTAINERPROP[n.type];
			let n1 = n[prop];
			n1.pool = content; //intersect!
			console.log('JETZT!!!', n.pool)
		}
		R.setUid(n);

		//replace children by spec nodes
		//also: process case where container prop is a path .neutral zB
		//try to do it in createChi first!
		let prop = RCONTAINERPROP[n.type];
		let nOrList = n[prop];
		if (isList(nOrList)) {
			//each list element can only result in <= 1 binding!!!
			//so if it's type is a list, simply merge all the types in it
			for (let i = 0; i < nOrList.length; i++) {
				let nch = nOrList[i];
				//#region merge multiple types NOT IMPLEMENTED!!!
				if (isList(nch.type)) {
					let types = nch.type.filter(x => isSpecType(x));
					let standardTypes = nch.type.filter(x => !isSpecType(x));
					let newel = nch;
					for (const t of types) {
						newel = mergeWithSpecType(newel, t, R);
					}
					nOrList[i] = newel;
					//console.log('^^^newel has type', newel.type);
				}
				//#endregion

				if (isSpecType(nch.type)) {
					nOrList[i] = mergeWithSpecType(nch, nch.type, R);
				}
			}
		} else if (isDict(nOrList)) {
			let nch = nOrList;
			//#region merge multiple types NOT IMPLEMENTED!!!
			if (isList(nch.type) && nch.type.length == 1) {
				nch.type = nch.type[0];
			} else if (isList(nch.type) && nch.type.length > 1) {
				let specTypes = nch.type.filter(x => isSpecType(x));

				let standardTypes = nch.type.filter(x => !isSpecType(x));
				let newel = nch;
				//console.log('specTypes', specTypes);
				let newNProp = [];
				//first make 1 list element for each different 
				for (const t of specTypes) {

					newel = mergeWithSpecType(newel, t, R);
				}
				n[prop] = newel;
				//console.log('^^^newel has type', newel.type);
			}
			//#endregion

			if (isSpecType(nOrList.type)) {
				n[prop] = mergeWithSpecType(nOrList, nOrList.type, R);
			}
		} else {
			//console.log('hhhhhhhhhhhhhh')
		}

		n.children = createChi(n, R);
	}

	//leaf
	else {
		n.ui = mInfo(content, mBy(area));
		R.setUid(n);
	}
	return n;
}

//das muss doch irgendwie einfacher gehen!!!
function findDataSet() { }
function createChi(nCont, R) {
	let prop = RCONTAINERPROP[nCont.type];
	let n = nCont[prop];

	//showNodeInfo(nCont, 'container');
	//if (!isList(n)) showNodeInfo(n, 'children'); else consOutput('liste!!!');
	let verbose = (isString(n) && n[0] == '.');

	let chNodes = [];

	//case a: n is a string eg., .neutral
	//geht wahrsceinlich nicht fuer multiple levels, must study this!!!!!
	if (isString(n)) {
		//zuerst muss dataset finden
		if (verbose) showNodeInfo(nCont, 'beispiel');

		//replace this by calcContent
		let ownerId = nCont.oid;
		let owner = R.sData[ownerId];
		let olist = calcContent(owner, n);
		for (const oid of olist) {
			//each of these is becoming 1 child the type of which is unknown!!!
			let o = R.sData[oid];
			let stypes = o._rsg;
			if (verbose) consOutput(oid, stypes);

			//if no type is found, this child is not presented!
			if (isEmpty(stypes)) continue;

			let nrep = {};
			for (const t of stypes) {
				nrep = deepmergeOverride(nrep, R.lastSpec[t]);
			}
			delete nrep.source;
			delete nrep.pool;
			// for(const t of stypes){
			// 	//console.log('hhhhhhhhhhhhhhhhhhhhhhhh')
			// 	console.log('should still have source and pool',R.lastSpec[t]);
			// }

			if (verbose) consOutput('YES', oid, stypes, nrep);

			if (verbose) consOutput('need to make a child for', oid, n, nrep);
			let n1 = nrep;
			n1.oid = oid;
			n1.content = nrep.data ? calcContent(R.sData[oid], nrep.data) : null;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);

		}
	}
	//cases 0: n is a list
	else if (isList(n)) {
		//console.log('...case 0');
		for (const x of n) {
			let n1 = jsCopy(x);
			let content = null;
			if (isdef(x.data) && isdef(nCont.oid) && nundef(n1.oid)) {
				n1.oid = nCont.oid;
				content = calcContent(R.sData[n1.oid], n1.data);
			}else if (isdef(x.data)){
				content = x.data;
			}else if (isdef(nCont.oid) && nundef(n1.oid)) {n1.oid=nCont.oid;}
			n1.content = content;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//cases 1-4: n is a dict
	//case 1: wenn n ein pool besitzt muss fuer jedes el im pool 1 child gemacht werden
	else if (!isEmpty(n.pool)) {
		//console.log('...case 1')
		for (let i = 0; i < n.pool.length; i++) {
			let n1 = jsCopy(n);
			n1.oid = n.pool[i];
			n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
			createLC(n1, nCont.uid, R);
			chNodes.push(n1);
		}
	}
	//case 2: wenn n ein oid besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.oid)) {
		//console.log('...case 2')
		let n1 = jsCopy(n);
		n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 3: wenn n ein data besitzt muss fuer dieses 1 child gemacht werden
	else if (isdef(n.data) && n.data[0] == '.' && isdef(nCont.oid)) {
		//console.log('...case 3')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = calcContent(R.sData[n1.oid], n.data);
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 4: wenn n containerType ist und parent container ein oid hat muss fuer dieses 1 child gemacht werden
	else if (isContainerType(n.type) && isdef(nCont.oid)) {
		//console.log('...case 4')
		let n1 = jsCopy(n);
		n1.oid = nCont.oid;
		n1.content = null;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 5: n.data, n NOT container, nCont.pool + nCont.data, NO nCont.oid, 
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		//console.log('...case 5');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste (of objects!)
		//erstmal brauch ich die data
		let data = calcContent(R.sData[nCont.oid], nCont.data);
		//console.log('::::::::data', data);
		//let n1 = jsCopy(n);
		n.pool = data;
		//console.log('have to create info foreach of pool of', n);
		chNodes = createChi(nCont, R);
	}
	//case 6: n.data, n NOT container, nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool) && isdef(nCont.data)) {
		//console.log('...case 6');
		//dieses pool darf nur 1 element haben!!!
		nCont.oid = nCont.pool[0];
		//die data muessen in diesem fall eine liste sein
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 10: n.data, n NOT container, NO nCont.pool, NO nCont.oid, NO nCont.data
	else if (isdef(n.data) && !isContainerType(n.type) && nundef(nCont.oid) && nundef(nCont.pool)) {
		//console.log('...case 10')
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 11
	else if (isContainerType(n.type) && nundef(nCont.oid) && nundef(nCont.pool)) {
		//console.log('...case 11')
		let n1 = jsCopy(n);
		n1.content = n.data;
		createLC(n1, nCont.uid, R);
		chNodes.push(n1);
	}
	//case 12
	else if (isContainerType(n.type) && nundef(nCont.oid) && isdef(nCont.pool)) {
		//instantiate this node n foreach element in nCont.pool
		console.log('...case 12!!!!!!!!!!!!!!!!!!!');
		n.pool=nCont.pool;
		return createChi(nCont,R);
		// for (let i = 0; i < n.pool.length; i++) {
		// 	let n1 = jsCopy(n);
		// 	n1.oid = n.pool[i];
		// 	n1.content = n.data ? calcContent(R.sData[n1.oid], n.data) : null;
		// 	createLC(n1, nCont.uid, R);
		// 	chNodes.push(n1);
		// }

	}
	return chNodes;

}




function mergeWithSpecType(n, t, R) {
	//console.log('......mergine nodes!');
	let pool = n.pool;
	let nt = R.lastSpec[t];

	//console.log('n', n.pool, 'nt', nt.pool)
	//TODO!!!! da muss noch sehr viel geschehen bez cards vis,all,non-vis!!!!
	if (!isEmpty(nt.pool) && !isEmpty(n.pool)) { pool = intersection(pool, nt.pool); }

	n = deepmergeOverride(n, nt);
	//intersect pools!!! nein nicht wenn specType empty pool hat!!!

	if (isdef(pool)) n.pool = pool; // intersection(n.pool,pool);
	//console.log('new node', n, n.pool);
	return n;
}

function showNodeInfo(n, title) {
	console.log(title,
		isdef(n.type) ? ' type:' + n.type : '',
		isdef(n.uid) ? 'uid:' + n.uid : '',
		isdef(n.pool) ? 'pool:' + n.pool.map(x => x) : '',
		isdef(n.content) ? 'content:' + (isList(n.content) ? n.content.map(x => x) : n.content) : '',
		isdef(n.oid) ? 'oid:' + n.oid : '');
}
function isSpecType(t) { return isdef(R.lastSpec[t]); }
function isContainerType(t) { return t == 'panel' || t == 'list'; }
function childrenPath(path, i) {
	return path + (path[path.length - 1] == '.' ? '' : '.') + 'children.' + i;
}
const PARAMCSS = {
	bg: 'background-color',
	fg: 'color',
	font: 'font'
}
function paramsToCss(params) {
	let res = {};
	for (const k in params) {
		let name = PARAMCSS[k];
		if (nundef(name)) name = k;
		res[name] = params[k];
	}
	return res;
}
function justIds(o) {
	return Object.keys(o);
}
//#region _source, cond => source, pool, _rsg
function addSourcesAndPools(R) {
	//source and cond can only occur at top level!

	let sp = jsCopy(R.lastSpec);
	let pools = {}; //cache pools koennt ma auch an R anhaengen!!!

	//to each sp node add pool if does not have _source
	let missing = [];
	for (const k in sp) {
		let n = sp[k];
		//console.log('node is', k, n)
		if (nundef(n._source)) {
			n.source = justIds(R.sData);
			pools[k] = n.pool = makePool(n.cond, n.source, R);

			n.pool.map(x => lookupAddToList(R.sData[x], ['_rsg'], k));
			//console.log(n.source, n.pool);
		} else missing.push(k);
	}

	//console.log('missing', missing);
	//let safe = 10;
	while (missing.length > 0) { // || safe < 0) {
		//safe -= 1;

		//find key in missing for which 
		let done = null;
		for (const k of missing) {
			let n = sp[k];
			let sourceNode = sp[n._source];
			//console.log('search', k, node._source);
			if (nundef(sourceNode.pool)) continue;

			n.source = sourceNode.pool;
			pools[k] = n.pool = makePool(n.cond, n.source, R);

			n.pool.map(x => lookupAddToList(R.sData[x], ['_rsg'], k));

			done = k;
			break;

		}
		removeInPlace(missing, done);
		//console.log('missing', missing);
	}

	//console.log('POOLS', pools);
	return [sp, pools];
}

// helpers
function makePool(cond, source, R) {
	if (nundef(cond)) return [];
	// //console.log('cond', cond, 'source', source);
	let pool = [];
	for (const oid of source) {

		let o = R.sData[oid];
		// //console.log('o', o)
		if (!evalConds(o, cond)) continue;

		pool.push(oid);//[oid] = o;
	}
	return pool;

}
function evalCond(o, condKey, condVal) {
	let func = FUNCTIONS[condKey];
	if (isString(func)) func = window[func];
	if (nundef(func)) return false;
	return func(o, condVal);
}
function evalConds(o, conds) {
	for (const [f, v] of Object.entries(conds)) {
		if (!evalCond(o, f, v)) return false;
	}
	return true;
}
//#endregion





