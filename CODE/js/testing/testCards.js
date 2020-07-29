
async function testPicto(n, spec, generator=genServerDataPicto) {
	let sdata = generator(n);
	//console.log(sdata);
	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();
}
async function testCardsUni(n, spec, cardGenerator=genServerDataCards) {
	let sdata = cardGenerator(n);
	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();
}

//#region individual card tests (unified in testCardsUni)
async function testCardDraw52(){
	let d=mBy('table');
	let ui = cardFace({rank:'K'},70,110);
	mAppend(d,ui);
}
async function testCardHorizontal2() {
	let sdata = genServerDataCards();
	// console.log('sdata', sdata)
	let spec = {
		ROOT: { type: 'panel', _NODE: 'cards' },
		cards: { cond: 'all', data: '.short_name' }
	};

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();
}
async function testCardHorizontal() {
	let sdata = genServerDataCards();
	// console.log('sdata', sdata)
	let spec = {
		ROOT: { _NODE: 'cards', params: { orientation: 'h' } },
		cards: { cond: 'all', data: '.short_name' }
	};

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();
}

async function testCard() {
	let sdata = genServerDataCards();
	//spec
	console.log('sdata', sdata)
	let spec = {
		ROOT: { cond: 'all', data: '.short_name' }
	};

	await rParse('direct', { defs: DEFS, spec: spec, sdata: sdata });
	mBy('message').innerHTML = '(direct) ' + getFunctionCallerName();
}
//endregion

function genCard() {
	let names = '23456789TJQKA';
	let s = chooseRandom(names);
	if (isNumber(s)) s = Number(s); //muss ich machen sonst macht er quotes um zahl in mNode!!!!!! 
	return { obj_type: 'card', short_name: s, oid: getUID() };
}
function genCard52Key() {
	let rank = '23456789TJQKA';
	let suit = 'CDHS';
	let specialRank='12';
	let specialSuit='BJ';
	let isSpecial = tossCoin(25);
	let s;
	if (isSpecial) {
		s = chooseRandom(specialRank)+chooseRandom(specialSuit);
	}else{
		s = chooseRandom(rank)+chooseRandom(suit);
	}
	return { obj_type: 'card', cardKey: s, oid: getUID() };
}
function genPicto() {
	//console.log('fffffffffffff')
	let key = chooseRandom(iconKeys);
	return { obj_type: 'picto', key: key, oid: getUID() };
}
function genServerDataCards(n = 3) {
	let sdata = {};
	for (let i = 0; i < n; i++) { let c = genCard(); sdata[c.oid] = c; }
	return sdata;
}
function genServerDataCards52(n = 3) {
	let sdata = {};
	for (let i = 0; i < n; i++) { let c = genCard52Key(); sdata[c.oid] = c; }
	return sdata;
}
function genServerDataPicto(n = 3) {
	let sdata = {};
	for (let i = 0; i < n; i++) { let c = genPicto(); sdata[c.oid] = c; }
	return sdata;
}












