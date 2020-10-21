var g2_pic1, g2_pic2;
var g2Pics = [];
var g2N = 2;
var g2Goal;

function gTouchPicStart() {
	console.log('touch pic game!')
	let table = dLineMidMiddle;
	if (nundef(table)) return;
	clearElement(table);

	mStyleX(table, { bg: 'violet' });

	g2Pics = [];
	let styles = { w: 200, margin: 20, bg: 'random', cursor: 'pointer' };
	let handler = ev => {
		let id = evToClosestId(ev);
		console.log('id', id);
		ev.cancelBubble = true;

		//get from id to pic!
		let i = firstNumber(id);
		console.log('index', i);
		let item = g2Pics[i];
		console.log('picked:', item);

		hintMessage.innerHTML = g2Goal.key.toUpperCase();

		if (item.key == g2Goal.key) {
			console.log('SUCCESS!!!!');
			scoreFunction2(true);
			feedbackMessage.innerHTML = "CORRECT!";
			say('Excellent!!!');
	
		} else {
			console.log('FAIL!!')
			scoreFunction2(false);
			feedbackMessage.innerHTML = "Nope!";
			say('too bad!',1,1,.8,'zira');
		}

		setTimeout(gTouchPicStart, 1500);
	}
	for (let i = 0; i < g2N; i++) {
		let info = getEmoSetWords('E');
		let id = 'pic' + i;
		let d1 = maPicButton(info, handler, table, styles); d1.id = id;
		g2Pics.push({ key: info.key, info: info, div: d1, id: id, index: i });
	}
	// g2_pic1 = getEmoSetWords('E');
	// g2_pic2 = getEmoSetWords('E');
	// //console.log(g2_pic1,g2_pic2)
	// // let d1 = maPic(g2_pic1, table, { w: 200, margin: 20, bg:'blue' });
	// // let d2 = maPic(g2_pic2, table, { w: 200, margin: 20, bg: 'green' });
	// let d1 = maPicButton(g2_pic1, handler, table, styles);d1.id='pic1';
	// let d2 = maPicButton(g2_pic2, handler, table, styles);d2.id='pic2';

	//randomly select a key out of the N pics
	let key = g2Goal = chooseRandom(g2Pics);
	console.log('key is', key)

	//hint
	hintMessage = mHeading('', table, 1, 'hint');
	hintMessage.style.fontSize = '40pt';
	mLinebreak(table);


	//this is instruction message
	let text = key.key;
	let cmd = 'click';
	let msg = cmd + " " + text.toUpperCase();
	feedbackMessage = instructionMessage = mInstruction(msg, table);
	synthVoice(cmd + " " + text,.7,1,.7,'random');
	mLinebreak(table);


}

