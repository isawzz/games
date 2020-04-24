
class RSG {
	constructor(sp, defs, sdata) {
		this.gens = [sp];
		this.sp = sp;
		this.lastSpec = sp;
		this.defs = defs;
		this.sData = sdata;
		this.UIS = {};
		this.places = {};
		this.refs = {};

		this.uid2oids={};
		this.oid2uids={};
	}
	addToPlaces(specKey, placeName, propList) {
		lookupAddToList(this.places, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
	}
	getPlaces(placeName) {
		return (placeName in this.places) ? this.places[placeName] : {};
	}
	addToRefs(specKey, placeName, propList) {
		lookupAddToList(this.refs, [placeName, specKey], { idName: placeName, specKey: specKey, propList: propList });
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
	//adds source and pool to each spec node, _rsg to each object
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}
	//gen11 adds top panel if is not unique top panel
	gen11() {
		//brauch ich nur wenn nicht eh schon ROOT.type == panel ist
		if (this.ROOT.type == 'panel' && this.ROOT.pool.length <= 1) return;
		let gen = jsCopy(this.lastSpec);
		gen.ROOT = { type: 'panel', panels: gen.ROOT };
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	//gen12 fills places ad refs, adds specKey to each node
	gen12() {
		//add a specKey to each spec node
		//check_id recursively => fill this.places
		//check_ref recursively => fill this.refs
		this.places = {};
		let gen = jsCopy(this.lastSpec);
		for (const k in gen) {
			let n = gen[k];
			n.specKey = k;
		}
		for (const k in gen) {
			let n = gen[k];
			check_id(k, n, this);
		}
		for (const k in gen) {
			let n = gen[k];
			check_ref(k, n, this);
		}
		//console.log('____________________ places', this.places);
		//console.log('____________________ refs', this.refs);

		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
	//gen13 merges _ids and _refs
	gen13() {
		//merge _ref nodes into _id
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeChildrenWithRefs, this, true);
		}
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;


	}
	//gen14 merge spec types into places (forward merge) and merges in def types
	//for all types except grid! (grid done in detectBoardParams, see createLC)
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
			gen[k]=recMergeSpecTypes(n,gen,this.depType,0);
		}
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;
		//console.log(gen)
	}

	//gen15 generates composite types as per pool set
	//could add this node to object as _rsg instead of just name already!!!
	//theoretically could already eval all params here!!! (except map values for oid)
	gen15(){
		let gen = jsCopy(this.lastSpec);

		for (const oid in R.sData) {
			let o = R.sData[oid];
			let rlist = o._rsg;
			if (nundef(rlist)) {
				//console.log('no presentation',oid);
				continue;
			}

			let no={};
			for(const k of rlist){
				no=deepmergeOverride(no,gen[k]);
			}
			o._node=no;
			// console.log('type of',oid,'is',no.type);
			console.log('node of',oid,'is',no.type,rlist,o._node);
			//weil ich ja hier schon oid hab muesst ich doch eval params koennen, oder?
			//kann da noch was dazu kommen???????
			//definitiv fuer board members (eg. fields)!!!!!!!
			//also bevor ich params auswerte MUSS ich board bauen!
		}
	}

	gen20(area) {
		let gen = jsCopy(this.lastSpec);

		this.ROOT = createLC(gen.ROOT, area, this);

		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}

	// *** NOT USED!!! ***
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
				let o=this.sData[oid];
				let val = decodePropertyPath(o,n.position);
				console.log('val ==>',val, typeof val);
				let oidloc = isString(val)? val : val._obj;
				console.log(oidloc);
				let oloc = this.sData[oidloc];
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







