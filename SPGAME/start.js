window.onload = _preloader;
window.onunload = saveUser;


async function _start() {
	initLive(); initTable(); initSidebar(); initAux(); initScore(); initSymbolTableForGamesAddons(); //creates Daat
	addonFeatureInit(); //new API!
	Speech = new SpeechAPI('E');
	KeySets = getKeySetsX();

	if (IS_TESTING) loadUser(Username); else loadUser(); console.assert(isdef(G));

	if (EXPERIMENTAL) { _experimental(); }
	else if (ALLOW_CALIBRATION) show('dCalibrate');
	else if (SHOW_FREEZER) show('freezer');
	else startUnit();

}

function getOperand(type) {
	let x = OPS[type];
	return randomNumber(x.min, x.max);
}
function all2DigitFractionsExpanded() {
	let f = all2DigitFractions();
	let res = [];
	for (const i in f) {
		for (const j of f[i]) {
			res.push({ numer: i, denom: j });
		}
	}
	return res;
}
function all2DigitFractionsUnder1Expanded() {
	let f = all2DigitFractionsUnder1();
	let res = [];
	for (const i in f) {
		for (const j of f[i]) {
			res.push({ numer: i, denom: j });
		}
	}
	return res;
}
function all2DigitFractions() {
	let fr = {
		1: [2, 3, 4, 5, 6, 7, 8, 9],
		2: [3, 5, 7, 9],
		3: [2, 4, 5, 7, 8],
		4: [3, 5, 7, 9],
		5: [2, 3, 4, 6, 7, 8, 9],
		6: [5, 7],
		7: [2, 3, 4, 5, 6, 8, 9],
		8: [3, 5, 7, 9],
		9: [2, 4, 5, 7, 8],
	};
	return fr;
}
function fractionsUnder1ByDenominator() {
	let fr = {
		2: [1],
		3: [1, 2],
		4: [1, 3],
		5: [1, 2, 3, 4],
		6: [1, 5],
		7: [1, 2, 3, 4, 5, 6],
		8: [1, 3, 5, 7],
		9: [1, 2, 4, 5, 7, 8],
	};
	return fr;
}

function all2DigitFractionsUnder1() {
	let fr = {
		1: [2, 3, 4, 5, 6, 7, 8, 9],
		2: [3, 5, 7, 9],
		3: [4, 5, 7, 8],
		4: [5, 7, 9],
		5: [6, 7, 8, 9],
		6: [7],
		7: [8, 9],
		8: [9],
	};
	return fr;
}

function simplifyFraction(numerator, denominator) {
	var gcd = function gcd(a, b) {
		return b ? gcd(b, a % b) : a;
	};
	gcd = gcd(numerator, denominator);
	return [numerator / gcd, denominator / gcd];
}

function instantiateNumbersIncludingFractions(wp) {
	//sol = simplify({N2(3,8)}/{N1(12,24)})
	let sol = wp.sol;
	console.log('________________sol', sol)
	let parts = sol.split('{');
	let di = {};
	let newSol = '';
	//replacing Ni in sol
	for (const p of parts) {
		if (p[0] == 'N') {
			let key = p.substring(0, 2);
			let n;
			console.log('p', p)
			if (p[2] == '(') {
				let nums = stringBetween(p, '(', ')');
				let lst = allNumbers(nums);
				if (lst.length <= 3 && lst[0] <= lst[1]) {
					n = randomNumber(...lst);
				} else {
					n = chooseRandom(lst);
				}
			} else {
				n = randomNumber(2, 9);
			}
			//now replace {N1(3,8)} by eg. 4
			let rest = stringAfter(p, '}');
			newSol += '' + n + rest;
			di[key] = n;

		} else newSol += p;
	}

	console.log('newSol', newSol);
	//all Ni are now replaced by corresponding ranges
	let res = eval(newSol);

	console.log('res of simplify', res);
	let numResult = res[0] / res[1];
	let textResult = numResult == Math.round(numResult) ? numResult : '' + res[0] + '/' + res[1];
	wp.result = { number: numResult, text: textResult };

	//replacing Ni and {F...} in text
	let text = wp.text;
	for (const k in di) {
		if (k == 'R') continue;
		text = replaceAll(text, '{' + k + '}', di[k]);
	}

	console.log('_________ text', text);
	parts = text.split('{');
	let tnew = '';
	for (const p of parts) {
		if (p[0] == 'F') {
			//parser numbers
			let s = stringBefore(p, '}');
			console.log('s', s)
			let [n, d] = allNumbers(s);
			tnew += getTextForFraction(n, d);
			tnew += '; ' + stringAfter(p, '}');
		} else tnew += p;
	}
	text = tnew;

	wp.text = text;

	mText(wp.text, dTable)
}
function instantiateNumbers(wp) {

	let text = wp.text;

	//sol = R*N2=N1
	let sol = wp.sol;
	let rhs = stringBefore(sol, '=');
	let type = rhs.includes('*') ? rhs.includes('R') ? 'div' : 'mult' : rhs.includes('R') ? 'minus' : 'plus';
	//replace R and Nx in rhs by operands
	let i = 0;
	let diop = {};
	while (i < rhs.length) {
		if (rhs[i] == 'R') { diop.R = getOperand(type); i += 1; }
		else if (rhs[i] == 'N') {
			i += 1;
			let inum = Number(rhs[i]);
			let k = 'N' + inum;
			diop[k] = getOperand(type);
			i += 1;
		} else i += 1;

	}
	//replace in sol each rhs by its operand, the eval rhs
	let eq = rhs;
	for (const k in diop) {
		eq = eq.replace(k, diop[k]);
	}
	// console.log('eq',eq);
	let result = eval(eq);
	// console.log('result',result);

	//now, assign result to lhs
	let lhs = stringAfter(sol, '=');
	diop[lhs] = result;

	// console.log('_______diop',diop);

	//now replace each key in text by diop[key] and sett wp.result to diop.R
	wp.result = { number: diop.R, text: '' + diop.R };
	for (const k in diop) {
		if (k == 'R') continue;
		text = text.replace('{' + k + '}', diop[k]);
	}
	wp.text = text;
}
function instantiateNames(wp) {
	let text = wp.text;
	let parts = text.split('{');
	console.log('parts', parts);
	let diNames = {};
	let tnew = '';
	let allNames = jsCopy(arrPlus(GirlNames, BoyNames));
	let gNames = jsCopy(GirlNames);
	let bNames = jsCopy(BoyNames);

	if (!startsWith(text, '{')) { tnew += parts[0]; parts = parts.slice(1); }
	for (const part of parts) {
		let textPart = stringAfter(part, '}');
		let key = part.substring(0, 2);
		console.log('key', key);

		if (['G', 'B', 'P'].includes(part[0])) {
			let nlist = part[0] == 'P' ? allNames : part[0] == 'B' ? bNames : gNames;
			if (isdef(diNames[key])) {
				tnew += ' ' + diNames[key];
			} else {
				diNames[key] = chooseRandom(nlist);
				removeInPlace(nlist, diNames[key]);
				removeInPlace(allNames, diNames[key]);
				tnew += ' ' + diNames[key];
			}
		}
		tnew += ' ' + textPart.trim();
	}
	wp.text = tnew.trim();
}
function instantiateFractions(wp) {
	let text = wp.text;
	let parts = text.split('{');
	console.log('parts', parts);
	let tnew = '';
	if (!startsWith(text, '{')) { tnew += parts[0]; parts = parts.slice(1); }
	let denom;
	for (const part of parts) {
		let textPart = stringAfter(part, '}');
		let key = part.substring(0, 2);
		console.log('key', key);
		if (part[0] == 'F') { //{Fa/b}
			let numer = part[1] == 'a' ? 1 : isdef(denom) ? denom : randomNumber(2, 8);
			if (nundef(denom)) {
				denom = numer <= 2 ? randomNumber(numer + 1, 9) :
					numer < 9 ? coin() ? randomNumber(2, numer - 1) : randomNumber(numer + 1, 9) : randomNumber(2, number - 1);
			}
			tnew += ' ' + getTextForFraction(numer, denom);
			operands.push(numer / denom);
		}
		tnew += ' ' + textPart.trim();
	}
	wp.text = tnew.trim();
}
function instantiateWP(wp) {

	if (wp.title.includes('Fractions')) instantiateNumbersIncludingFractions(wp); else instantiateNumbers(wp);

	instantiateNames(wp);

	console.log('wp', wp.text, wp.result);
}
function evalWP(wp) {
	let title = wp.title;
	if (title.includes('Adding') && !titla.includes('Fractions')) {

	}
}


var FASTSTART = false && EXPERIMENTAL;
async function _preloader() {
	timit = new TimeIt('timit', EXPERIMENTAL);

	if (FASTSTART) {
		let syms = localStorage.getItem('syms');
		if (isdef(syms)) {
			console.log('from local');
			Syms = JSON.parse(syms);
		} else {
			Syms = await route_path_yaml_dict('../assets/syms.yaml');
			localStorage.setItem('syms', JSON.stringify(Syms));
		}
		SymKeys = Object.keys(Syms);
		dTable = mBy('table');
		mText('hallo', dTable, { fz: 100 });
		//test10_syms();
		timit.show('DONE')
	} else _loader();
}
async function _loader() {

	if (!IS_TESTING) {
		ifPageVisible.on('blur', function () {
			// example code here..
			//animations.pause();
			enterInterruptState();
			console.log('stopping game', G.id)
		});

		ifPageVisible.on('focus', function () {
			// resume all animations
			// animations.resume();
			if (isdef(G.instance)) {
				//cleanupOldGame();//this saves user data + clears the score.nTotal,nCorrect,nCorrect1!!!!!
				setGame(G.id);
			}
			closeAux();
			startGame();
			// auxOpen = false;
			// startGame();
			console.log('restarting game', G.id)
		});
	}
	// if ('serviceWorker' in navigator) {
	// 	console.log('CLIENT: service worker registration in progress.');
	// 	navigator.serviceWorker.register('/service-worker.js').then(function() {
	// 		console.log('CLIENT: service worker registration complete.');
	// 	}, function() {
	// 		console.log('CLIENT: service worker registration failure.');
	// 	});
	// } else {
	// 	console.log('CLIENT: service worker is not supported.');
	// }

	//timit = new TimeIt('start');
	if (BROADCAST_SETTINGS) {
		console.log('...broadcasting ...')
		await broadcastSIMA();
		_start();
	} else { loadSIMA(_start); }

}
function getTextForFraction(num, denom) { return '&frac' + num + denom; }

async function makeWordProblemsDict() {
	let wp = await route_path_text('../assets/math/hallo.txt');
	wp = wp.split('*');
	wp.splice(0, 1);
	//console.log('WordProblems', wp);
	let wpDict = {}; let wpList = [];
	for (const line of wp) {
		let index = firstNumber(line);
		let rest = stringAfter(line, '.');
		let title = stringBefore(rest, ':').trim();
		let sol = firstNumber(stringAfter(rest, '@'));
		let text = stringBetween(rest, ':', '@').trim();


		//replace names by $NAME replace numbers by $N 
		//console.log(text)
		let nums = allNumbers(text);
		let inum = 0;
		let ersetzer = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9 };
		let kers = Object.keys(ersetzer);
		if (nums) {
			for (const n of nums) {
				let s = n.toString();
				//console.log('found number', s)
				let i = s.indexOf(text);
				let len = s.length;
				text = text.replace(s, '{N' + kers[inum] + '}');
				inum += 1;
			}
			//console.log('in',index,stringBefore(title,' '),'found',nums,sol)
		}
		//now have to ersetz $N[ersetzerKey by] $N[ersetze[ersetzerKey]]
		//console.log('inum is',inum)
		for (let j = 0; j < inum; j++) {

			let s = '{N' + kers[j];
			let by = '{N' + ersetzer[kers[j]];
			//console.log('text',text,'\nlooking for',s,'repl by',by);
			//console.log(text.includes(s));
			text = replaceAllSpecialChars(text, s, by);
			//console.log('==>',text)
		}

		//replace *** FRACTIONS *** haendisch gemacht!
		// if (title.includes('Fractions')) {
		// 	let parts = text.split('${F');
		// 	text = parts[0];
		// 	console.log('parts', parts);
		// 	for (let i = 1; i < parts.length; i++) {
		// 		//now parts[i] starts with a a/b fraction!
		// 		// a soll IMMER mit 1 replaced werden!!!
		// 		if (parts[i])

		// 	}
		// }
		//return;


		let iname = 1;
		for (const name of PersonNames) {
			if (text.includes(name)) {
				text = replaceAll(text, name, '{P' + iname + '}');
				iname += 1;
			}
		}

		let p = { index: index, title: title, sol: sol, text: text };
		wpList.push(p);

		if (startsWith(title, 'Adding')) {
			lookupAddIfToList(wpDict, ['plus'], p);
			delete p.sol;
		}



	}
	downloadAsYaml(wpList, 'wp');
	console.log('dict', wpDict);
	downloadAsYaml(wpDict, 'wp');
	return wpDict;
}
async function makeDictionaries() {
	// let ddd = await route_path_yaml_dict('../assets/ddAlles.yaml');
	// console.log(ddd)
	let ddd = await route_path_text('../assets/speech/ddAlles.txt');
	console.log(ddd)
	let lines = ddd.split('\n');
	console.log(lines);
	let newLines = [];
	let deDict = {};
	let deNouns = {};
	let edDict = {};
	let edNouns = {};
	for (let i = 0; i < lines.length; i++) {
		let l = lines[i];
		if (startsWith(l, 'German')) console.log(l);
		else if (startsWith(l, 'A ')) console.log(l);
		else {
			newLines.push(l);
			let d = stringBefore(l, ' :');
			// let info={isNoun:false};
			let gen = null;
			if (d.includes('{')) {
				let parts = d.split('{');
				d = parts[0].trim();
				gen = stringBefore(parts[1], '}').trim();
				// d=stringBefore(d,'{').trim();
				// let gen = stringBefore(stringAfter(d,'{'),'}');
				//info = {isNoun:true,gen:gen};
				lookupSet(deDict, [d, 'gen'], gen);
				lookupSet(deNouns, [d, 'gen'], gen);
			}
			let elist = stringAfter(l, ': ').split(',').map(x => x.trim());
			for (const e of elist) {
				lookupAddIfToList(deDict, [d, 'e'], e);
				lookupAddIfToList(edDict, [e, 'd'], d);
				if (isdef(gen)) {
					lookupAddIfToList(edNouns, [e, 'd'], d);
					lookupAddIfToList(deNouns, [d, 'e'], e);
				}
			}
			// deDict[d].info=info;
		}
		//if (i>100) break;
	}
	console.log(deDict);
	console.log(edDict);
	downloadTextFile(newLines.join('\n'), 'ddText', ext = 'txt')
	downloadAsYaml(deDict, 'deDict');
	downloadAsYaml(edDict, 'edDict');
	downloadAsYaml(deNouns, 'deNouns');
	downloadAsYaml(edNouns, 'edNouns');
}
async function updateSymbolDictFromDictionaries() {
	// [EdDict,DeDict]=await loadGermanNouns();
	[EdDict, DeDict] = await loadGerman();
	let ekeys = Object.keys(EdDict);
	let lowerEKeys = ekeys.map(x => x.toLowerCase());
	console.log('dict e=>d', ekeys);

	ensureSymByType();
	let keys = symKeysByType['icon']; //symbolKeys;
	console.log('keys', keys);
	let inter = intersection(keys, lowerEKeys);
	console.log('intersection:', inter);

	//von denen die in der intersection sind, gibt ihnen eine translation to german und save again in symbolDict!

	for (const k of inter) {
		let entry = lookup(EdDict, [k, 'd']);
		if (nundef(entry)) {
			console.log('gibt es nicht!', k)
		} else {
			console.log('entry', entry)
			console.log('JA!', k, entry.join('|'));
			symbolDict[k].D = entry.join('|').toLowerCase();
			symbolDict[k].E = k;
		}
	}
	downloadAsYaml(symbolDict, 'symbolDict');

}
async function loadGerman(justNouns = false) {
	let root = justNouns ? 'Nouns' : 'Dict';
	let ed = await route_path_yaml_dict('../assets/speech/ed' + root + '.yaml');
	let de = await route_path_yaml_dict('../assets/speech/de' + root + '.yaml');
	//alle keys sollen immer lower case sein!

	return [ed, de];

}
function recomputeBestED() {
	for (const k in symbolDict) {
		let info = symbolDict[k];
		if (info.type == 'emo' && isString(info.D) && isString(info.E)) {
			info.bestD = stringAfterLast(info.D, '|').trim().toLowerCase();
			info.bestE = stringAfterLast(info.E, '|').trim().toLowerCase();
		} else if (nundef(info.E) || isNumber(info.E) || isdef(info.bestE)) continue;

		// console.log('info.E', info.E, k);

		if (info.type == 'emo') continue;

		if (info.E.includes('|')) {
			console.log('he das gibt es doch nicht!!!', k, info);
		} else {
			info.bestE = info.E;
		}
		if (nundef(info.D)) {
			console.log('he das gibt es doch nicht!!! KEIN DEUTSCH!', k, info);
		} else {
			info.bestD = stringBefore(info.D, '|').trim().toLowerCase();
		}
	}

	downloadAsYaml(symbolDict, 'sym');

}
function generateWordFiles() {
	let i = 0; let n = 13000; let len = symbolKeys.length;
	while (i < len) {
		wordsFromToText(i, n);
		i += n;
	}
}
function wordsFromToText(i, n = 300) {
	let list = [];
	for (const k in symbolDict) {
		let info = symbolDict[k];
		if (nundef(info.bestE) || !isString(info.bestE) || info.bestE.length < 2) continue;
		addIf(list, info.bestE);
	}
	//divide list into chunks of under 3900 characters each!
	let sfromi = arrFromIndex(list, i);
	s300 = arrTake(sfromi, n);
	let s = s300.join('\n');
	console.log(s);
	downloadTextFile(s, 'words_' + i);
	// downloadTextFile(s1.join('\n'),'words1');
	// downloadTextFile(srest.join('\n'),'words2');

}
async function wegMitwh() {
	let syms = await route_path_yaml_dict('../assets/syms.yaml');
	let newSyms = {};
	for (const k in syms) {
		let info = jsCopy(syms[k]);
		info.w = info.w[0];
		info.h = info.h[0];

		newSyms[k] = info;
	}
	downloadAsYaml(newSyms, 'syms');
}
async function makeNewSyms() {
	let etext = await route_path_text('../assets/speech/di/_wE.txt');
	// console.log(etext);
	let ew = etext.split('\n');
	console.log('eng', ew);
	let dtext = await route_path_text('../assets/speech/di/_wD.txt');
	let ftext = await route_path_text('../assets/speech/di/_wF.txt');
	let stext = await route_path_text('../assets/speech/di/_wS.txt');
	let ctext = await route_path_text('../assets/speech/di/_wC.txt');
	let dw = dtext.split('\n');
	let fw = ftext.split('\n');
	let sw = stext.split('\n');
	let cw = ctext.split('\n');
	let edict = {};
	for (let i = 0; i < ew.length; i++) {
		edict[ew[i]] = { E: ew[i], D: dw[i], F: fw[i], S: sw[i], C: cw[i] };
	}
	let symNew = {};
	for (const k in symbolDict) {
		let info = symbolDict[k];
		let inew = {};
		for (const k1 of ['key', 'hexcode', 'hex', 'family', 'text', 'type', 'isDuplicate']) {
			if (isdef(info[k1])) inew[k1] = info[k1];
		}
		inew.w = info.w;
		inew.h = info.h;
		let wk = inew.E = isdef(info.bestE) ? info.bestE : k;
		let e = edict[wk];
		if (isdef(e)) {
			inew.D = e.D;
			inew.F = e.F;
			inew.S = e.S;
			inew.C = e.C;
		}
		if (nundef(inew.D) && isdef(info.bestD)) inew.D = info.bestD;
		symNew[k] = inew;
		console.log('key', k, inew)
	}

	return symNew;
}
async function addVocabTo2020Syms() {
	let syms20 = await route_path_yaml_dict('../assets/syms2020.yaml');

	let etext = await route_path_text('../assets/speech/w2020/w20_E.txt');
	// console.log(etext);
	let ew = etext.split('\n');
	let dtext = await route_path_text('../assets/speech/w2020/w20_D.txt');
	let ftext = await route_path_text('../assets/speech/w2020/w20_F.txt');
	let stext = await route_path_text('../assets/speech/w2020/w20_S.txt');
	let ctext = await route_path_text('../assets/speech/w2020/w20_C.txt');
	let dw = dtext.split('\n');
	let fw = ftext.split('\n');
	let sw = stext.split('\n');
	let cw = ctext.split('\n');
	let edict = {};
	for (let i = 0; i < ew.length; i++) {
		let ek = ew[i].toLowerCase().trim();
		if (isEmpty(ek)) continue;
		edict[ek] = { E: ek, D: dw[i].toLowerCase().trim(), F: fw[i].toLowerCase().trim(), S: sw[i].toLowerCase().trim(), C: cw[i].trim() };
	}
	console.log(edict);
	let edlist = dict2list(edict, 'key');
	for (const k in syms20) {
		console.log('k=' + k, edict[k]);
		let e = firstCond(edlist, x => k.includes(x.key.toLowerCase()) || k.includes('pinch') && x.key.toLowerCase().includes('pinch'));
		console.log('entry for', k, 'is', e);
		if (isdef(e)) {
			let info = syms20[k];
			info.E = e.E;
			info.D = e.D;
			info.F = e.F;
			info.S = e.S;
			info.C = e.C;
		}
	}
	downloadAsYaml(syms20, 'syms20');
}

async function updateSymbolDict() {
	let snew = await route_path_yaml_dict('../assets/syms.yaml');
	let sold = await route_path_yaml_dict('../assets/symbolDict.yaml');
	let soldlc = {};
	for (const k in sold) {
		let klc = k.toLowerCase();
		let o = soldlc[klc] = sold[k];
		o.key = klc;
	}
	//soldlc ist jetzt sold mit lower case keys!
	for (const k in snew) {
		if (nundef(soldlc[k])) {
			soldlc[k] = snew[k];
			console.log('new key added to symbolDict', k)
		} else {
			let onew = snew[k];
			let oold = soldlc[k];
			if (onew.type != oold.type) {
				soldlc[k] = onew;
				console.log('symbolDict key updated', k)
			}
		}
	}
	downloadAsYaml(soldlc, 'symbolDict_upd');

}
async function updateGroupInfo() {
	//soll die neuen sym keys mittels group info zu KeySets adden
	let syms20 = await route_path_yaml_dict('../assets/speech/syms2020.yaml');
	console.log(syms20);

	//let symb = await route_path_yaml_dict('../assets/symbolDict.yaml');
	//let syms = await route_path_yaml_dict('../assets/syms.yaml');

	console.log(KeySets);
	for (const k in syms20) {
		KeySets.all.push(k);
		KeySets.huge.push(k);
		let info = syms20[k];
		if (isdef(info.ngroup)) {
			for (const n of [25, 50, 100]) {
				if (info.ngroup <= n) KeySets['best' + n].push(k);
			}
		}
		if (info.group != 'smileys-emotion') { KeySets.nemo.push(k); if (isdef(info.ngroup)) KeySets.nemo100.push(k); }
		switch (info.group) {
			case 'object': KeySets.object.push(k); KeySets.object50.push(k); KeySets.objectPlus.push(k); break;
			case 'animal': KeySets.life.push(k); KeySets.life50.push(k); KeySets.lifePlus.push(k); break;
			case 'fruit': KeySets.life.push(k); KeySets.life50.push(k); KeySets.lifePlus.push(k); break;
			case 'food': KeySets.life.push(k); KeySets.life50.push(k); KeySets.lifePlus.push(k); break;
			case 'drink': KeySets.life.push(k); KeySets.life50.push(k); KeySets.lifePlus.push(k); break;
			case 'vegetable': KeySets.life.push(k); KeySets.life50.push(k); KeySets.lifePlus.push(k); break;
			case 'smileys-emotion': KeySets.emo.push(k); break;
			case 'people-body': break;
			default: console.log('forgot group', info.group); break;
		}

	}

	//now update cats and save back to syms
	addCatsToKeys();
}

function saveListOfWords() {
	let phrases = Object.keys(DD);
	phrases.sort();
	let text = phrases.join('\n');

	downloadAsText(text, 'listOfWords');
}

function startUnit() {

	restartTime();
	U.session = {};
	if (PROD_START) { PROD_START = false; onClickTemple(); } else startGame();

}

function initSymbolTableForGamesAddons() {
	//console.log('Daat', Daat);//yes this is an empty dict!
	Daat.GameClasses = {
		gTouchPic: GTouchPic, gNamit: GNamit, gStory: GStory,
		gTouchColors: GTouchColors, gPremem: GPremem, gMem: GMem, gMissingLetter: GMissingLetter,
		gMissingNumber: GMissingNumber, gWritePic: GWritePic, gSayPic: GSayPic, gSteps: GSteps, gElim: GElim,
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode, gCats: GCats,

	}
}




function presentWordProblem() {

}

