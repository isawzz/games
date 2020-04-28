
class RSG {
	constructor(sp, defs, sdata){ 
		this.gens = [sp];
		this.sp = sp;
		this.lastSpec = sp;
		this.defs = defs;
		this._sd={};
		for(const oid in sdata){
			this._sd[oid]={oid:oid,o:sdata[oid],rsg:[]};
		}
		this.defSource=Object.keys(sdata);
		this.UIS = {};
		this.places = {};
		this.refs = {};

		this.oidNodes = {};
		this.NODES = {};
		this.rTree={};
		this.gTree={};

		this.uid2oids={};
		this.oid2uids={};
	}
	addToPlaces(specKey, placeName, propList) {
		lookupAddToList(this.places, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	addToRefs(specKey, placeName, propList) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	getO(oid){return this._sd[oid].o;}
	addR(oid,k){ addIf(this.getR(oid), k); }
	getR(oid){return this._sd[oid].rsg;}
	
	getSpec(spKey=null){return spKey? this.lastSpec[spKey]:this.lastSpec;}

	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	getRefs(placeName) {
		return (placeName in this.places) ? this.refs[placeName] : {};
	}
	registerNode(n) { 
		let uid = n.uid = getUID(); 
		this.UIS[n.uid] = n; 
		if (n.oid){
			lookupAddToList(this.uid2oids,[uid],n.oid);
			lookupAddToList(this.oid2uids,[n.oid],uid);
		}
	}

	//TODO: delete ui also if exists and all its links!
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }

	//gen10 adds source and pool to each spec node, _rsg to each object
	//type lists: nix
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}

	//gen11 adds top panel if is not unique top panel
	//type lists: nix
	gen11() {
		//brauch ich nur wenn nicht eh schon ROOT.type == panel ist
		let gen = jsCopy(this.lastSpec);
		if (this.ROOT.type == 'panel' && this.ROOT.pool.length <= 1) {
			//console.log('ROOT is already single panel! gens[2] same as gens[1]')
		}else{
			gen.ROOT = { type: 'panel', panels: gen.ROOT };
		}
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}

	//gen12 fills places ad refs, adds specKey to each node
	//type lists: nix
	gen12() {
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

		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	// *** 12 + 13 *** hier muesst _id,_ref lists aufloesen!!!!!!!!!!!!!!!!
	//gen13 merges _ids and _refs
	//type lists: nix
	gen13() {
		//merge _ref nodes into _id
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeChildrenWithRefs, this, false); //do merge AFTER processing children damit leaf nodes first!!!
			if (n._id){
				//case a) _id at top level! mergeAllRefsToIdIntoNode(n)
				n=mergeAllRefsToIdIntoNode(n,R);
			}
		}
		this.gens.push(gen);
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;


	}
	//gen14 merge spec types into places (forward merge) and merges in def types
	//NOOOOO doch nicht!!!!!!!!!!! for all types except grid! (grid done in detectBoardParams, see createLC)
	//type list: hier muesst ich type lists aufloesen!!! 
	gen14() {
		//console.log('gen14 starts.......')

		let gen = jsCopy(this.lastSpec);
		this.defType = isdef(this.defs.type)?this.defs.type:'panel';

		for (const k in gen) {
			let n = gen[k];
			if (nundef(n.type)){
				let type = detectType(n,this.defType);
				//console.log('soll ich correcten???',n,type);
				if (type) n.type = type;
			}
			//console.log('_____ node',k,isdef(n.type));
			gen[k]=recMergeSpecTypes(n,gen,this.defType,0);
		}
		this.gens.push(gen);
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

	//gen20 forms tree
	gen20(area) {
		let gen = jsCopy(this.lastSpec);

		this.ROOT = createLC(gen.ROOT, area, this);

		this.gens.push(gen);
		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}

	// *** NOT IMPLEMENTED!!! ==> present loose objects ***
	gen30(){
		//present positioned objects
		//console.log('hallo!!!!!!!!!')
		for(const k in this.lastSpec){
			let n=this.lastSpec[k];
			//console.log(n)
			if (nundef(n.position)) continue;
			if (isdef(n.position)){
				console.log('positioned element:',n);
			}
			for(const oid of n.pool){
				let o=this.getO(oid);
				//geht nicht wenn path zu anderem o fuehrt!!!!
				let val = decodePropertyPath(o,n.position);
				console.log('val ==>',val, typeof val);
				let oidloc = isString(val)? val : val._obj;
				console.log(oidloc);
				let oloc = this.getO(oidloc);
				let replist = this.oid2uids[oidloc];
				console.log('rep',replist);
				let uiloc = this.UIS[replist[0]].ui;
				//let pos = getBounds(oloc.ui);
				console.log('o',o);
				console.log('oloc',oloc);
				console.log('uiloc',uiloc);



				//ok um das zu machen brauch ich jetzt die position von diesem oid!!!
				//jedes oid brauch einen pointer wo es ueberall ist
				//das wird bei register gemacht!
				//console.log('pos',pos);

			}
		}
	}
}

function createUi(n, area, R) {

	R.registerNode(n);

	decodeParams(n, R);

	if (nundef(n.type)) n.type = isdef?n.params.defaultType:detectType(n);
	
	n.ui = RCREATE[n.type](n, mBy(area), R);

	if (n.type != 'grid') { applyCssStyles(n.ui, n.cssParams); }
	if (nundef(n.uiType)) n.uiType = 'd'; // d, g, h (=hybrid)

	//TODO: hier muss noch die rsg std params setzen (same for all types!)
	if (!isEmpty(n.stdParams)) { 
		//console.log('rsg std params!!!', n.stdParams);
		switch(n.stdParams.display){
			case 'if_content': if (!n.content) hide(n.ui); break;
			case 'hidden': hide(n.ui); break;
			default: break;
		}
	}

	R.setUid(n);

}

function createNode(n,R){

}






