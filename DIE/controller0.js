var Items = [];
var Zones = {};
var Options = {};

//#region zones
function clearZones() {
	for (const k in Zones) {
		clearElement(Zones[k].dData);
	}
}
function createCardZone(id, label, labelPos = 'top', hCard = 110) {
	let gap = 2;
	let dZone = mDiv(dTable, { padding: 10, align: 'center', rounding: 20 });
	dZone.id = 'zone_' + id;
	let dLabel;
	if (isdef(label) && labelPos == 'top') {
		dLabel = mText(label, dZone, { display: 'inline-block', maleft: -10 });
	}
	let dData = mDiv(dZone, { h: hCard + gap, align: 'center' });
	dData.id = 'data_' + id;
	if (isdef(label) && labelPos == 'bottom') {
		dLabel = mText(label, dZone, { display: 'inline-block', maleft: -10 });
	}
	let b = getBounds(dZone);
	return { div: dZone, dData: dData, dLabel: dLabel, label: label, labelPos: labelPos, w: b.width, h: b.height, center: actualCenter(dZone) };
}
function createTableZone(showColor = false) {
	let z = createCardZone('table');
	if (showColor) mStyleX(z.div, { bg: 'white' });
	return z;
}
function createPlayerZone(pl, namePos = 'top', showColor = false) {
	let id = pl.id;
	let z = createCardZone(id, id, namePos);
	//console.log('player zone',z)
	if (showColor) mStyleX(z.div, { bg: pl.color });
	pl.zone = z;
	return z;
}
function takeYourSeats() {
	//console.log('players taking seat', T.numPlayers)
	Zones = {};
	if (T.numPlayers == 2) {
		Zones[T.players[0].id] = createPlayerZone(T.players[0]);
		mLinebreak(dTable);
		Zones.table = createTableZone(true);
		//console.log(Zones.table)
		mLinebreak(dTable);
		Zones[T.players[1].id] = createPlayerZone(T.players[1], 'bottom');
	}
	//console.log('Zones', Zones)
}
//#endregion

//#region ablauf
function startGame() {
	if (nundef(T.running)) setup(6);
	if (Settings.perspective != 'me') takeYourSeats();
	startRound();
}
function startRound() {
	T.players.map(x => delete x.cardPlayed)
	T.index = 0;
	startTurn();
}
function startTurn() {
	let me = getTurnPlayer();
	changeUserTo(me.id)
	showHands();
	present();
	optionsFor(me);
}
function present() {
	if (Settings.perspective == 'me') presentFor(me);
	else presentAll();
}
function showTrick() {
	let dZone = Zones.table.dData;
	let d = mDiv(dZone);
	mStyleX(d, { display: 'flex', position: 'relative' });
	let zIndex=1;
	for (let i = 0; i < T.trick.length; i++) {
		let c = T.trick[i];
		//console.log(c.w,c.h)
		//let pl = T.players[i];
		//let plZone = pl.zone;
		let direction = i == 0 ? { x: 0, y: -1 } : { x: 0, y: 1 };
		let displ = 10;
		let offset = { x: -35+ direction.x * displ, y: direction.y * displ };
		
		let d1 = c.div;
		mAppend(d, d1);
		mStyleX(d1, { position: 'absolute',left:offset.x,top:offset.y, z:zIndex});// left: offset.x, top: offset.y });
		zIndex+=1;
	}
}
function presentAll() {
	clearZones();
	//console.log('Zones', Zones)
	for (const pl of T.players) {
		let zone = Zones[pl.id];
		pl.hand.showDeck(zone.dData, 'right', 0, false);
	}

	showTrick();
	//T.trick.showDeck(Zones.table.div, 'right', 20, true);
}
function presentFor(me) {
	clearElement(dTable);
	let others = arrWithout(T.players, [me]);

	//present other players hands
	for (const pl of others) {
		pl.hand.showDeck(dTable, 'right', 0, false);
	}

	mLinebreak(dTable);

	T.trick.showDeck(dTable, 'right', 20, true);
	// let dTrick = mDiv(dTable);
	// mStyleX(dTrick, { display: 'inline-block', 'min-height': 110, 'mid-width': 100 });
	// for (const c of T.trick) {
	// 	Card52.show(c, dTrick);
	// }

	//present my hand
	mLinebreak(dTable);
	me.hand.showDeck(dTable, 'right', 0, false);

	showFleetingMessage('click to play a card!');
	// activateUi();

}
function optionsFor(me) {

	Options ={};
	Options.play = {f:()=>{playsCard(me, me.hand.topCard(), me.hand, T.trick, true);evaluate();}};

	setTimeout(Options.play.f,2000);
	//activateOn(me.hand.topCard(), 'onclick', () => playsCard(me, me.hand.topCard(), me.hand, T.trick, true));

}
function evaluate() {
	T.index = (T.index + 1) % T.players.length;
	//once each player had a turn, turn outcome, start new round!
	if (T.index) startTurn(); else present();
}
function endTurn() {
	//look which card is higher in rank
	present();

	let el=T.trick[0].div;

	let res = indexOfMax(T.trick, 'rank');
	//console.log('res', res);
	let winnerOfTrick = T.players[res.i];
	
	
	
	
	
	//console.log('wins trick', winnerOfTrick.id);
	winnerOfTrick.hand.add(T.trick);


	let pos = actualCenter(el);
	let targetPos = actualCenter(Zones[winnerOfTrick.id].div);
	console.log('from',pos,'to',targetPos);

	el.style.position='fixed';
	el.style.left=pos.x+'px';
	el.style.top=pos.y+'px';


	//el.style.transition='left 1s ease-in-out';

	setTimeout(()=>{el.style.left=targetPos.x+'px';el.style.top=targetPos.y+'px'}, 2000);
	showHands();
	return;


	//check for end condition: if one player's hand is empty, the other player wins
	let losers = [], winners = [];
	for (const pl of T.players) {
		if (pl.hand.count() == 0) { losers.push(pl); } else { winners.push(pl); }
	}

	//console.log(losers, winners)
	if (winners.length == 1) {
		//the winner is: winners[0]
		console.log('*** game over *** winner', winners[0]); return;
	} else {
		console.log('game goes on');
		showHands();
		//for (const l of losers) removeInPlace(T, l);
	}

	setTimeout(startRound, 2000);
}
//#endregion

//#region helpers
function activateOn(item, event, handler) {
	//console.log(item)
	
	let d = item.div;
	mStyleX(d, { cursor: 'pointer' });
	d[event] = ev => { handler(ev); evaluate() };
	item.isActive = true;
}
function addItem(owner, key, val) {
	let o = owner[key] = val;
	Items.push(o);
	//console.log('Items', Items)
}
function getTurnPlayer() {
	return T.players[T.index];
}
function showHands() {
	return;
	for (const pl of T.players) {
		console.log('hand', pl.id, pl.hand.map(x => x.key))
	}
	console.log('trick', T.trick.map(x => x.key))
}
function setup(numCards = 2) {
	let deck = new Deck();
	deck.initTest(numCards);
	let n = deck.count() / 2;
	T.numPlayers = T.players.length;
	for (const pl of T.players) {
		addItem(pl, 'hand', deck.deal(n));
		//pl.hand = deck.deal(n);
		addItem(pl, 'warZone', []);

		//pl.warZone = [];		//each player's warzone is empty
	}
	addItem(T, 'trick', new Deck());
	//T.trick = new Deck(); 
	T.trick.initEmpty(); //in the middle of the table there is an empty trick
	shuffle(T.players); //player order is random
	T.index = 0;
	T.running = true;
}
function topCardShouldGoTo(deck0, deck1, faceUp) {
	let c = Deck.transferTopFromToBottom(deck0, deck1)
	if (faceUp == true) Card52.turnFaceUp(c);
	mRemoveStyle(c.div, ['cursor', 'position']);
}
//#endregion