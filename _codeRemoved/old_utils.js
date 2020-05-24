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
function sieveLocOids2(R){

	//nachdem any object geadded wurde, muss alle objects die loc haben re-checken ob
	//jetzt eine neue loc available ist die vorher nicht da war!

	let locOids = R.locOids;
	if (isEmpty(locOids)) return;
	let failedLocOids = [];
	CYCLES = 0; MAX_CYCLES=100;

	//prelim: for each locOid, count its existing uidParents:
	// let parCount={};
	// for(const oid of locOids){
	// 	let o = R.getO(oid);
	// 	//let oidParent = 
	// 	let top=einhaengen(oid,R.getO(oid),R);
	// 	parCount[oid]=top.length; //koennt auch gleich top selbst machen aber egal
	// }

	//now again try adding nodes until parent count does not change anymore for ALL locOids
	// let recycle=[];
	while(true){
		CYCLES += 1; if (CYCLES > MAX_CYCLES) { console.log('MAX_CYCLES reached!',CYCLES); return; }

		let changed=false;
		for(const oid of locOids){
			let top=einhaengen(oid,R.getO(oid),R);
			if (!isEmpty(top)) {changed=true;} //recycle.push(top);break;}
		}
		if (!changed) {
			console.log('done after',CYCLES,'cycles')
			break;
		}
	}

	return;
	//new code!
	let locsTodo={};
	let locsDone={};
	let oidParents = calcOidParentsForLocOids(); //these are oids looking for to position all loc objects!
	console.log(oidParents);

	while (true) { 
		CYCLES += 1; if (CYCLES > MAX_CYCLES) { console.log('MAX_CYCLES reached!'); return; }

		let locOidsStart = jsCopy(locOids);

		let oid = locOids[0];
		
		//calc locsTodo
		//calc uidParents for this oid

		//subtract locsDone
		//if still have locsTodo, try it
		//  if success, put in nextRound and add uidParents done to locsDone
		//  else put in nextRound
		//else 
		//when does this stop?
		//NONE of locOids has new parents!
		//if new node is added, immediately check if its oid is in locParents
		

		console.log(oid)
		let o = R.getO(oid);

		//brauch die info ob loc parent schon anwesend ist
		let success = einhaengen(oid, o, R);
		console.log('einhaengen von loc_oid='+oid,success);

		//remove von locOids, add to nextRound only if #parents has changed
		//wann muss ich noch mal versuchen?
		//
		let oidParent = o.loc;
		let curUidParentsByLoc = R.oid2uids[oidParent];
		let newParents = arrMinus(curUidParents,oldUidParents);
		


		if (success) {removeInPlace(locOids, oid);addIf(failedLocOids,oid);}
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

function sieveLocOids1(R){

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
			//there is still a possibility that this .loc object ALSO has a static location in tree!
			//how can I find this out??? >einhaengen schauen!
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
//TODO: THIS IS INEFFICIENT!!!! checking twice!!! should already return parents here!!!
function find_next_loc_oid_with_new_parent(locOids, R) {

	//TODO!!! HIER MUSS ICH AUCH CHECKEN OB DER PARENT EINEN ENSPRECHENDEN CHANNEL HAT!!!!!
	//WENN NICHT DANN GILT DER PARENT NICHT!!!!!!!!!!!!!!!!!!!!!

	//console.log('find_next_loc_oid_with_new_parent__', locOids);
	for (const oid of locOids) {
		let o = R.getO(oid); 
		let loc = o.loc;
		let oidParent = loc;

		let uidsParent=R.oid2uids[oidParent];
		console.log('parent',oidParent,'for oid='+oid,'has uids:',uidsParent);
		if (nundef(uidsParent)) continue;
		for(const uidParent of uidsParent){
			if (!parentHasThisChildAlready(uidParent,oid) && parentHasChannelForThisOid(R.rNodes[uidParent],oid)) return oid;
		}
	}
	//next find out if there is a place where 
	return null;
}


