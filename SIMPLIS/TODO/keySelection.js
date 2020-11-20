var DICTIONARY, BYWORD = {};

function testp9(lang = 'E', voice = 'zira') {
	let di = DICTIONARY = {};
	let callback = di => {
		let fname = lang + '_' + voice;
		downloadAsYaml(di, fname);
		downloadAsYaml(BYWORD, 'BYWORD');
	};

	let set = symKeysBySet['nosymbols'];
	let i=0;
	while(set[i]!='dvd') i++;
	set=set.slice(i);
	console.log('set',set);
	testp8(set, lang, voice, di, callback);

}


function testp7() {
	let group = 'animals-nature';
	let sub = 'animal-reptile';
	let lang = 'E';
	let voice = 'zira';
	testGroupSub(group, sub, lang, voice);
	//downloadAsYaml(d1, group + '_' + lang + '_' + voice);
}
function testGroupSub(group, sub, lang, voice) {
	let di = {};
	let callback = di => {
		let fname = group + '_' + lang + '_' + voice;
		downloadAsYaml(di, fname);

	};
	testp8(symKeysByGroupSub[group][sub], lang, voice, di, callback);

}

function testp8(keylist, lang, voicekey, di, callback) {

	let sampleIndex = 0;
	if (lang == 'D') voicekey = 'deutsch';
	else if (nundef(voicekey)) voicekey = 'random';

	if (isEmpty(keylist)) {
		console.log('training complete!', di);
		if (isdef(callback)) callback(di);
	} else {
		let key = keylist.shift();
		let info = symbolDict[key];
		sampleIndex += 1;
		console.log('==>key', key, info);

		//keylist = [];// stop after first!
		let w = lastOfLanguage(key, lang).toLowerCase();
		//console.log(w, wlist);

		// 1. approach: only wrap short words
		if (isdef(w) && !isEmpty(w)) {
			let wrapit = isShortWord(w);
			let between = lang == 'E' ? ' sounds like ' : ' klingt wie ';
			let wphrase = wrapit ? (w + between + w) : [w, w, w].join(' : ');

			// 2. simple approach genauso gut: wrap all
			wrapit = true; wphrase = w + between + w;

			// 3. wrap simple words, leave multiple (wenn mehrfaches word muss ich mir n merken!)
			wrapit = w.split(' ').length == 1;
			wphrase = wrapit ? (w + between + w) : w;

			Speech.train1(wphrase, lang, voicekey, (res, conf) => {
				if (isEmpty(res)) {
					console.log('DID NOT RECOGNIZE', w)
					let entry = { key: key, req: w, answer: '', correct: false, conf: 0 };
					lookupSet(di, [key, lang, voicekey], entry);
					lookupSet(BYWORD, [w], { correct: false, answer: '', conf: 0 });
					//console.log('outcome', entry)
				} else {
					res = res.toLowerCase();
					let parts = res.split(' '); //.map(x => x.toLowerCase());
					console.log('training returned', res, conf);

					//1. and 2. approach:
					let correct = true;
					if (wrapit) {
						//console.log('wrapit=true', arrLast(parts), w);
						if (arrLast(parts) != w && arrFirst(parts) != w) correct = false;
						//hier schreiben welcher matched!
					} else {
						// 1. approach:
						//for (const part of parts) if (part != w) correct = false;
						// 3. approach: auch multiple words in w
						if (w != res) correct = false;
					}

					//if (conf<.97) correct=false;else for(const x1 of parts)if (x1!=w) correct=false;
					let answer = wrapit ? arrLast(parts) : res;
					let entry = { key: key, req: w, answer: answer, correct: correct, conf: conf };
					lookupSet(di, [key, lang, voicekey], entry)
					lookupSet(BYWORD, [w], { correct: correct, answer: answer, conf: conf });
					console.log('outcome', entry)
				}
				testp8(keylist, lang, voicekey, di, callback);
			});

		} else {
			console.log('ERROR AUFGETRETEN BY INDEX', sampleIndex);
			callback(di);
		}
	}
}



function testp6() {
	//getSymbols({ minlen=null, maxlen=null, cats = null, lang = 'E', wShortest = false, wLast = false, wExact = false, sorter = null }={}) {
	let infos = getSymbols({ cats: ['nosymbols'] });
	console.log(infos);

}

function testp5() {
	let di = {};
	testp3(['maschine', 'kleid', 'haus'], 'D', 'zira', di);
	//console.log(di)
}

function testp4() {
	let di = {};
	testp3(['bear', 'bee', 'skiing'], 'E', 'zira', di);
	//console.log(di)
}
function isShortWord(w) {
	let sil=detectSilben(w);
	if (isEmpty(sil)) sil=0; else sil=sil.length;
	return w.length < 6 && sil<2; //detectSilben(w).length < 2;
}
function testp3(wlist, lang, voicekey, di) {

	if (lang == 'D') voicekey = 'deutsch';
	else if (nundef(voicekey)) voicekey = 'random';

	if (isEmpty(wlist)) {
		console.log('training complete!', di);
	} else {
		let w = wlist.shift().toLowerCase();
		//console.log(w, wlist);

		let wrapit = isShortWord(w);
		let between = lang == 'E' ? ' sounds like ' : ' klingt wie ';
		let wrep = wrapit ? (w + between + w) : [w, w, w].join(' : ');

		wrapit = true; wrep = w + between + w;

		Speech.train1(wrep, lang, voicekey, (res, conf) => {
			if (isEmpty(res)) {
				console.log('DID NOT RECOGNIZE', w)
				let entry = { req: w, answer: '', correct: false, conf: 0 };
				lookupSet(di, [w, lang, voicekey], entry)
				//console.log('outcome', entry)
			} else {
				let parts = res.split(' ').map(x => x.toLowerCase());
				console.log('training returned', res, conf);
				let correct = true;
				if (wrapit) {
					//console.log('wrapit=true', arrLast(parts), w);
					if (arrLast(parts) != w && arrFirst(parts) != w) correct = false;
				} else {
					for (const part of parts) if (part != w) correct = false;
				}
				//if (conf<.97) correct=false;else for(const x1 of parts)if (x1!=w) correct=false;
				let entry = { req: w, answer: arrLast(parts), correct: correct, conf: conf };
				lookupSet(di, [w, lang, voicekey], entry)
				console.log('outcome', entry)
			}
			testp3(wlist, lang, voicekey, di);
		});
	}
}

function testp2(wlist = ['apple', 'banana']) { // , 'ant', 'buffalo', 'bear'
	testp1(wlist);
}
function testp1(wlist) {

	if (isEmpty(wlist)) {
		console.log('training complete!');
	} else {
		let w = wlist.shift();
		console.log(w, wlist);
		let wrep = [w, w, w].join(', ');
		Speech.train1(wrep, 'E', 'zira', (res, conf) => {
			if (isEmpty(res)) {
				console.log('DID NOT RECOGNIZE', w)
			} else {
				let x = res.split(' ');
				console.log('training returned', x[0], conf);
			}
			testp1(wlist);
		});
	}
}
function testp0() {
	Speech.train1('apple, apple, apple', 'E', 'zira', (res, conf) => console.log('training returned', res, conf));

}
//task:
//start recording
// on started: 
//		say word
// on result:
//		stop recording, return result
// on no_result:
//		if (N>MAXTRIALS) say word again
//		else output 'ran out of trials!' return stop recording, return empty word
// on error:
//		output error

//say 






































/* features: key selection belongsTo assets.fonts
1. loading fonts (symbolDict)

selectKeyset for level:

- []
- [speech]: use only exact keys
*/
class KeySelection {
}


























