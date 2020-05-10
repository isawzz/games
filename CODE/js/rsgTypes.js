
function safeMerge(a,b){
	if (nundef(a) && nundef(b)) return {};
	else if (nundef(a)) return jsCopy(b);
	else if (nundef(b)) return jsCopy(a);
	else return deepmergeOverride(a,b);
}

class RSG {
	constructor(sp, defs, sdata) {
		//console.log(sdata)
		this.gens = { G: [sp] };
		this.sp = safeMerge(defs.NODES,sp.NODES);
		this.maps = safeMerge(defs.MAPS,sp.MAPS);
		this.channels = safeMerge(defs.CHANNELS,sp.CHANNELS);
		this.lastSpec = this.sp; //just points to last spec produced in last step performed
		this.ROOT = this.sp.ROOT;
		this.defs = defs;
		this.places = {};
		this.refs = {};
		this.isUiActive = false;

		this.clearObjects(); //prepares _sd
		for (const oid in sdata) {
			this.addObject(oid, sdata[oid]);
		}
		// this.defSource = Object.keys(sdata);
		// console.log(sdata,this.defSource)

		this.oidNodes = null;
	}
	//#region helpers
	addToPlaces(specKey, placeName, propList) {
		lookupAddToList(this.places, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	addToRefs(specKey, placeName, propList) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	clearObjects() {
		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};

	}

	getO(oid) { return lookup(this._sd, [oid, 'o']); }
	addObject(oid, o) {
		let o1 = jsCopy(o);
		o1.oid = oid;
		this._sd[oid] = { oid: oid, o: o1, rsg: [] };
	}
	deleteObject(oid) { delete this._sd[oid]; }

	getR(oid) { return lookup(this._sd, [oid, 'rsg']); }
	addR(oid, k) { addIf(this.getR(oid), k); }
	updateR(k) {
		let nSpec = this.lastSpec[k];
		if (!nSpec.cond) return;
		let cond = nSpec.cond;
		for (const oid in this._sd) {
			if (evalConds(this._sd[oid].o, cond)) {
				this.addR(oid, k);
			}
		}
	}
	removeR(oid,key){let r=lookup(this._sd,[oid,'rsg']);if (r) removeInPlace(r,key);}

	getUI(uid) { return lookup(this.UIS, [uid, 'ui']); }

	getSpec(spKey = null) { return spKey ? this.lastSpec[spKey] : this.lastSpec; }

	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}


	//#endregion helpers

	//#region register
	registerNode(n) {
		if (nundef(n.uid)) n.uid = getUID();
		let uid = n.uid;
		this.UIS[n.uid] = n;
		if (n.oid) {
			lookupAddIfToList(this.uid2oids, [uid], n.oid);
			lookupAddIfToList(this.oid2uids, [n.oid], uid);
		}
	}
	unregisterNode(n) {
		//console.log('=>unregister',n.uid,n.oid?'oid:'+n.oid:'');
		let uiNode = this.UIS[n.uid];
		if (nundef(uiNode)) return;
		let uid = n.uid;
		//console.log(uiNode);
		if (uiNode.uiType != 'NONE') {
			//do I have to explicitly remove handlers???
			let removableUi = uiNode.uiType == 'h'?mBy(uiNode.uidDiv):uiNode.ui;

			removeElem(removableUi);//GEHT DAS???????????????
			lookupRemoveFromList(this.uid2oids, [uid], n.oid, true);
			lookupRemoveFromList(this.oid2uids, [n.oid], uid, true);
		}
		delete this.UIS[n.uid];
		//however, _sd still contains the oid!
	}
	setUid(n, ui) {
		ui.id = n.uid;
		// if (n.uid == '_16') {
		// 	console.log('JAAAAAAAAAAAA');
		// }
		n.act = new Activator(n, ui, this);
	}

	//#endregion

	//#region v1
	geninc13(genKey = 'G') {
		this.clearObjects();
		let gen = jsCopy(this.lastSpec);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;

	}

}

function adjustContainerLayout(n, R) {

	n.adirty = false;

	//console.log(n);return;
	if (n.type == 'grid') {
		console.log('adjustContainerLayout! ja grid kommt auch hierher!!!', n);
		return;
	}
	//@@@3
	//return;

	if (n.type == 'hand') { layoutHand(n); return; }

	let params = n.params;
	let num = n.children.length;

	let or = params.orientation ? params.orientation : DEF_ORIENTATION;
	mFlex(n.ui, or);

	//setting split
	let split = params.split ? params.split : DEF_SPLIT;
	if (split == 'min') return;

	let reverseSplit = false;

	if (split == 'equal') split = (1 / num);
	else if (isNumber(split)) reverseSplit = true;

	for (let i = 0; i < num; i++) {
		//if (n.children[i].uid == '_19') console.log(jsCopy(n.children[i]));
		let d = R.uiNodes[n.children[i]].ui;
		mFlexChildSplit(d, split);

		if (reverseSplit) { split = 1 - split; }
	}
}
function createUi(n, area, R) { //#111, defParams) {

	if (nundef(n.type)) { n.type = inferType(n); }

	R.registerNode(n);

	decodeParams(n, R); //#111, defParams);//@@@1 */
	console.log(n.type,n.params)

	let ui = RCREATE[n.type](n, mBy(area), R);

	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	if (n.uiType == 'NONE') return ui;

	//if (n.uiType != 'g') applyCssStyles(n.uiType == 'h'?mBy(n.uidStyle):ui, n.cssParams);
	applyCssStyles(n.uiType == 'h'?mBy(n.uidStyle):ui, n.cssParams);//@@@2

	// if (!isEmpty(n.stdParams)) {
	// 	switch (n.stdParams.display) {
	// 		case 'if_content': if (!n.content) hide(ui); break;
	// 		case 'hidden': hide(ui); break;
	// 		default: break;
	// 	}
	// }

	R.setUid(n, ui);
	return ui;

}





