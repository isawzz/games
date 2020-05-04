
function addNewlyCreatedServerObjects(sdata,R) {
	let locOids = [];
	//console.log(sdata)
	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { locOids.push(oid); continue; }
		addNewServerObjectToRsg(oid, o, R);
	}

	while(true){
		//find next loc oid with existing parent!
		let oid = find_next_loc_oid_with_existing_parent(locOids,sdata,R);
		if (!oid){
			console.log('cannot add any other object!',locOids);
			break;
		}
		//add it to RSG
		let o = sdata[oid];
		addNewServerObjectToRsg(oid, o, R);
		//remove it from locOids
		removeInPlace(locOids,oid);
		if (isEmpty(locOids)) break;
		
	}
	// for (const oid of locOids) {
	// 	let o = sdata[oid];
	// 	addNewServerObjectToRsg(oid, o, R);
	// }

}

function find_next_loc_oid_with_existing_parent(locOids,sdata,R){
	for(const oid of locOids){
		console.log('checking',oid)
		let o=sdata[oid];
		let loc=o.loc;
		let parentID=loc;
		if (!isEmpty(R.treeNodesByOidAndKey[parentID])) return oid;
	}
	return null;
}






























class Engine {
	constructor() {
		this.examples = { a: 5, b: 0 };
		this.sDataExamples = ['a00', 'b00'];
		this.urls = [];
		let serverDataName = null;
		this.iTest = 0;
		for (const [k, v] of Object.entries(this.examples)) {
			let urlServerData = '/EXAMPLES/' + k + '00/serverData.yaml';
			for (let i = 0; i <= v; i++) {
				let fdName = k + '0' + i;
				let testInfo = {
					urlSpec: '/EXAMPLES/spec/' + fdName + '.yaml',
					urlServerData: urlServerData,
				}
				this.urls.push(testInfo);
			}
		}
		console.log(this.urls);
	}
	loadNextExample() {

	}
}


