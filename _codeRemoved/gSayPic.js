const LevelsSP = {
	0: { NumPics: 1, NumLabels: 1, MinWordLength: 2, MaxWordLength: 21, MaxNumTrials: 3 },
	1: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 21, MaxNumTrials: 3 },
	2: { NumPics: 1, NumLabels: 1, MinWordLength: 3, MaxWordLength: 21, MaxNumTrials: 3 },
	3: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 21, MaxNumTrials: 3 },
	4: { NumPics: 1, NumLabels: 0, MinWordLength: 4, MaxWordLength: 21, MaxNumTrials: 3 },
	5: { NumPics: 1, NumLabels: 0, MinWordLength: 5, MaxWordLength: 21, MaxNumTrials: 3 },
	6: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 21, MaxNumTrials: 3 },
	7: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 21, MaxNumTrials: 3 },
	8: { NumPics: 1, NumLabels: 0, MinWordLength: 8, MaxWordLength: 21, MaxNumTrials: 3 },
	9: { NumPics: 1, NumLabels: 0, MinWordLength: 7, MaxWordLength: 21, MaxNumTrials: 3 },
	10: { NumPics: 1, NumLabels: 0, MinWordLength: 6, MaxWordLength: 21, MaxNumTrials: 3 },
}
function startGameSP() { }
function startLevelSP() { levelSP(); }
function levelSP() {
	//console.log('level',currentLevel)
	let levelInfo = LevelsSP[currentLevel];
	MaxNumTrials = levelInfo.MaxNumTrials;
	MaxWordLength = levelInfo.MaxWordLength;
	MinWordLength = levelInfo.MinWordLength;

	//keys sollen die keys sein die auch in dem file 
	setKeys(currentCategories, true, x => lastOfLanguage(x, currentLanguage));

	console.log('currentCategories', currentCategories, 'currentKeys', currentKeys)

	//currentKeys=currentKeys.filter(x=>isdef(CorrectWordsCorrect[x]))
	//console.log(currentKeys);
	NumPics = levelInfo.NumPics;
	NumLabels = levelInfo.NumLabels;
}
function startRoundSP() { }
function promptSP() {

	showPictures(true, () => mBy(defaultFocusElement).focus());
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'say:' : "sage: ", dTitle);

	mLinebreak(dTable);
	MicrophoneUi = mMicrophone(dTable);

	return 10; //1000;
}
function trialPromptSP() {
	//showFleetingMessage('Say again!',0,{fz:80,fg:'red'});
	Speech.say(currentLanguage == 'E' ? 'try again!' : 'nochmal', 1, 1, .3, true, 'zira');
	animate(dInstruction, 'pulse800' + getSignalColor(), 900);
	return 1500;
}
async function activateSP() {
	if (Speech.speaker.isSpeakerRunning) {
		setTimeout(activateSP, 1000);
	} else {
		setTimeout(() => Speech.recognize(bestWord, currentLanguage, evaluate, evaluate), 100);
	}
	//orig code:
	// setTimeout(() => {
	// 	record(currentLanguage, bestWord);
	// }, trialNumber == 0 ? 4000 : 1500);
}
function evalSP(speechResult, confidence) {

	if (isEmpty(speechResult)) {
		//console.log('.....empty speechResult');
		return false;
	}

	Selected = {}
	let answer = Goal.answer = Selected.answer = normalize(speechResult, currentLanguage);
	let reqAnswer = Goal.reqAnswer = normalize(bestWord, currentLanguage);

	console.log('required:' + reqAnswer, 'got:' + answer, confidence)

	return isSimilar(answer,reqAnswer);
	// if (answer == reqAnswer) return true;
	// if (replaceAll(answer, ' ', '') == replaceAll(reqAnswer, ' ', '')) return true;
	// else if (matchesAnyWordOrSound(Goal.info, answer)) {
	// 	console.log('has matched another sound!')
	// 	return true;
	// } else if (matchingNumberOrTime(Goal.info, answer)) {
	// 	console.log('matches as number or time!!!')
	// 	return true;
	// } else if (isAcceptableAnswerButNewSound(Goal.info, reqAnswer, answer)) {
	// 	console.log('accepting', answer, 'as sound for', reqAnswer);
	// 	addAsSoundToDatabase(Goal.info, answer);
	// 	return true;
	// } else {
	// 	return false;
	// }
}


