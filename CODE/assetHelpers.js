//uses assets! =>load after assets!
//#region maPic
function maPicText(info, dParent, styles = {}, classes) {

	let wTotal = isdef(styles.w) ? styles.w : 100;
	let hTotal = isdef(styles.h) ? styles.h : 100;
	// let padding = isdef(styles.padding) ? styles.padding : 0;
	// wTotal -= 2*padding;
	// hTotal -= 2*padding; //TODO koennte padx,pady machen!!!
	let rect = { w: wTotal, h: hTotal, cx: 120, cy: 100 };
	let text = info.text;

	let fg = isdef(styles.fg) ? styles.fg : null;

	let l = rect.cx - (rect.w / 2);
	let t = rect.cy - (rect.h / 2);
	let d;
	if (isdef(styles.x) || isdef(styles.y) || isdef(styles.left) || isdef(styles.top)) d = mDivPosAbs(l, t, dParent);
	else d = mDiv(dParent);
	// d.style.boxSizing = 'border-box';
	//d.style.display = 'inline';

	let dInner = fitWord(text, rect, d, {padding:0, bg: 'green', fg: fg, family: info.family, weight: 900 });//, padding: 0}); //, 'box-sizing': 'border-box' });
	
	
	
	let b = getBounds(dInner);
	console.log('inner bounds', b.width, b.height)
	console.log()

	//jetzt muss ich padding machen
	let padx=(wTotal-b.width)/2;
	let pady=(hTotal-b.height)/2;
	// console.log('padx',padx,'pady',pady);

	// let newStyles = jsCopy(styles);
	// if (isdef(newStyles.padding)) delete newStyles.padding;
	// mStyleX(d,newStyles);
	d.style.width = wTotal+'px';
	d.style.height = hTotal+'px';
	d.style.backgroundColor = 'red';
	d.style.padding = pady+'px '+padx+'px';

	info.ui = d;
	info.inner = dInner;

	let b1 = getBounds(dInner);
	console.log('inner bounds', b1.width, b1.height);
	console.log('...........',dInner.clientWidth,dInner.clientHeight)
	console.log(getBounds(dInner))
	setTimeout(()=>console.log(getBounds(dInner)),500)

	// d.style.display = 'inline-table';
	// d.style.width = wTotal+'px';

	return info;
}


//#region pic helpers
function picRandom(type, keywords) {
	let infolist = picSearch({ type: type, keywords: keywords });
	//console.log(infolist)
	return chooseRandom(infolist);
}
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
	if (nundef(keywords)) return isdef(func) ? func(dict) : dict2list(dict);
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
		let infolist = picSearch({ keywords: key });
		//console.log('result from picSearch(' + key + ')', infolist);
		if (infolist.length == 0) return null;
		else return chooseRandom(infolist);
	}
}














