function evaluate_dep() {
	if (uiPaused) return;
	hasClickedUI();
	IsAnswerCorrect = GFUNC[currentGame].eval(...arguments);

	switch (IsAnswerCorrect) {
		case STATES.CORRECT:
			setScore(true);
			DELAY = skipAnimations ? 300 : 1500;
			updateLevel();
			successPictureGoal();
			if (LevelChange > 0) setTimeout(showLevelComplete, DELAY);
			else if (!StepByStepMode) {
				startRound();
				//setTimeout(startRound_, DELAY); 
			}
			break;
		case STATES.INCORRECT:
			trialNumber += 1;
			if (trialNumber < MaxNumTrials) {
				promptNextTrial();
			} else {
				setScore(false);
				DELAY = skipAnimations ? 300 : 3000;
				showCorrectWord();
				failPictureGoal(false);
				updateLevel();
				if (LevelChange < 0) setTimeout(removeBadgeAndRevertLevel, DELAY);
				else if (LevelChange > 0) { setTimeout(showLevelComplete, DELAY); }
				else if (!StepByStepMode) {
					startRound();
					//setTimeout(startRound_, DELAY); 
				}
			}
			break;
	}
}
function addGameToSessionHistoryAndRenewGameHistory(oldGameName,newGameName){
	if (!isEmpty(CurrentGameData)) GameList.push({game:oldGameName,newGameName,data:CurrentGameData});
	CurrentGameData=[];
}
function updateLevelHistory(signature){
	if (!isEmpty(LevelList)) CurrentGameData.push({level:signature,data:LevelList});
	LevelList=[];
}
function promptML() {
	showPictures(false, () => fleetingMessage('just enter the missing letter!'));
	setGoal();

	showInstruction(bestWord, currentLanguage == 'E' ? 'complete' : "ergänze", dTitle);

	mLinebreak(dTable);

	// create sequence of letter ui
	let style = { margin: 10, fg: 'white', display: 'inline', w: 64, bg: 'transparent', align: 'center', border: 'transparent', outline: 'none', family: 'Consolas', fz: 100 };
	let d = createLetterInputs(bestWord.toUpperCase(), dTable, style, 'dLetters'); // acces children: d.children

	// randomly choose a maximum of NumMissingLetters alphanumeric letters from bestWord
	let len = bestWord.length;
	nMissing = Math.max(1, Math.min(len - 2, NumMissingLetters));

	let indices = nRandomNumbers(nMissing, 0, Math.min(len - 1, MaxPosMissing));
	indices.sort();

	// let indices = nRandomNumbers(nMissing, 1, len - 2);

	if (isEmpty(indices)) indices = nRandomNumbers(nMissing, 0, len - 1);

	//console.log('bestWord', bestWord, 'len', len, 'nMissing', nMissing, '\nindices', indices)

	for (let i = 0; i < nMissing; i++) {
		let index = indices[i];
		if (!isAlphaNum(bestWord[index])) { nMissing -= 1; }
		let inp = d.children[index];
		inp.innerHTML = '_';
		mClass(inp, 'blink');
		inputs.push({ letter: bestWord[index].toUpperCase(), div: inp, done: false, index: index });
	}

	mLinebreak(dTable);

	showFleetingMessage(composeFleetingMessage(), 3000);

	return 10;
}
function addResultHandler() {
	// This event is triggered when the speech recognition service
	// returns a result — a word or phrase has been positively 
	//recognized and this has been communicated back to your app
	recognition.onresult = function (event) {
		var interim_transcript = '';
		var final_transcript = '';
		hide('dRecord');
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			// Verify if the recognized text is the last with the isFinal property
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}

		// Choose which result may be useful for you
		// console.log("Interim: ", interim_transcript);
		// console.log("Final: ", final_transcript);
		// console.log("Simple: ", event.results[0][0].transcript);

		if (isdef(final_transcript) && !isEmpty(final_transcript)) {
			recognition.stop();
			let word = finalResult = final_transcript;
			console.log('===>', '\nbest', bestWord, '\ngot', word); // + '.\nConfidence: ' + event.results[0][0].confidence);
			evaluate(word);

		}
	};
}
function composeFleetingMessage_bef() {
	//inputs.push({ letter: bestWord[index].toUpperCase(), div: inp, done: false, index:index });

	//macht keinen sinn denn so wie es setup ist werden inputs die done sind removed from inputs
	//find first input that is NOT done
	//let inp = firstCond(inputs, x => !x.done);
	//let lst= inputs.filter(x=>!x.done);
	//console.log(lst);
	// let msg=lst.map(x=>x.letter).join(',');

	let lst = inputs;
	let msg = lst.map(x => x.letter).join(',');
	//console.log(msg);
	let edecl = lst.length > 1 ? 's ' : ' ';
	let ddecl = lst.length > 1 ? 'den' : 'die';
	let s = (currentLanguage == 'E' ? 'Type the letter' + edecl : 'Tippe ' + ddecl + ' Buchstaben ');
	return s + msg;
	//if (lst.length == 1) 

	//let s;
	let best = bestWord.toUpperCase();
	if (currentLevel < 2) {
		s = (currentLanguage == 'E' ? 'Type the letter ' : 'Tippe den Buchstaben ') + inp.letter;
	} else if (inp.index == 0) {
		s = currentLanguage == 'E' ? 'Type the first letter in ' + best : ' Tippe den Anfangsbuchstaben von ' + best;
	} else {
		let trialWord = buildWordFromLetters(mBy('dLetters')).toUpperCase();
		trialWord = replaceAll(trialWord, '_', '')
		s = (currentLanguage == 'E' ? 'Type a letter that is in ' + best + ' but not in ' + trialWord
			: 'Tippe einen Buchstaben in ' + best + ' der nicht in ' + trialWord + ' ist!');
	}
	return s;
}

function showBadges_dep(dParent, level, bgs) {
	clearElement(dParent);
	// let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	//let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 60, 60, 0, 'arial', 'random', 'transparent', true);
	//let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	// ensureSymByType();
	let keys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
		'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
		'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];
	let fg = '#00000080';
	let textColor = 'white';
	let texts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	let achieved = [];
	for (let i = 0; i < level; i++) { achieved.push(keys[i]); }
	badges = mpLineup(dParent, achieved, bgs, fg, textColor, texts);
	// let dGrid = mDiv(table);
	// let elems = [];
	// let isText = true;
	// let isOmoji = false;

	// for (let i=0;i<keys.length;i++) {
	// 	let k=keys[i];
	// 	let bg=bgs[i];

	// 	let info = symbolDict[k];
	// 	let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
	// 	elems.push(el);
	// }

	// let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	// let size = layoutGrid(elems, dGrid, gridStyles, { rows:10, isInline: true });

}

function showPictures(bestWordIsShortest = false, onClickPictureHandler, colored = false) {
	//console.log('dassssssssssssssssssssssssssssssssssssssssssssssssssssssss')
	Pictures = [];
	let keys = choose(currentKeys, NumPics);
	//keys[0]='face with hand over mouth';
	//keys=['egg']
	//keys=['oil drum'];//,'door']

	let stylesForLabelButton = { rounding: 10, margin: 24 };
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem(currentLanguage, keys[i]);
		let id = 'pic' + i;
		//console.log(bestWordIsShortest)
		let label = selectWord(info, bestWordIsShortest);
		console.log('______', info.key, info);
		let shade, bgPic;
		if (colored) { shade = choose(['red', 'green', 'gold', 'blue']); bgPic = 'white'; }
		else { shade = undefined; bgPic = 'random'; }
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200, shade: shade, bgPic: bgPic }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;

		//if (currentLevel > SHOW_LABEL_UP_TO_LEVEL) maHideLabel(id, info);
		Pictures.push({ key: info.key, info: info, div: d1, id: id, index: i, label: label, isLabelVisible: true });
	}
	//randomly pic NumLabels pics and hide their label!
	if (NumLabels == NumPics) return;

	let remlabelPic = choose(Pictures, NumPics - NumLabels);

	for (const p of remlabelPic) { maHideLabel(p.id, p.info); p.isLabelVisible = false; }
}














