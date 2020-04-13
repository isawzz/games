const RTYPES = {
	info: (o, area) => new rInfo(o, area),
}
// leave it for now! const DOMSTYLES = {	bg:'background-color',	fg:'color',	}

//initialize things for all rsg types
class RSG {
	constructor(defs) {
		this.defs = defs;

		//calc defaults for all types
		rInfo.defs = rInfo.calcDefaults(defs);
	}
	instantiate(o, area) { let node = RTYPES[o.type](o, area); return node.augo; }
}

class rInfo {
	constructor(sp, area) {
		//console.log('o',this.o,'\ndefs',rInfo.defs)

		if (isdef(sp)) this.setObject(sp);
		if (isdef(area)) this.setArea(area);
		this.isAttached = false;
	}
	static calcDefaults(defs) {
		let hardCoded = { data: 'empty', params: { bg: 'blue', fg: 'white' } }; //dassollte class var sein!
		if (isdef(defs)) hardCoded = deepmergeOverride(hardCoded, defs);
		return hardCoded;
	}
	setObject(sp) {
		this.sp = sp;
		//console.log(this.o,rInfo.defs)
		this.augo = deepmergeOverride(rInfo.defs,this.sp);
	}
	setArea(area) {
		//area can be string(=id of domel),domel,or node: react accordingly
		//for now, just string damit nicht zu kompliziert wird!
		console.log('present')
		if (area != this.areaName) {
			this.host = mBy(area);
			this.areaName = area;
			if (nundef(this.ui)) {
				console.log('creating ui!')
				this.ui = mNode(this.augo.data, this.host);
			}
			if (!this.isAttached) {
				//reattach to new host!
				mAppend(this.host, this.ui);
				this.isAttached = true;
			}
		}
	}
	present({ o, area } = {}) {
		if (isdef(o)) this.setObject(o);
		if (isdef(area)) this.setArea(area);

		//wenn es diffs gibt update presentation
	}
}

