var Items = [];
var Zones = {};

//#region zones
function clearZones() {
	for (const k in Zones) {
		clearElement(mBy(Zones[k].idData));
	}
}
function createPlayerZone(pl, namePos = 'top') {
	let z = { id: pl.id };
	let d = z.div = mDiv(dTable, { align: 'center' });//,{display:'flex',bg:pl.color});
	d.id = 'zone_' + pl.id;
	if (namePos == 'top') {
		z.dName = mText(pl.id, d, { display: 'inline-block', maleft: -10 });//,bg:'red'});
	}
	z.dData = mDiv(d, { margin: 0 });//,bg:'green'});
	if (namePos == 'bottom') {
		z.dName = mText(pl.id, d, { display: 'inline-block', maleft: -10 });//,bg:'red'});
	}
	z.dData.id = z.idData = 'data_' + pl.id;
	return z;
}
function takeYourSeats() {
	console.log('players taking seat', T.numPlayers)
	Zones = {};
	if (T.numPlayers == 2) {

		Zones[T.players[0].id] = createPlayerZone(T.players[0]);
		mLinebreak(dTable);
		let z = Zones.table = { id: 'table', div: mDiv(dTable, { hmin: 120 }) };
		z.div.id = z.idData = 'data_' + table;
		mLinebreak(dTable);
		Zones[T.players[1].id] = createPlayerZone(T.players[1], 'bottom');
	}
	console.log('Zones', Zones)
}
//#endregion

//#region ablauf
function startGame() {
	if (nundef(T.running)) setup();
	if (Settings.perspective != 'me') takeYourSeats();
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
function presentAll() {
	clearZones();
	console.log('Zones', Zones)
	for (const pl of T.players) {
		let zone = Zones[pl.id];
		pl.hand.showDeck(zone.dData, 'right', 0, false);
	}
	T.trick.showDeck(Zones.table.div, 'right', 20, true);
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
	activateOn(me.hand.topCard(), 'onclick', () => topCardShouldGoTo(me.hand, T.trick, true));
}
function evaluate() {
	T.index = (T.index + 1) % T.players.length;
	//once each player had a turn, turn outcome, start new round!
	if (T.index) startTurn(); else endTurn();
}
function endTurn(){
	//look which card is higher in rank
	present();
	let res = indexOfMax(T.trick,'rank');
	console.log('res',res);
	let winnerOfTrick = T.players[res.i];
	console.log('wins trick',winnerOfTrick.id);
	for(let i=0;i<T.trick.length;i++){
		
	}
	//check which player's card it was
	//add both cards to this player's hand
	//or start a war
}
//#endregion

//#region helpers
function activateOn(item, event, handler) {
	console.log(item)
	let d = item.div;
	mStyleX(d, { cursor: 'pointer' });
	d[event] = ev => { handler(ev); evaluate() };
	item.isActive = true;
}
function addItem(owner, key, val) {
	let o = owner[key] = val;
	Items.push(o);
	console.log('Items', Items)
}
function getTurnPlayer() {
	return T.players[T.index];
}
function showHands() {
	for (const pl of T.players) {
		console.log('hand', pl.id, pl.hand.map(x => x.key))
	}
	console.log('trick', T.trick.map(x => x.key))
}
function setup() {
	let deck = new Deck();
	deck.initTest(6);
	let n = deck.count() / 2;
	T.numPlayers = T.players.length;
	for (const pl of T.players) {
		addItem(pl,'hand',deck.deal(n));
		//pl.hand = deck.deal(n);
		addItem(pl,'warZone',[]);

		//pl.warZone = [];		//each player's warzone is empty
	}
	addItem(T,'trick',new Deck());
	//T.trick = new Deck(); 
	T.trick.initEmpty(); //in the middle of the table there is an empty trick
	shuffle(T.players); //player order is random
	T.index = 0;
	T.running = true;
}
function topCardShouldGoTo(deck0, deck1, faceUp) {
	let c = Deck.transferTopFromTo(deck0, deck1)
	if (faceUp == true) Card52.turnFaceUp(c);
	mRemoveStyle(c.div, ['cursor', 'position']);
}
//#endregion