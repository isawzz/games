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
function sieveLocOids(R){

	//nachdem any object geadded wurde, muss alle objects die loc haben re-checken ob
	//jetzt eine neue loc available ist die vorher nicht da war!

	let locOids = R.locOids;
	let failedLocOids = [];
	CYCLES = 0; //MAX_CYCLES=10;
	while (true) { //find next loc oid with existing parent!
		CYCLES += 1; if (CYCLES > MAX_CYCLES) { console.log('MAX_CYCLES reached!'); return; }

		let locOidsStart = jsCopy(locOids);

		let oid = find_next_loc_oid_with_new_parent(locOids, R);
		if (!oid) {
			//console.log('cannot add any other object!', '\nstart',locOidsStart,'\nfailed:',failedLocOids,'\nCYCLES',CYCLES);
			return;
		}
		let o = R.getO(oid);//sdata[oid];
		let success = einhaengen(oid, o, R);
		console.log('einhaengen von loc_oid='+oid,success);
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
		//removeInPlace(locOids, oid); //remove it from locOids
		//if (isEmpty(locOids)) break;
	}
}
