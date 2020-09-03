//uses assets! =>load after assets!
//#region maPic

function maPicText(o, dParent, styles, classes) {
	//#region doc 
	/*	
usage: info* = maPicText('hallo',table);

o ... string or info or param for picSearch
dParent ... div object
styles ... dict of styles
classes ... list of classes

effect: draws info object as TEXT (so for emo this means: emoNoto font text)

returns info* ... info with ui (so info.ui will be a div)
	*/
	//#endregion 
	let info = isdef(o.hexcode)?o:isString(o)?picInfo(o):picSearch(o);
	if (isList(info)) info=first(info);
	if (nundef(info)) return 'NOT POSSIBLE';

	//console.log(info);
	return info;
}

//#region pic helpers
function picSearch({ keywords, type, func, props, isAnd, justCompleteWords }) {
	//#region doc 
	/*	
usage: ilist = picSearch({ type: 'all', func: (d, kw) => allCondX(d, x => /^a\w*r$/.test(x.key)) });

keywords ... list of strings or just 1 string  =>TODO: allow * wildcards!
type ... E [all,eduplo,iduplo,emo,icon] =>dict will be made from that!
func ... (dict,keywords) => infolist

>the following params are used to select one of standard filter functions (see helpers region filter functions)
props ... list of properties to match with filter function
isAnd ... all keywords must match in filter function
justCompleteWords ... matches have to be complete words

returns list of info
	*/
	//#endregion 
	let dict = nundef(type) || type == 'all' ? symbolDict : symByType[type];
	//console.log('_____________',keywords,type,dict,func)
	if (!isList(keywords)) keywords = [keywords];
	if (isString(props)) props = [props];

	let infolist = [];
	if (isList(props)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = allWordsContainedInProps(dict, keywords, props);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInPropsAsWord(dict, keywords, props);
			} else {
				infolist = anyWordContainedInProps(dict, keywords, props);
			}
		}
	} else if (nundef(props) && nundef(func)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = allWordsContainedInKeys(dict, keywords);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInKeysAsWord(dict, keywords);
			} else {
				infolist = anyWordContainedInKeys(dict, keywords);
			}
		}
	} else if (isdef(func)) {
		//propList is a function!
		//console.log('calling func',dict,keywords)
		infolist = func(dict, keywords);
	}
	return infolist;
}
function picInfo(key) {
	//#region doc 
	/*	
usage: info = picInfo('red heart');

key ... string or hex key or keywords (=>in latter case will perform picSearch and return random info from result)

returns info
	*/
	//#endregion 
	if (isdef(symbolDict[key])) return symbolDict[key];
	else if (isdef(symByHex[key])) return symbolDict[symByHex[key]];
	else {
		let infolist = picSearch({keywords:key});
		//console.log('result from picSearch(' + key + ')', infolist);
		if (infolist.length == 0) return null;
		else return chooseRandom(infolist);
	}
}














