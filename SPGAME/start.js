window.onload = _preloader;
window.onunload = saveUser;

var FASTSTART = false;
async function _preloader() {
	timit = new TimeIt('timit', false);

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
		return;
	}
	_loader();
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
async function makeWordProblemsDict() {
	let wp = WordProblems = await route_path_text('../assets/math/hallo.txt');
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
		let ersetzer={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9};
		let kers=Object.keys(ersetzer);
		if (nums) {
			for (const n of nums) {
				let s = n.toString();
				//console.log('found number', s)
				let i = s.indexOf(text);
				let len = s.length;
				text = text.replace(s, '$N' + kers[inum]);
				inum += 1;
			}
			//console.log('in',index,stringBefore(title,' '),'found',nums,sol)
		}
		//now have to ersetz $N[ersetzerKey by] $N[ersetze[ersetzerKey]]
		//console.log('inum is',inum)
		for(let j=0;j<inum;j++){
			
			let s='$N'+kers[j];
			let by='$N'+ersetzer[kers[j]];
			//console.log('text',text,'\nlooking for',s,'repl by',by);
			//console.log(text.includes(s));
			text=replaceAllSpecialChars(text,s,by);
			//console.log('==>',text)
		}

		//replace *** FRACTIONS ***
		if (title.includes('Fractions')){
			let parts=text.split('${F');
			text = parts[0];
			console.log('parts',parts);
		  for(let i=1;i<parts.length;i++){
				//now parts[i] starts with a a/b fraction!
				// a soll IMMER mit 1 replaced werden!!!

			}
		}
		//return;


		let iname = 1;
		for (const name of PersonNames) {
			if (text.includes(name)) {
				text = replaceAll(text, name, '$P' + iname);
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
async function _start() {
	//timit.show('DONE');	console.assert(isdef(DB));

	initLive(); initTable(); initSidebar(); initAux(); initScore(); initSymbolTableForGamesAddons(); //creates Daat
	addonFeatureInit(); //new API!
	Speech = new SpeechAPI('E');
	KeySets = getKeySetsX();

	if (IS_TESTING) loadUser(Username); else loadUser(); console.assert(isdef(G));


	if (EXPERIMENTAL){
		let wp = await makeWordProblemsDict();
		//let wp = await route_path_yaml_dict('../assets/math/word1.yaml');
		console.log('word problems:', wp);
		let p = chooseRandom(wp.plus);
		console.log(p);
		//let text = p.text;
		//replaceAll(text,
	
	
		//test10_syms(); timit.show('DONE'); return;
	
		//let x='hallo'.substring(0,100); console.log('x',x)
		//saveListOfWords();//updateGroupInfo(); //updateSymbolDict();//addVocabTo2020Syms();	//addCatsToKeys();	//allWordsAndKeysLowerCase(); updateSymbolDict();
		//return;
	
		//let keys = ['fly']; //fromKeySet('nemo',9);
		//showPictureGrid(keys,dTable);return;
	
		//show('freezer');
		//console.log('English to German Nouns:', EdDict);
		//recomputeBestED();
		//generateWordFiles(); //step 1 works!!!
		//let symNew = await makeNewSyms(); downloadAsYaml(symNew,'symNew')
		//return;
	
		//console.log('hallo');	mText('&#129427;',dTable,{fz:100,family:'segoe UI symbol'}); 	return;
		//showPicsS(null, {}, {}, ['zebra'], ['zebra']); return;
	
		//test04_textItems(); return;
		//let x=substringOfMinLength(' ha a ll adsdsd',3,3);console.log('|'+x+'|');return;
		// test06_submit(); return;
		//addonScreen(); return;
		//onclick=()=>test05_popup('think about the passcode!',24001); return;
		//test05_popup(); return; //test04_blankPageWithMessageAndCountdownAndBeep();return;
		// test12_vizOperationOhneParentDiv(); return;
		//test12_vizNumberOhneParentDiv();return;
		//test12_vizArithop(); return;
		//test11_zViewerCircleIcon(); return;
		//test11_zItemsX(); return;
		//test03_maShowPictures(); return;
		//let keys = symKeysByType.icon;	keys=keys.filter(x=>x.includes('tower'));	console.log(keys);	iconViewer(keys);	return;
	
		//onClickTemple(); return;
	
	}
	if (ALLOW_CALIBRATION) show('dCalibrate');
	if (SHOW_FREEZER) show('freezer'); else startUnit();

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
		gAnagram: GAnagram, gAbacus: GAbacus, gPasscode: GPasscode

	}
}


