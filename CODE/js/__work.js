function calcContentFromData(oid, o, data, R, default_data) {

	// ex: data: .player.name
	if (!o) return data; //static data

	if (isLiteral(data)) {
		if (isString(data)) {
			if (data[0] != '.') return data;

			//console.log('PATH:', data, 'oid', oid, 'o', o);
			let props = data.split('.').slice(1);
			//console.log('props', props, isEmpty(props));
			//bei '.' kommt da [""] raus! also immer noch 1 empty prop!

			if (props.length == 1 && isEmpty(props[0])) return o;

			else {
				//console.log('___________',props)
				let res = dPP1(o, props, R);
				if (res) return res;
			} 

		} else {
			//it's a literal but NOT a string!!!
			return data;
		}
	}
	else if (isDict(data)) {
		//beispiel? data is dictionary {vsp:.vsp,money:.money}
		let content = {};
		for (const k in data) {
			let c = calcContentFromData(oid, o, data[k], R);
			if (c) content[k] = c;
		}
		return content;
	} else if (isList(data)) {
		//ex: data:[.vps, .money]
		let content = data.map(x => calcContentFromData(oid, o, x, R));
		return content;
	}

	if (isdef(default_data)) {
		//console.log('need to call CalcContentFromData again!!!', default_data);
		let finalRes = calcContentFromData(oid, o, default_data, R);
		//console.log('finalRes',finalRes)
		return finalRes;
	}else	return null;

}























function replaceIdName(sssname, R, workingSpec) {
	//let orig = R.lastSpec;
	// let workingSpec = R.workingSpec; //das ist die spec die veraendert wird!!!
	let newSpecNodeUids={};
	//let new

	for (const id of R.idarr) {
		let name = id.idName;
		if (name != sssname) continue;
		let spk = id.specKey;
		let idpath = id.ppath;
		//find place where to put the _NODE
		let [key, obj] = findAddress(spk, workingSpec, idpath);
		let sub = [];

		//combine all refs that have this name
		for (const ref of R.refarr) {
			if (ref.idName != name) continue;

			let idnode = obj[key];
			let uid = getUID('sp');
			newSpecNodeUids[uid]={uid:uid,ref:ref,id:id};
			//console.log('key',key,'\nidnode',idnode)
			//#region other versions

			//v_orig!
			// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
			// sub.push({ _NODE: uid });

			//v_2
			// idnode = safeMerge(idnode,id_entry.node);
			// sub.push({ _NODE: uid });

			//v_3:
			// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
			// sub.push({ _NODE: uid });
			// //console.log('------> merged alte version',jsCopy(merged))
			//hier muss genauso gemerged werden wie bei _NODE!

			//v_4:
			// let merged = merge1(idnode, ref_entry.node);
			// sub.push({ _NODE: uid });
			// //console.log('------> merged idnode zuerst',jsCopy(merged))

			//v_5 (fail_klappt_mit_panel):
			// let merged = jsCopy(ref_entry.node);
			// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
			// //console.log('------> merged nur ref node!',jsCopy(merged))

			//v_6:
			// let merged = merge1(ref_entry.node,idnode);
			// sub.push({ _NODE: uid });
			// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);


			//v_7:
			//#endregion

			let merged;
			if (isdef(idnode._merge) && idnode._merge == 'blend') {
				merged = merge1(ref.node, idnode);
				sub.push({ _NODE: uid });
				//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
			} else {
				//default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
				merged = jsCopy(ref.node);
				let resultNode = jsCopy(idnode);
				resultNode._NODE = uid;
				delete resultNode._id;
				//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))
				//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
				sub.push(resultNode);
			}
			//das geht nicht!!!
			delete merged._ref; //*** */
			delete merged._id; //*** */
			workingSpec[uid] = merged;
			
		}

		//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
		if (sub.length == 0) {
			//no ref exists for this id! (in ALL of spec!!!!!)
			//if name is name of spec node, replace by that name
			//otherwise error!
			if (isdef(R.lastSpec[name])) {
				obj[key]._NODE = name; //!!!!!!!!!!!!
				delete obj[key]._id;
				//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
				alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
			} else {
				//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
			}
		} else if (sub.length == 1) {
			if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
				let x = obj[key]._NODE;
				if (isList(x)) {
					//das _id ist sub[0]._NODE
					//das orig _NODE ist eine liste x=[A,B,...]
					//x.push(sub[0]._NODE);
					x.unshift(sub[0]._NODE);
					obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
				} else {
					obj[key]._NODE = [x, sub[0]._NODE];
				}
				//console.log('resulting obj', obj[key])
			} else obj[key] = sub[0];
		} else {
			let res = obj[key];
			if (isdef(res._NODE)) {
				//in jedes sub muss ich 
				let x = res._NODE;
				for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
				obj[key] = { sub: sub };
			} else obj[key] = { sub: sub };
		}
		//hiermit is _id:name abgebaut fuer alle refs darauf!
	}

	//console.log('_________GEN:',gen);
	
	return newSpecNodeUids;



}





























//#region aufarbeiten noch von merge stuff
function check_prop(specKey, node, prop, dResults, R) {
	let akku = {};
	recFindProp(node, prop, 'self', akku);
	for (const k in akku) {
		let node = akku[k].node;
		let path = k;
		let name = akku[k].name;
		lookupAddToList(dResults, [name], { name: name, specKey: specKey, ppath: path, node: node });
	}
}





function recMergeSpecNode(n, sp, spNew) {
	if (isList(n._NODE)) {
		//console.log('+++++++++',n)
		let lst = n._NODE;
		//console.log(lst)
		let combiName = getCombNodeName(lst);
		let nComb = {};
		for (const name of lst) {
			//console.log(name)
			nComb = mergedSpecNode(nComb, sp[name]);
		}
		spNew[combiName] = nComb;
		n._NODE = combiName;
	}
	if (isdef(n.sub)) {
		for (const n1 of n.sub) recMergeSpecNode(n1, sp, spNew);
	}

}

function mergedSpecNode(n1, n2) {
	//console.log(n1,n2)
	if (nundef(n1.cond) && nundef(n2.cond)) {
		return merge1(n1, n2);// deepmerge(merged, nSpec);
	} else {
		return deepmerge(n1, n2); //,{dataMerge: 'none'});// deepmerge(merged, nSpec);
	}
}
function makeMergedSpecNodes_dep(nodeNameList, n, R) {
	let mergedCondNodes = {};
	let mergedNoCondNodes = {};
	//let merged = {};//jsCopy(n);
	let newNodeList = [];
	let hereList = [];
	for (const name of nodeNameList) {
		let nSpec = R.getSpec(name);
		if (nundef(nSpec.cond)) {
			mergedNoCondNodes = merge1(mergedNoCondNodes, nSpec);// deepmerge(merged, nSpec);
			if (isdef(nSpec._NODE)) addIf(newNodeList, nSpec._NODE);
		} else {
			mergedCondNodes = deepmerge(mergedCondNodes, nSpec); //,{dataMerge: 'none'});// deepmerge(merged, nSpec);
			if (isdef(nSpec._NODE)) addIf(hereList, nSpec._NODE);
		}
	}
	return [mergedCondNodes, mergedNoCondNodes, newNodeList, hereList];
}
function getCombNodeName(namelist) {
	return namelist.join('_');
}



function mergeArr(a, b, opt) {
	var res = a.slice()
	b.forEach(function (e, i) {
		if (typeof res[i] === 'undefined') { //el[i] nur in source
			res[i] = cloneIfNecessary(e, opt)
		} else if (isDictOrList(e)) { //el[i] in beidem
			res[i] = dm1(a[i], e, opt);
		} else if (a.indexOf(e) === -1) { //el[i] nur in target
			res.push(cloneIfNecessary(e, opt));
		}
	})
	return res
}
function mergeObj_dep(a, b, opt) {
	var res = {}
	if (isDictOrList(a)) {
		Object.keys(a).forEach(function (key) {
			res[key] = cloneIfNecessary(a[key], opt);
		})
	}
	Object.keys(b).forEach(function (key) {
		let func = opt.func;
		if (func) {
			res[key] = func(a[key], b[key], opt);
		} else if (!isDictOrList(b[key]) || !a[key]) {

			//console.log('das sollte bei data triggern!',key,source[key])
			res[key] = cloneIfNecessary(b[key], opt);
		} else {
			res[key] = dm1(a[key], b[key], opt);
		}
	})
	return res;
}
function dm1(a, b, opt) {
	//console.log('a',a,'b',b);
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (Array.isArray(b)) {
		return Array.isArray(a) ? mergeArr(a, b, opt) : cloneIfNecessary(b, opt);
	} else {
		return mergeObj(a, b, opt);
	}
}
function mergeObj(a, b, opt) {
	//console.log('a',a)
	var res = {}
	if (nundef(a)) return b;
	else if (nundef(b)) return a;
	else if (isLiteral(a)) return b;
	else if (isLiteral(b)) return a;
	else if (isDictOrList(a)) {
		Object.keys(a).forEach(function (key) {
			res[key] = cloneIfNecessary(a[key], opt);
		})
	};
	Object.keys(b).forEach(function (key) {
		let func = opt[key];
		if (!res[key]) {
			//console.log('hier!!!')
			res[key] = isLiteral(b[key]) ? b[key] : jsCopy(b[key]); //cloneIfNecessary(b[key], opt);
		} else if (func) {
			//console.log('have custom func:',key,func);
			res[key] = func(a[key], b[key], opt);
			//console.log('...','a',a[key],'b',b[key],res[key]);
		} else if (isLiteral(a[key])) {
			res[key] = cloneIfNecessary(b[key], opt);//override a
		} else {
			res[key] = dm1(a[key], b[key], opt);
		} //else if (!isDictOrList(b[key]) || !a[key]) {			res[key] = cloneIfNecessary(b[key], opt);		} 

	})
	return res;
}

function merge1(sp1, sp2, { dataMerge } = {}) {
	//console.log('calling dm1')
	//return merge(sp1,sp2);
	let options = {
		sub: (a, b, opt) => b.concat(a),
		data: (a, b, opt) => isLiteral(a) && isLiteral(b) ?
			nundef(dataMerge) || dataMerge == 'concat' ? a + ' ' + b
				: dataMerge == 'reverse' ? b + ' ' + a
					: b
			: dm1(a, b, opt),
		//params: (a, b, opt) => ({ bg: 'green' }),
	};
	return dm1(sp1, sp2, options);
}

//#endregion













function replaceIdNameNEINNEIN(name, R) {
	//return;
	let orig = R.lastSpec;
	let gen = jsCopy(R.lastSpec);

	//console.log(R.places);
	//how to get all places within a spec node?
	let byNode = {};
	for (const name in R.places) {
		let idByName = R.places[name];
		for (const spk in idByName) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!
			let list = idByName[spk];
			//console.log(list, typeof list);
			for (const el of list) {
				lookupAddToList(byNode, [spk], el);
			}
		}
	}
	//console.log('byNode', byNode);
	for (const spk in byNode) {
		let arr = byNode[spk];
		//console.log('arr', arr)
		sortByFuncDescending(arr, x => x.ppath.length);
		//console.log('sorted', arr);
	}

	for (const spk in byNode) {
		let idlistByNode = byNode[spk];
		for (const id_entry of idlistByNode) { //DIESES KOENNTE MAN STREICHEN! WENN EH NUR 1 incident!


			let name = id_entry.idName;

			replaceIdName(name, R);
			//let id_entry = idByName[spk][0]; //MUST BE UNIQUE!!! does NOT need to be a list!!!
			//console.log(id_entry);

			//console.log('calling findAddress', spk, gen, id_entry.ppath);
			let [key, obj] = findAddress(spk, gen, id_entry.ppath);

			let sub = [];
			//foreach existing ref to name 
			let refs = R.refs[name];
			for (const refSpecKey in refs) {
				let ref_entry = refs[refSpecKey][0]; // for now only allow UNIQUE _ref to same name in same spec node!!!
				//console.log('ref_entry',ref_entry);

				let idnode = obj[key];
				let uid = getUID('sp');
				//console.log('key',key,'\nidnode',idnode)

				//v_orig!
				// let merged = safeMerge(id_entry.node, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });

				//v_2
				// idnode = safeMerge(idnode,id_entry.node);
				// sub.push({ _NODE: uid });

				//v_3:
				// let merged = safeMerge(idnode, ref_entry.node); //HOW to merge each property?
				// sub.push({ _NODE: uid });
				// //console.log('------> merged alte version',jsCopy(merged))
				//hier muss genauso gemerged werden wie bei _NODE!

				//v_4:
				// let merged = merge1(idnode, ref_entry.node);
				// sub.push({ _NODE: uid });
				// //console.log('------> merged idnode zuerst',jsCopy(merged))

				//v_5 (fail_klappt_mit_panel):
				// let merged = jsCopy(ref_entry.node);
				// let resultNode = jsCopy(idnode); resultNode._NODE = uid; delete resultNode._add; sub.push(resultNode);
				// //console.log('------> merged nur ref node!',jsCopy(merged))

				//v_6:
				// let merged = merge1(ref_entry.node,idnode);
				// sub.push({ _NODE: uid });
				// //console.log('=>welcher soll als erstes stehen?','\nidnode',idnode,'\nref_entry.node',ref_entry.node,'\nmerged',merged);

				//v_7:
				let merged;
				if (isdef(idnode._merge) && idnode._merge == 'blend') {
					merged = merge1(ref_entry.node, idnode);
					sub.push({ _NODE: uid });
					//console.log('------> merged _merge=' + idnode._merge, jsCopy(merged));
				} else { //default merge mode: sub (sowie bei v_5 fail_klappt_mit_panel)
					//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node)
					merged = jsCopy(ref_entry.node);
					let resultNode = jsCopy(idnode);

					//console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)

					// if (isdef(idnode._NODE)) {
					// 	let x = idnode._NODE;
					// 	if (isList(x)) {
					// 		//console.log('bbbbbbbbbbbbbbbbbbbbbb x list!',x)
					// 		//das _id ist sub[0]._NODE
					// 		//das orig _NODE ist eine liste x=[A,B,...]
					// 		//x.push(sub[0]._NODE);
					// 		x.unshift(uid);
					// 		resultNode._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
					// 	} else {
					// 		resultNode._NODE = [x, uid];
					// 	}
					// 	//console.log('resulting obj', obj[key])
					// } else resultNode._NODE = uid;

					resultNode._NODE = uid;
					//console.log('================\nidnode', jsCopy(idnode), '\nrefnode', jsCopy(ref_entry.node), '\nresultnode', jsCopy(resultNode))

					//resultNode._NODE = uid;
					delete resultNode._id;
					//console.log('\nidnode', idnode, '\nrefnode', ref_entry.node, '\nresultnode', resultNode)
					sub.push(resultNode);
					//console.log('------> sub sub',sub);
				}

				delete merged._ref;
				delete merged._id;
				gen[uid] = merged;


			}

			//console.log('==>\nobj', obj, '\nkey', key, '\n?', obj[key]._NODE)
			if (sub.length == 0) {
				//no ref exists for this id! (in ALL of spec!!!!!)
				//if name is name of spec node, replace by that name
				//otherwise error!
				if (isdef(R.lastSpec[name])) {
					obj[key]._NODE = name; //!!!!!!!!!!!!
					delete obj[key]._id;
					//console.log('==> please replace _id by _NODE!', id_entry.specKey, id_entry.ppath, name, obj);
					alert('SPEC ERROR! =>please replace _id:' + name + ' by _NODE:', name);
				} else {
					//console.log('_id without any reference or node!', id_entry.specKey, id_entry.ppath, name, obj);
				}
				continue;
			}

			//console.log(obj, key, name)

			//console.log('SUB LENGTH===========',sub.length,sub)

			if (sub.length == 1) {
				if (isdef(obj[key]._NODE)) { //!!!!!!!!!!!!!!!!!!
					let x = obj[key]._NODE;
					if (isList(x)) {
						//das _id ist sub[0]._NODE
						//das orig _NODE ist eine liste x=[A,B,...]
						//x.push(sub[0]._NODE);
						x.unshift(sub[0]._NODE);
						obj[key]._NODE = jsCopy(x); // sub[0]._NODE[x, sub[0]._NODE];
					} else {
						obj[key]._NODE = [x, sub[0]._NODE];
					}
					//console.log('resulting obj', obj[key])
				} else obj[key] = sub[0];
			}
			else {
				//console.log('haaaaaaaaaaaaaaaalo');
				let res = obj[key];
				//console.log('res',jsCopy(res))
				if (isdef(res._NODE)) {
					//in jedes sub muss ich 
					let x = res._NODE;
					for (let i = 0; i < sub.length; i++) sub[i]._NODE = [x, sub[i]._NODE];
					obj[key] = { sub: sub };
				} else obj[key] = { sub: sub };
			}
		}
		//hiermit is _id:name abgebaut fuer alle refs darauf!
	}

	//console.log('_________GEN:',gen);
	R.gens[genKey].push(gen);
	R.lastSpec = gen;
	R.ROOT = R.lastSpec.ROOT;

}

