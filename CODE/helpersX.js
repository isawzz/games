//#region doc
/*
	helpersX.js contains super special helper library! (version iii)
*/
//#endregion

function allCondX(ad, func) {
	//#region doc 
	/*	
ad ... array or dictionary
func ... takes array elem or dict key and returns true or false
=>list of elements (with key:key in case of dictionary, unless this prop already exists?)
	*/
	//#endregion 
	//console.log('ad',ad,'func',func)
	let res = [];
	if (nundef(ad)) return res;
	else if (isDict(ad)) {
		for (const k in ad) {
			let v = ad[k];
			if (func(v)) { if (nundef(v.key)) v.key = k; res.push(v); }
		}
	} else {
		for (const a of ad) { if (func(a)) res.push(a) }
	}

	return res;

}
function firstCondX(ad, func, keysSorted) {
	//#region doc 
	/*	
ad ... array or dictionary
func ... takes array elem or dict key and returns true or false
keysSorted ... in case of a dictionary, if want keys sorted in some order, provide param keysSorted
=>first value that fullfills func or null (key added to value in case of dict!)
	*/
	//#endregion 
	if (nundef(ad)) return null;
	else if (isDict(ad)) {
		if (isdef(keysSorted)) {
			for (const k of keysSorted) {
				let v = ad[k];
				if (func(v)) { if (nundef(v.key)) v.key = k; return v; }
			}
		} else {
			for (const k in ad) {
				let v = ad[k];
				if (func(v)) { if (nundef(v.key)) v.key = k; return v; }
			}
		}
	} else {
		for (const a of ad) { if (func(a)) return a; }
	}

	return null;

}
function lastCondX(ad, func, keysSorted) {
	//#region doc 
	/*	
ad ... array or dictionary
func ... takes array elem or dict key and returns true or false
keysSorted ... in case of a dictionary, if want keys sorted in some order, provide param keysSorted
=>last value that fullfills func or null (key added to value in case of dict!)
	*/
	//#endregion 
	if (nundef(ad)) return null;
	else if (isDict(ad)) {
		if (isdef(keysSorted)) {
			for (let i = keysSorted.length - 1; i >= 0; i--) {
				let k = keysSorted[i];
				let v = ad[k];
				if (func(v)) { if (nundef(v.key)) v.key = k; return v; }
			}
		} else {
			for (const k in ad) { //no difference to firstCondDict really because keys are not sorted!
				let v = ad[k];
				if (func(v)) { if (nundef(v.key)) v.key = k; return v; }
			}
		}
	} else {
		for (let i = ad.length - 1; i >= 0; i--) { if (func(ad[i])) return ad[i]; }
	}

	return null;

}
