//uses assets! =>load after assets!
//#region pic

function maPicRandom({type,func,hex,key,keywords,props,isAnd,justCompleteWords},dParent,styles,classes){
	let 
}

function picSearch({keywords,type,func,hex,key,props,isAnd,justCompleteWords}){
	//#region doc
	/*
usage: ilist=picSearch(['x','y','z'],'all',)

keywords ... list of strings or just 1 string  =>TODO: allow * wildcards!
type ... E [all,eduplo,iduplo,emo,icon] =>dict will be made from that!
func ... (dict,keywords) => infolist
hex ... hex key E symByHex =>TODO: allow * wildcards!
key ... some string  =>TODO: allow * wildcards! (use instead of keywords)

>the following params are used to select one of standard filter functions (see helpers region filter functions)
props ... list of properties to match with filter function
isAnd ... all keywords must match in filter function
justCompleteWords ... matches have to be complete words

returns list of info
	*/
	//#endregion
	let dict = picFilterDict(type);
	if (!isList(keywords)) keywords = [keywords];
	if (isString(propsOrFunc)) propsOrFunc = [propsOrFunc];

	let infolist = [];
	if (isList(propsOrFunc)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInPropsAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = allWordsContainedInProps(dict, keywords, propsOrFunc);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInPropsAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = anyWordContainedInProps(dict, keywords, propsOrFunc);
			}
		}
	} else if (!propsOrFunc) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInKeysAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = allWordsContainedInKeys(dict, keywords, propsOrFunc);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInKeysAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = anyWordContainedInKeys(dict, keywords, propsOrFunc);
			}
		}
	} else {
		//propList is a function!
		infolist = propsOrFunc(dict, keywords);
	}
	return infolist;
}
function picSearch_dep(keywords, type = null, propsOrFunc = null, isAnd = false, justCompleteWords = false) {
	//#region doc
	/*
usage: ilist=picSearch(['x','y','z'],'all',)
keywords ... list of strings or just 1 string
type ... E [all,eduplo,iduplo,emo,icon]
props
returns list of info
	*/
	//#endregion
	let dict = picFilterDict(type);
	if (!isList(keywords)) keywords = [keywords];
	if (isString(propsOrFunc)) propsOrFunc = [propsOrFunc];

	let infolist = [];
	if (isList(propsOrFunc)) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInPropsAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = allWordsContainedInProps(dict, keywords, propsOrFunc);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInPropsAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = anyWordContainedInProps(dict, keywords, propsOrFunc);
			}
		}
	} else if (!propsOrFunc) {
		if (isAnd) {
			if (justCompleteWords) {
				infolist = allWordsContainedInKeysAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = allWordsContainedInKeys(dict, keywords, propsOrFunc);
			}
		} else {
			if (justCompleteWords) {
				infolist = anyWordContainedInKeysAsWord(dict, keywords, propsOrFunc);
			} else {
				infolist = anyWordContainedInKeys(dict, keywords, propsOrFunc);
			}
		}
	} else {
		//propList is a function!
		infolist = propsOrFunc(dict, keywords);
	}
	return infolist;
}
