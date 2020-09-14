else if (isList(nodeName)) {
	let newNodeName = getUID();
	let newSpecNode = {};
	for(const k of nodeName){
		newSpecNode = safeMerge(newSpecNode, R.lastSpec[k]);
	}
	R.lastSpec[newNodeName]=newSpecNode;
	nodeName = n[expandProp]=newNodeName;
	// //mach eine superspec und dann dasselbe wie mit string
	// console.log('liste von _NODE', nodeName);
	// let superSpec = {};
	// let usedNames = [];
	// for (const name of nodeName) {
	// 	let nSpec1 = sp[name];
	// 	if (nundef(nSpec1.cond)) {
	// 		superSpec = safeMerge(superSpec, nSpec1);
	// 		console.log('new superSpec', superSpec);
	// 		usedNames.push(name);
	// 	}
	// }
	// console.log(superSpec);
	// let spUid = 'superSpec';
	// sp[spUid] = superSpec;
	// n._NODE = spUid;
	// return doExpands(n1, n, parent, sp, R, oid);
} 




















function calcAddressWithin(o, addr, R) {

	// ex: data: .player.name
	if (!o) return addr; //static data

	if (isLiteral(addr)) {
		if (isString(addr)) {
			if (addr[0] != '.') return addr;

			//console.log('PATH:', data, 'oid', oid, 'o', o);
			let props = addr.split('.').slice(1);
			//console.log('props', props, isEmpty(props));
			//bei '.' kommt da [""] raus! also immer noch 1 empty prop!

			if (props.length == 1 && isEmpty(props[0])) {
				console.log('ERROR!!!!!!!! sollte abgefangen werden!!!! props empty!')
				return o;
			}else if (props.length == 1){
				return {key:props[0],obj:o};
			}
			else{
				//take last property from props
				let key = last(props);
				let len = props.length;
				let props1=props.slice(0,len-1);
				//console.log('props',props,'props1',props1)
				return {key:key, obj:dPP(o, props1, R)};
			}

		} else {
			//it's a literal but NOT a string!!!
			return addr;
		}
	}
	else if (isDict(addr)) {
		//beispiel? data is dictionary {vsp:.vsp,money:.money}
		let content = {};
		for (const k in addr) {
			let c = calcAddressWithin(o, addr[k], R);
			if (c) content[k] = c;
		}
		return content;
	} else if (isList(addr)) {
		//ex: data:[.vps, .money]
		let content = addr.map(x => calcAddressWithin(o,x,R));
		return content;
	}
	return null;

}
