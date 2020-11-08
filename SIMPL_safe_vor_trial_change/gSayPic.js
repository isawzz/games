const LevelsSP = {
	0: { NumPics: 1, NumLabels: 1, MinWordLength: 2, MaxWordLength: 4, MaxNumTrials: 3 },
	1: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 5, MaxNumTrials: 3 },
	2: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 6, MaxNumTrials: 3 },
	3: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 7, MaxNumTrials: 3 },
	4: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 8, MaxNumTrials: 3 },
	5: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 9, MaxNumTrials: 3 },
	6: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 10, MaxNumTrials: 3 },
	7: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 11, MaxNumTrials: 3 },
	8: { NumPics: 1, NumLabels: 0, MinWordLength: 8, MaxWordLength: 12, MaxNumTrials: 3 },
	9: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 13, MaxNumTrials: 3 },
	10: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 14, MaxNumTrials: 3 },
}
function startGameSP() { }
function startLevelSP() { levelSP(); }
function levelSP() {
	let levelInfo = LevelsSP[currentLevel];
	//console.log(currentLevel,levelInfo,LevelsSP)
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;
	setKeys();
	NumPics = levelInfo.NumPics;	// NumPics = (currentLevel <= SHOW_LABEL_UP_TO_LEVEL? 2:1) + currentLevel; 
	NumLabels = levelInfo.NumLabels;
	writeComments();

	// setKeys();
	// NumPics = 1;
	// NumLabels = 1;
	// MaxNumTrials = 3;
	// console.log('...starting SayPic currentLevel:', currentLevel, 'pics', NumPics, 'labels', NumLabels, 'keys', currentKeys.length);
}
function startRoundSP() {
	trialNumber = 0;
}
function promptSP() {

	trialNumber += 1;
	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'say aloud:' : "sage laut: ", dTitle);//, startRecording);

	mLinebreak(dTable);
	// inputBox = addNthInputElement(dTable, trialNumber);
	// defaultFocusElement = inputBox.id;

	return 10;
}
function trialPromptSP() {
	say(currentLanguage == 'E' ? 'try again!' : 'nochmal', 1, 1, .8, true, 'zira');
	trialNumber += 1;
	activateSP();
}
// function startRecording(){
// 	setTimeout(() => {
// 		console.log('calling _record!!!')
// 		record(currentLanguage, bestWord);
// 	}, 3000);
// }
function activateSP() {
	//return;
	//console.log('should activate SayPic UI')
	console.log('trial',trialNumber)
	setTimeout(() => {
		console.log('calling _record!!!')
		record(currentLanguage, bestWord);
	}, 4000);
}
function evalSP(speechResult) {
	console.log('==>eval speech result!',speechResult,bestWord,trialNumber)
	let answer = normalize(speechResult, currentLanguage);
	let reqAnswer = normalize(bestWord, currentLanguage);
	console.log('eval SayPic', answer, reqAnswer)
	if (answer == reqAnswer) return STATES.CORRECT;
	else if (matchesAnyWordOrSound(Goal.info, answer)) return STATES.CORRECT;
	else if (isAcceptableAnswerButNewSound(Goal.info, reqAnswer, answer)) {
		console.log('accepting', answer, 'as sound for', reqAnswer);
		addAsSoundToDatabase(Goal.info, answer);
		return STATES.CORRECT;
	}
	else if (trialNumber < MaxNumTrials) {
		console.log('have another trial!!!')
		trialPromptSP();
		return STATES.NEXTTRIAL;
	} else {
		console.log('leider alles falsch!!!')
		Selected = null;
		return STATES.INCORRECT;
	}
}


//word similarity helpers
function matchesAnyWordOrSound(info, s) {
	return false;
}
function isAcceptableAnswerButNewSound(info, reqAnswer, s) {
	let sParts = s.split(' ');
	let aParts = reqAnswer.split(' ');
	if (sParts.length != aParts.length) return false;
	for (let i = 0; i < sParts.length; i++) {
		if (!soundsSimilar(sParts[i], aParts[i])) return false;
	}
	return true;
}
function soundsSimilar(w1, w2) {
	//search for a combination of vowel+consonant within w1 that is contained in w2
	// const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
	// let x=[w1,w2].match(syllableRegex);
	// console.log(x);

	const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

	function syllabify(words) {
		return words.match(syllableRegex);
	}

	// console.log(['away', 'hair', 'halter', 'hairspray', 'father', 'lady', 'kid'].map(syllabify))
	// console.log(syllabify('hallo'));
	// console.log(syllabify(w1));
	// console.log(syllabify(w2));
	let a1 = syllabify(w1);
	let a2 = syllabify(w2);
	if (a1.length != a2.length) return false;
	for (let i = 0; i < a1.length; i++) {
		let s1 = a1[i];
		let s2 = a2[i];
		if (s1 == s2) return true;
		let x1 = stringAfterLeadingConsonants(s1);
		let x2 = stringAfterLeadingConsonants(s2);
		//first letter of x1, x2 will now be vovels!
		//if one is o the other u and language is english, this is fine!
		// if (x1==null || x2==null){}
		if (currentLanguage == 'E' && 'ou'.includes(x1) && 'ou'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (currentLanguage == 'E' && 'oa'.includes(x1) && 'ao'.includes(x2) && x1.substring(1) == x2.substring(1)) return true;
		if (currentLanguage == 'E' && x1.replace('ee', 'i') == x2.replace('ee', 'i')) return true;
		if (currentLanguage == 'E' && x1.replace('ea', 'ai') == x2.replace('ea', 'ai')) return true;
	}
	return false;
}
function stringAfterLeadingConsonants(s) {
	let regexpcons = /^([^aeiou])+/g;
	let x = s.match(regexpcons);
	console.log('x', x);
	return x?s.substring(x[0].length):s;
}
function addAsSoundToDatabase(info, answer) {
	//lege dictionary an  mit info.key => info [updated] with answer now in valid sounds for language
}






