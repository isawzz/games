//sagen wir das ist ein krieg spiel



class CardGame {
	constructor() {

	}
	setup() { }
	deal() { }

}
class Deck52 extends Array{
	init(shuffled=true,jokers=0) {
		
		range(1, 52+jokers).map(x=>this.push(x));
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
	putOnTop(x){this.unshift(x);}

}













