
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
	registerNode(n) { n.uid = getUID(); this.UIS[n.uid] = n; }

	//TODO: delete ui also if exists and all its links!
	unregisterNode(n) { delete this.UIS[n.uid]; }
	setUid(n) { n.ui.id = n.uid; }
	gen10() {
		let [gen, pools] = addSourcesAndPools(this);
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;
		this.POOLS = pools; //not sure if need this.POOLS at all!!!
	}
	gen11() {
		//brauch ich nur wenn nicht eh schon ROOT.type == panel ist
		if (this.ROOT.type == 'panel' && this.ROOT.pool.length <= 1) return;
		let gen = jsCopy(this.lastSpec);
		gen.ROOT = { type: 'panel', panels: gen.ROOT };
		this.gens.push(gen);
		this.lastSpec = gen; //besser als immer lastGen aufzurufen
		this.ROOT = gen.ROOT;

	}
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
	gen14() {
		//merge spec types into places (forward merge)
		let gen = jsCopy(this.lastSpec);

		for (const k in gen) {
			let n = gen[k];
			safeRecurse(n, mergeSpecTypes, this, true);
		}
		this.lastSpec = gen;
		this.ROOT = gen.ROOT;
	}
	gen20(area) {
		let gen = jsCopy(this.lastSpec);

		this.ROOT = createLC(gen.ROOT, area, this);

		this.lastSpec = gen;
		//console.log('UIS', R.UIS);
		//console.log('ROOT', R.ROOT);
	}
}







