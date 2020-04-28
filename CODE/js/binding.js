
var B = {};
var serverDataUpdated;
const RUPDATE = {
	info: mNodeChangeContent,
};


function binding01() {
	//make a change
	serverData.table.o1.name = 'felix';

	//das hier wird bei serverData diff eingetragen in eine long list of prop updates
	let upd = { oid: 'o1', prop: 'name', ukind: 'valueChange', oldval:'max', newval: 'felix' };
	let sUpdated = { o1: [upd] };
	updateBindings(sUpdated,R);

}

function updateBindings(supd,R) {
	console.log(R)
	for (const oid in supd) {
		for (const upd of supd[oid]) {
			let propUpdated = upd.prop;
			let ukind = upd.ukind;
			if (ukind == 'valueChange') {
				let skeys = R.getR(oid);
				console.log('rep nodes for', oid, skeys);

				//in ROOT look for keys w/ specKey A
				let akku=[];
				recCollect(R.ROOT,x=>{return x.oid == oid},akku,true);
				//if (akku.length>0) console.log('found',akku);
				for(const n of akku){
					updateNode(n,upd,R);
				}
			}

		}
	}
}

function updateNode(n, upd,R) {
	//upd = { oid: 'o1', prop: 'name', ukind: 'valueChange', val: 'felix' };
	let oid=upd.oid;
	let o=R.getO(upd.oid);
	if (upd.ukind == 'valueChange'){

		//update persistent object
		let prop=upd.prop;
		let oldval=o[prop];
		o[prop]=upd.newval;

		let f=RUPDATE[n.type];
		if (isdef(f)){
			let ui=n.ui;
			//need to know which properties of oid are presented in n
			let data=n.data;
			console.log(n.data)
			if (data == '.'+upd.prop){
				//n.content = n.data ? calcContentFromData(n1.oid,R.getO(n1.oid), n.data,R) : null;
				n.content = calcContentFromData(oid,o,n.data,R);
			}
			f(ui,n.content);
		}
	}
}













