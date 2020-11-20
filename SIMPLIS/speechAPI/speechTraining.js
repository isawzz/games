async function speechTraining() {
	if (nundef(Speech)) {
		console.log('MISSING FEATURES: speechTraining needs the Speech feature!');
		return;
	}

	let trainingSet = ['animal', 'game'];//bestimmeAlleSetsDieDurchgehenSoll();
	let setSize = 1;
	console.log('trainingSet', trainingSet);
	for (const groupName of trainingSet) {
		for (const lang of ['E', 'D']) {
			let infos = getInfolist({ cats: [groupName], lang: lang, wLast: true, sorter: x => x.best });
			for (let i = 0; i < setSize; i++) {
				for (let times = 0; times < 2; times++) {
					let speakInterval = 3000;
					let t = times * (1000 + 3 * speakInterval);
					if (lang=='D') t*=2;
					let info = infos[i];

					let req = info.best;
					req = req.toLowerCase();

					Speech.recognize(req, lang,
						(r, c) => {
							console.log('MATCHING: req', req, 'r', r, '(' + c + ')');
						},
						(r, c) => {
							console.log('NOT MATCHING: req', req, 'r', r, '(' + c + ')');
						},
					);

					//say the word
					setTimeout(() => Speech.say(req, .4, .9, 1, false, 'random'), t + 1000);
					setTimeout(() => Speech.say(req, .3, .9, 1, false, 'random'), t + 4000);
					//setTimeout(() => Speech.say(req, .7, .5, 1, false, 'random'), t + 7000);
					setTimeout(() => Speech.stopRecording(), t + 7000)
					//eval recognized word
					//if recognized word == wToBe Said
					//animal,E,0
					//
				}
			}
		}
		return;
	}
}


function bestimmeAlleSetsDieDurchgehenSoll() {
	return ['kitchen', 'math', 'drink', 'misc',
		'activity', 'animal', 'body', 'clock', 'emotion', 'family', 'fantasy', 'food',
		'fruit', 'game', 'gesture',
		'object', 'person', 'place', 'plant', 'punctuation', 'role', 'shapes', 'sport', 'sternzeichen', 'symbols', 'time', 'toolbar',
		'transport', 'vegetable'];

}

function testAccessor() {
	let infos1 = getInfolist({ cats: ['kitchen', 'game'], wLast: true, maxlen: 4, sorter: x => x.best });
	//console.log(infos1.length); infos1.map(x => console.log(x.key + ': ' + x.best));
	let infos2 = getInfolist({ cats: ['kitchen', 'game'], wShortest: true, maxlen: 4, sorter: x => x.best });
	//console.log(infos2.length); infos2.map(x => console.log(x.key + ': ' + x.best));
	let infos3 = getInfolist({ cats: ['kitchen', 'game'], lang: 'D', wShortest: true, maxlen: 4, sorter: x => x.best });
	//console.log(infos3.length); infos3.map(x => console.log(x.key + ': ' + x.best));
}
function getInfolist({ minlen = null, maxlen = null, cats = null, lang = 'E', wShortest = false, wLast = false, wExact = false, sorter = null } = {}) {
	opt = arguments[0];
	if (nundef(opt)) opt = {};
	if (nundef(cats)) cats = currentCategories;
	if (nundef(lang)) lang = currentLanguage;
	if (nundef(minlen)) opt.minlen = MinWordLength;
	if (nundef(maxlen)) opt.maxlen = MaxWordLength;
	//console.log(opt)
	let infos = getInfos(cats, lang, opt);
	//console.log('set infos:' + infos.length, infos.map(x=>x.key+': '+x.best));
	return infos;
}
function getSymbols(x) { return getInfolist(x); }
