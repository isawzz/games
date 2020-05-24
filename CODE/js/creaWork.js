function addNewlyCreatedServerObjects(sdata, R) {
	//console.log('_____________ addNewly...', sdata);

	//spec is up to date!
	for (const oid in sdata) { R.addObject(oid, sdata[oid]); R.addRForObject(oid); }

	//hier ist auch R.locOids upToDate!!!!

	for (const oid in sdata) {
		let o = sdata[oid];
		if (isdef(o.loc)) { continue; }
		let success = einhaengen(oid, o, R);
	}

	//so far has added all objects to tree that do NOT have loc component and have spec node
	//or are a part of an object that has spec node (eg. board member)

	sieveLocOids(R);
}

function calcOidParentsForLocOids(R) {
	return R.locOids.map(x => R.getO(x).loc);
}

function calcCycles(R) {
	let oids = jsCopy(R.locOids);
	let cy = R.partitions = {};
	let oid2partition = R.oid2partition = {};
	let cid;
	let sameCycle = [];

	while (!isEmpty(oids)) {
		let oid = oids[0];
		cid = getUID();
		let c = cy[cid] = { isCycle: false, oids: [] };
		while (true) {
			if (c.oids.includes(oid)) {
				c.isCycle = true;
				//console.log('found cycle!', c, oid);  
				break;
			}
			//console.log('add',oid)
			if (isdef(oid2partition[oid])) {
				//console.log(oid,cy, oid2partition)
				let cid2 = oid2partition[oid];
				let c2 = cy[cid2];
				//console.log('c2',c2)
				//cy2 and cy need to be joined!
				//cy2 := cy.concat(c2)
				//each oid in c
				c.oids.map(x => oid2partition[x] = cid2);
				c2.oids = c.oids.concat(c2.oids);
				c = c2;
				delete cy[cid];
				break;
			} else {
				c.oids.push(oid);
				oid2partition[oid] = cid;
			}
			removeInPlace(oids, oid);
			let o = R.getO(oid);
			if (nundef(o.loc)) break;
			oid = o.loc;
			// if (isEmpty(oids)) break;
		}
	}
	//need to compactify!



	//console.log('partitions',cy,oid2partition);


}
function separateCycles(R) {
	console.log('_____________ separateaaaaaaaaaaaaa')
	let cyclic = R.locOidsCyclic = [];
	for (const k in R.partitions) {
		let cy = R.partitions[k];
		console.log(cy)

		if (!cy.isCycle) continue;
		console.log('transfer all elements in', cy.oids, 'to locOidsCyclic');

		console.log('ppppppppppppppppp', cy.oids);
		R.locOidsCyclic = R.locOidsCyclic.concat(cy.oids);
		R.locOids = arrMinus(R.locOids, cy.oids);
		// for(const oid of cy.oids){
		// 	removeInPlace(R.locOids,oid);
		// 	R.locOidsCyclic.push(oid);
		// }
	}
	console.log(R.locOids, R.locOidsCyclic)

}
function sortLocOids(R) {
	let loids = []; let cloids = [];
	for (const k in R.partitions) {
		let c = R.partitions[k];
		if (c.isCycle) {
			let x = jsCopy(c.oids).reverse(); //reverse(c.oids);
			//console.log('normal',c.oids,'\nrev',x);
			for (const oid of x) { cloids.push(oid); }
		} else {
			//remove last elemt from 
			let x = jsCopy(c.oids).slice(0, c.oids.length - 1);
			//onsole.log('ganz',c.oids,'minus last',x);
			x.reverse();
			for (const oid of x) {
				//make sure this thing has a loc!
				let o = R.getO(oid);
				if (nundef(o.loc)) { alert('NEEEEEEEE'); }
				loids.push(oid);
			}

		}
	}
	R.locOids = loids;
	R.locOidsCyclic = cloids;
}
function sieveLocOids(R) {
	if (isEmpty(R.locOids)) return;

	calcCycles(R);
	//separateCycles(R);
	//sortLocOids(R); 
	//replace this by sortCycles! => cycles muesser reversed werden!!!

	//*** R.partitions, R.oid2partition, R.locOids, R.locOidsCyclic contain cycles and cycle id for each oid
	//console.log('locOids',R.locOids,'\nlocOidsCyclic', R.locOidsCyclic)
	for (const k in R.partitions) {
		let cycle = R.partitions[k];
		let max_cycles = cycle.isCycle ? DEFS.cycleLengthAllowed : 1;
		processLocOids(cycle.oids.reverse(), max_cycles, cycle.isCycle, R);
	}

	// //the following need to be called for each cyclic partition separately!!!!
	// for()
	// processLocOids(R.locOidsCyclic, DEFS.cycleLengthAllowed, true);
}

Array.prototype.rotate = (function () {
	// usage:
	// let arr = [1,2,3,4,5];let arr1=jsCopy(arr).rotate(2);
	var unshift = Array.prototype.unshift,
		splice = Array.prototype.splice;

	return function (count) {
		var len = this.length >>> 0,
			count = count >> 0;

		unshift.apply(this, splice.call(this, count % len, len));
		return this;
	};
})();
function processLocOids(cycle, max_cycles, isCyclic, R) {
	if (isEmpty(cycle)) return;
	let cycles = 0;
	let locOids = cycle;
	if (isCyclic) {
		let i = 0; let top = null;
		while (isEmpty(top)) {
			let oid = cycle[i];
			top = einhaengen(oid, R.getO(oid), R);
			if (!isEmpty(top)) break;
			i += 1; if (i > cycle.length - 1) break;
		}
		//console.log('i is', i, '\ntop', top);
		if (i > cycle.length - 1) {
			//console.log('none of the locOids in', cycle, 'has a rep!');
			return;
		}
		locOids = jsCopy(cycle).rotate(i); 
		//console.log('cycle orig:', cycle, 'shifted:', locOids);
	}

	//hier koennte nochmal max_cycles definieren, entweder nach starting oid 
	//oder nach node (in welchem fall ich aber einhaengen umdrehen muss!)

	console.log('locOids',locOids)
	while (true) {
		cycles += 1; 
		if (cycles > max_cycles) { 
			//console.log('MAX_CYCLES reached!', cycles); 
			return; 
		}

		let changed = false;
		for (const oid of locOids) {
			let top = einhaengen(oid, R.getO(oid), R);
			//console.log('oid', oid, '\ntop', top, '\noid2uids', R.oid2uids[oid]);
			if (!isEmpty(top)) { changed = true; } //recycle.push(top);break;}
		}
		if (!changed) { break; }
	}
	//there might not be any, so if this does not yield result, just return!
	let top = null;
	let i = 0;
	//console.log('isEmpty(null)', isEmpty(null));
	//console.log('done after', cycles, 'cycles')
}



