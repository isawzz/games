function setKeys_NEIN({ nMin, lang, key, keysets, filterFunc, confidence, sortByFunc } = {}) {

	let keys = jsCopy(keysets[key]);
	let diff = nMin - keys.length;
	let additionalSet = diff > 0 ? firstCondDictKey(keysets, k => k != key && keysets[k].length > diff) : null;
	if (additionalSet) keys = keys.concat(keysets[additionalSet]);

	let result = [];
	let other = [];
	for (const k of keys) {
		let info = symbolDict[k];
		let klang = 'best' + lang;
		//console.log(k,lang,klang)
		if (nundef(info[klang])) info.klang = lastOfLanguage(k, lang);
		info.best = info[klang];
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { result.push(k); } else { other.push(k); }
	}

	//if result does not have enough elements, take randomly from other
	let len = result.length;
	let nMissing = nMin - len;
	if (nMissing > 0) {let list = choose(other,nMissing); result=result.concat(list);}

	if (isdef(sortByFunc)) { sortBy(result, sortByFunc); }

	console.assert(result.length>=nMin);
	return result;
}

//#region key selection: setKeys_
function setKeys_vorSIMA({ lang, nbestOrCats, filterFunc, confidence, sortByFunc } = {}) {

	let nbest, cats;
	if (isNumber(nbestOrCats)) { nbest = nbestOrCats; }
	else cats = nbestOrCats;

	let keys = [];
	if (isdef(nbest)) {
		let setname = 'best' + nbest;
		keys = jsCopy(KeySets[setname]);
	} else {
		if (nundef(cats)) cats = 'nosymbols';
		if (isString(cats)) cats = [cats];
		keys = setCategories(cats);
	}

	let result = [];
	for (const k of keys) {
		let info = symbolDict[k];
		let klang = 'best' + lang;
		//console.log(k,lang,klang)
		if (nundef(info[klang])) info.klang = lastOfLanguage(k, lang);
		info.best = info[klang];
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { result.push(k); }
	}
	if (isdef(sortByFunc)) { sortBy(result, sortByFunc); }
	return result;
}

//#endregion

