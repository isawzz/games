var g2_pic1, g2_pic2;
var g2Pics = [];
var g2N = 2;
var g2Goal;

function gTouchPicStart() {
	//console.log('touch pic game!')
	let table = dLineMidMiddle;
	let title = dLineTopMiddle;
	if (nundef(table)) return;
	clearElement(table); clearElement(title); hide(mBy('dCheckMark')); hide(mBy('dX'));

	g2Pics = [];
	let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 4 };

	let onClickPicture = ev => {
		let id = evToClosestId(ev);
		ev.cancelBubble = true;

		//get item
		let i = firstNumber(id);
		let item = g2Pics[i];

		if (item.key == g2Goal.key) {
			scoreFunction2(true);
			say('Excellent!!!');
			maPicOver(mBy('dCheckMark'), mBy(id), 100);
		} else {
			scoreFunction2(false);
			say('too bad!', 1, 1, .8, 'zira');
			maPicOver(mBy('dX'), mBy(id), 100);
		}

		setTimeout(gTouchPicStart, 1500);
	}


	//get g2N different keys!
	let keys = choose(emoGroupKeys, g2N);

	for (let i = 0; i < g2N; i++) {
		let info = getEmoSetWords('E',keys[i]);
		let id = 'pic' + i;
		let d1 = maPicButton(info, onClickPicture, table, styles); d1.id = id;
		g2Pics.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}

	//randomly select a key out of the N pics
	let key = g2Goal = chooseRandom(g2Pics);

	//this is instruction message
	let text = key.key;
	let cmd = 'click';
	let msg = cmd + " " + text.toUpperCase();
	let d = feedbackMessage = instructionMessage = mText(msg, title); //mInstruction(msg, title,false);instructionMessage.id='dInstruction';
	synthVoice(cmd + " " + text, .7, 1, .7, 'random');
	mLinebreak(table);


}


