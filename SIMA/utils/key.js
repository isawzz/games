function catFiltered(cats, name, best) {
	//console.log(cats, name)
	let keys = setCategories(cats);

	let bestName = null;
	let k1 = keys.filter(x => best.includes(x));
	if (k1.length > 80) bestName = name + '100';
	else if (k1.length > 40) bestName = name + '50';
	else if (k1.length > 20) bestName = name + '25';
	let result = {};
	result[name] = keys;
	if (bestName) result[bestName] = k1;

	return result;
}
function getKeySets() {
	let ks=localStorage.getItem('KeySets');
	if (isdef(ks)) return JSON.parse(ks);
	
	let allKeys = symKeysBySet.nosymbols;
	let keys = allKeys.filter(x => isdef(symbolDict[x].best100));
	let keys1 = allKeys.filter(x => isdef(symbolDict[x].best100) && isdef(symbolDict[x].bestE));
	let keys2 = allKeys.filter(x => isdef(symbolDict[x].best50));
	let keys3 = allKeys.filter(x => isdef(symbolDict[x].best25));
	let res = { best25: keys3, best50: keys2, best75: keys1, best100: keys, all: allKeys };
	let res1 = catFiltered(['nosymemo'], 'nemo', res.best100);
	let res2 = catFiltered(['animal', 'plant', 'fruit', 'vegetable'], 'life', res.best100);
	let res3 = catFiltered(['object'], 'object', res.best100);
	let res4 = catFiltered(['gesture', 'emotion'], 'emo', res.best100);
	let res5 = catFiltered(['activity', 'role', 'sport', 'sports', 'game'], 'action', res.best100);
	for (const o of [res1, res2, res3, res4, res5]) {
		for (const k in o) res[k] = o[k];
	}
	localStorage.setItem('KeySets',JSON.stringify(res));
	return res;

}