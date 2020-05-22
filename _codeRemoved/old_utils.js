//#region merging types, _id, _ref helpers
function check_id(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_id', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToPlaces(specKey, akku[k], k); }
	//console.log('places', this.places)
}
function check_ref(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_ref', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToRefs(specKey, akku[k], k); }
	//console.log('places', this.places)
}


function recheckAllObjectsForLoc(R) {
	let locOids = [];
	for (const oid in R._sd) {
		let o = R.getO(oid);
		if (o.loc) locOids.push(oid);
	}
	CYCLES = 0; //MAX_CYCLES=10;
	while (true) { //find next loc oid with existing parent!
		CYCLES += 1; if (CYCLES > MAX_CYCLES) { console.log('MAX_CYCLES reached!'); return; }
		let locOidsStart = jsCopy(locOids);
		let oid = find_next_loc_oid_with_new_parent(locOids, R);
		if (!oid) {
			//console.log('cannot add any other object!', '\nstart',locOidsStart,'\nfailed:',failedLocOids,'\nCYCLES',CYCLES);
			return;
		}
		let o = R.getO(oid);
		let success = einhaengen(oid, o, R);
		if (!success) {
			removeInPlace(locOids, oid);
			if (!isEmpty(R.getR(oid))) addIf(failedLocOids, oid);
		}
		if (isEmpty(locOids)) {
			if (isEmpty(failedLocOids)) {
				console.log('both locOids and failedLocOids empty!', '\nCYCLES', CYCLES)
				return;
			} else { locOids = failedLocOids; failedLocOids = []; }
		}

		let locOidsEnd = jsCopy(locOids);
		if (sameList(locOidsStart, locOidsEnd) || sameList(locOidsStart, failedLocOids)) {
			//console.log('cant add more oids', '\nstart', locOidsStart, '\nend', locOidsEnd, '\nfailed:', failedLocOids, '\nCYCLES', CYCLES);
			return;
		}
	}
}
