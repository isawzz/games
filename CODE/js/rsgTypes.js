
class RSG {
	constructor(sp, defs, sdata) {
		//console.log(sdata)
		this.gens = { G: [sp] };
		this.sp = sp;
		this.lastSpec = sp; //just points to last spec produced in last step performed
		this.ROOT = sp.ROOT;
		this.defs = defs;
		this.places = {};
		this.refs = {};

		this.clearObjects();
		for (const oid in sdata) {
			//console.log(sdata)
			this.addObject(oid, sdata[oid]);
		}
		// this.defSource = Object.keys(sdata);
		// console.log(sdata,this.defSource)

		this.oidNodes = null;

		//this.bySpecKey = {};
		// this.oidNodes = {};
		// this.NODES = {};
		// this.rTree={};
		// this.gTree={};

	}
	//#region helpers
	addToPlaces(specKey, placeName, propList) {
		lookupAddToList(this.places, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	addToRefs(specKey, placeName, propList) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	clearObjects(){
		this.UIS = {};
		this.uid2oids = {};
		this.oid2uids = {};
		this._sd = {};

	}

	getO(oid) { return this._sd[oid].o; }
	addObject(oid, o) {
		let o1=jsCopy(o);
		o1.oid=oid;
		this._sd[oid] = { oid: oid, o: o1, rsg: [] };
	}
	deleteObject(oid){delete this._sd[oid];}

	addR(oid, k) { addIf(this.getR(oid), k); }
	getR(oid) { return this._sd[oid].rsg; }

	getSpec(spKey = null) { return spKey ? this.lastSpec[spKey] : this.lastSpec; }

	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}
	registerNode(n) {
		let uid = n.uid = getUID();
		this.UIS[n.uid] = n;
		if (n.oid) {
			lookupAddToList(this.uid2oids, [uid], n.oid);
			lookupAddToList(this.oid2uids, [n.oid], uid);
		}
	}

	//TODO: delete ui also if exists and all its links!
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }

	//#endregion

	//#region gens
	//gen10 adds source and pool to each spec node, _rsg to each object	//type lists: nix
	gen10(genKey = 'G') {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens[genKey].push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}

	//gen11 adds top panel if is not unique top panel	//type lists: nix
	gen11(genKey = 'G') {
		//brauch ich nur wenn nicht eh schon ROOT.type == panel ist
		let gen = jsCopy(this.lastSpec);
		if (this.ROOT.type == 'panel' && (nundef(this.ROOT.cond) || this.ROOT.pool.length <= 1)) {
			//console.log('ROOT is already single panel! gens[2] same as gens[1]')
		} else {
			gen.ROOT = { type: 'panel', panels: gen.ROOT };
		}

		this.gens[genKey].push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}

	//gen12 fills places ad refs, adds specKey to each node	//type lists: nix
	gen12(genKey = 'G') {
		//add a specKey to each spec node
		//check_id recursively => fill this.places
		//check_ref recursively => fill this.refs
		this.places = {};
		let gen = jsCopy(this.lastSpec);
		//add specKey to each node
		for (const k in gen) {
			let n = gen[k];
			n.specKey = k;
		}
		//recursively add _id node+path to places
		for (const k in gen) {
			let n = gen[k];
			check_id(k, n, this);
		}
		//recursively add _ref node+path to places
		for (const k in gen) {
			let n = gen[k];
			check_ref(k, n, this);
		}
		//console.log('____________________ places', this.places);
		//console.log('____________________ refs', this.refs);

		this.gens[genKey].push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	// *** 12 + 13 *** hier muesst _id,_ref lists aufloesen!!!!!!!!!!!!!!!!
	//gen13 merges _ids and _refs	//type lists: nix
	gen13(genKey = 'G') {
		//merge _ref nodes into _id
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeChildrenWithRefs, this, false); //do merge AFTER processing children damit leaf nodes first!!!
			if (n._id) {
				//case a) _id at top level! mergeAllRefsToIdIntoNode(n)
				n = mergeAllRefsToIdIntoNode(n, R);
			}
		}
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;


	}
	//gen14 merge spec types into places (forward merge) and merges in def types
	//NOOOOO doch nicht!!!!!!!!!!! for all types except grid! (grid done in detectBoardParams, see createLC)
	//type list: hier muesst ich type lists aufloesen!!! 
	gen14(genKey = 'G') {
		//console.log('gen14 starts.......')

		let gen = jsCopy(this.lastSpec);
		this.defType = isdef(this.defs.type) ? this.defs.type : 'panel';

		for (const k in gen) {
			let n = gen[k];
			if (nundef(n.type)) {
				let type = detectType(n, this.defType);
				//console.log('soll ich correcten???',n,type);
				if (type) n.type = type;
			}
			//console.log('_____ node',k,isdef(n.type));
			gen[k] = recMergeSpecTypes(n, gen, this.defType, 0);
		}
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;
		//console.log(gen)
	}
	// *** 14 + 15 *** hier muesst type lists aufloesen!!!!!!!!!!!!!!!!
	//#region gen15 rausgeschmissen weil mist!!!
	//gen15 generates 1 spec node for each server object, ==> o._node
	// by merging all spec nodes in o._rsg
	//achtung!!! fuer board members kann das NICHT gemacht werden weil diese noch nicht bekannt!
	//==> mache eine function die ich dann aus generalGrid aufrufen kann die das macht!
	//composite types as per pool set
	//could add this node to object as _rsg instead of just name already!!!
	//theoretically could already eval all params here!!! (except map values for oid)
	//not now!

	//problem: wenn keine board detection wird board selbst NICHT oidNode bekommen
	//and therefore NOT BE PRESENTED!!!
	//muss also VORHER fuer alle type=grid automatic board detection machen!!!
	//ich koennte aber das schon frueher machen, sobald ich type:grid finde
	//in einem spec node ohne cond???
	// gen15(){
	// 	this.oidNodes = {};
	// 	for (const oid in R.sData) {
	// 		this.oidNodes[oid] =	mergeAllNodesForOid(oid,R);
	// 	}
	// }
	//#endregion

	//#region gen20 rausgeschmissen weil mist
	//gen20 forms tree: MAKES ABSOLUTELY NO SENSE!!!
	gen20() {
		let gen = jsCopy(this.lastSpec);

		this.NODES = {};
		let id = getUid();
		this.NODES[id] = this.starter = { nid: id, fullPath: id };

		this.ROOT = createSTree(gen.ROOT, this.starter.nid, this);

		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}
	//#endregion

	gen21(area, genKey = 'G') {
		let gen = jsCopy(this.lastSpec);

		this.ROOT = createLC(gen.ROOT, area, this);

		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}


	// *** NOT IMPLEMENTED!!! ==> present loose objects ***
	gen30(genKey = 'G') {
		//present positioned objects
		//console.log('hallo!!!!!!!!!')
		for (const k in this.lastSpec) {
			let n = this.lastSpec[k];
			//console.log(n)
			if (nundef(n.position)) continue;
			if (isdef(n.position)) {
				console.log('positioned element:', n);
			}
			for (const oid of n.pool) {
				let o = this.getO(oid);
				//geht nicht wenn path zu anderem o fuehrt!!!!
				let val = decodePropertyPath(o, n.position);
				console.log('val ==>', val, typeof val);
				let oidloc = isString(val) ? val : val._obj;
				console.log(oidloc);
				let oloc = this.getO(oidloc);
				let replist = this.oid2uids[oidloc];
				console.log('rep', replist);
				let uiloc = this.UIS[replist[0]].ui;
				//let pos = getBounds(oloc.ui);
				console.log('o', o);
				console.log('oloc', oloc);
				console.log('uiloc', uiloc);



				//ok um das zu machen brauch ich jetzt die position von diesem oid!!!
				//jedes oid brauch einen pointer wo es ueberall ist
				//das wird bei register gemacht!
				//console.log('pos',pos);

			}
		}
	}

	//#endregion

	//#region trials
	geniStart() {
		let sp = this.lastSpec = this.sp;
		let genKey = 'inc';
		this.gens[genKey] = []; //start 'inc' generation!
		this.gen11(genKey);
		this.gen12(genKey);

		console.log(this.gens);
	}
	//#endregion


	geninc13(genKey = 'G') {
		this.clearObjects();
		let gen = jsCopy(this.lastSpec);
		this.gens[genKey].push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;

	}




}



function createUi(n, area, R) {

	R.registerNode(n);

	decodeParams(n, R);

	if (nundef(n.type)) n.type = isdef ? n.params.defaultType : detectType(n);

	n.ui = RCREATE[n.type](n, mBy(area), R);

	if (n.type != 'grid') { applyCssStyles(n.ui, n.cssParams); }
	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) {
		//console.log('rsg std params!!!', n.stdParams);
		switch (n.stdParams.display) {
			case 'if_content': if (!n.content) hide(n.ui); break;
			case 'hidden': hide(n.ui); break;
			default: break;
		}
	}

	R.setUid(n);

}






