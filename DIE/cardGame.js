//sagen wir das ist ein krieg spiel
class CardGame {
	constructor() { }//console.log('CardGame constructor!!!')}
}
class Card52 {
	static toString(c) { return c.rank + ' of ' + c.suit; }
	static getKey(i) {
		if (i > 52) return 'card_J1';
		let rank = Card52.getRank(i);
		let suit = Card52.getSuit(i);
		return 'card_' + rank + suit;

	}
	static getRank(i) {
		let rank = 1 + (i % 13);
		if (rank == 1) rank = 'A';
		else if (rank >= 10) rank = ['T', 'J', 'Q', 'K'][rank - 10];

		return rank;
	}
	static getSuit(i) {
		return ['S', 'H', 'D', 'C'][divInt(i, 13)];
	}
	static createUi(irankey, suit, w, h) {
		//console.log('cardFace',rank,suit,w,h)

		//#region set rank and suit from inputs
		let rank = irankey;
		if (nundef(irankey) && nundef(suit)) {
			irankey = chooseRandom(Object.keys(c52));
			rank = irankey[5];
			suit = irankey[6];
		} else if (nundef(irankey)) {
			//face down card!
			irankey = '2';
			suit = 'B';
		} else if (nundef(suit)) {
			if (isNumber(irankey)) irankey = Card52.getKey(irankey);
			rank = irankey[5];
			suit = irankey[6];
		}
		//console.log('rank', rank, 'suit', suit); // should have those now!

		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A';
		if (nundef(suit)) suit = 'H'; else suit = suit[0].toUpperCase(); //joker:J1,J2, back:1B,2B
		//#endregion

		//#region load svg for card_[rank][suit] (eg. card_2H)
		let cardKey = 'card_' + rank + suit;
		let svgCode = c52[cardKey]; //c52 is cached asset loaded in _start
		// console.log(cardKey, c52[cardKey])
		svgCode = '<div>' + svgCode + '</div>';
		let el = createElementFromHTML(svgCode);
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		//console.log('__________ERGEBNIS:',w,h)
		//#endregion

		return { rank: rank, suit: suit, key: cardKey, div: el, w: w, h: h, faceUp: true };
	}
	static turnFaceDown(c) {
		//console.log(c.faceUp)
		if (!c.faceUp) return;
		let svgCode = c52.card_2B; //c52 is cached asset loaded in _start
		c.div.innerHTML = svgCode;
		c.faceUp = false;
	}
	static turnFaceUp(c) {
		if (c.faceUp) return;
		c.div.innerHTML = c52[c.key];
		c.faceUp = true;
	}
	static getItem(i, h = 110) {
		let w = h * .7;
		let c = Card52.createUi(i, undefined, w, h);
		c.i = i;
		return c;
	}
	static show(icard, dParent, h = 110, w = undefined) {
		if (isNumber(icard)) {
			if (nundef(w)) w = h * .7;
			icard = Card52.createUi(icard, undefined, w, h);
		}
		mAppend(dParent, icard.div);
	}
	// static show1(i, dParent, h = 110, w = undefined) {
	// 	if (nundef(w)) w = h * .7;
	// 	let c = Card52.createUi(i, undefined, w, h);
	// 	mAppend(dParent, c.div);
	// }
}
class Deck extends Array {
	initTest(n,shuffled = true){range(0, n).map(x => this.push(Card52.getItem(x)));if (shuffled) this.shuffle();}
	initEmpty(){}
	init52(shuffled = true, jokers = 0) {
		range(0, 51 + jokers).map(x => this.push(Card52.getItem(x)));
		//this.__proto__.faceUp = true;
		//console.log(this.__proto__)
		if (shuffled) this.shuffle();
	}
	count(){return this.length;}
	static transferTopFromTo(d1,d2){
		let c=d1.pop();
		d2.putUnderPile(c);
		return c;
	}
	deal(n) { return this.splice(0, n); }
	getIndices() { return this.map(x => x.i); }
	log() { console.log(this); }
	putUnderPile(x) { this.push(x); }
	putOnTop(x) { this.unshift(x); }
	showDeck(dParent, splay, ovPercent = 0, faceUp) {
		if (isdef(faceUp)) { if (faceUp == true) this.turnFaceUp(); else this.turnFaceDown(); }
		splayout(this, dParent, {}, ovPercent, splay);
	}
	shuffle() { shuffle(this); }
	topCard() { return this[this.length - 1]; }
	turnFaceUp() {
		if (isEmpty(this) || this[0].faceUp) return;
		//if (this.__proto__.faceUp) return;
		this.map(x => Card52.turnFaceUp(x));
		//this.__proto__.faceUp = true;
	}
	turnFaceDown() {
		if (isEmpty(this) || !this[0].faceUp) return;
		//if (!this.__proto__.faceUp) return;
		//console.log(this[0])
		this.map(x => Card52.turnFaceDown(x));
		//this.__proto__.faceUp = false;
	}
}

class Deck52_dep extends Array {
	init(shuffled = true, jokers = 0) {

		range(0, 51 + jokers).map(x => this.push(x));
		//range(0, 51 + jokers).map(x => this.push(Card52.getItem(x)));
		//this.log();
		if (shuffled) this.shuffle();

		//this.shuffle();
	}
	log() { console.log(this); }//this.join(',')); }
	shuffle() {
		shuffle(this);
		//this.log();
	}
	deal(n) { return this.splice(0, n); }
	putUnderPile(x) { this.push(x); }
	putOnTop(x) { this.unshift(x); }
	topCard() { return Card52.getItem(this[this.length - 1]); }
}












