class GKrieg extends CardGame {
	constructor(p1, color1, p2, color2) {
		super();
		this.players = [new Player(p1, color1), new Player(p2, color2)];
	}
	startGame() {
		//playing with 1 deck of 52 cards
		this.cards = new Deck52(); this.cards.init(true);

		//each player should get half of the cards,
		for (const pl of this.players){
			pl.hand = this.cards.deal(26);
			pl.warZone = [];		//each player's warzone is empty
			//console.log(pl.hand);//
			//console.log(pl.hand.map(x=>getC52Key(x)));
		}
		//console.log(getC52Key(1),getC52Key(this.players[0].hand[0]),this.players[0].hand.map(x=>getC52Key(x)))

		//in the middle of the table there is an empty trick
		this.trick = [];

		//player order is random
		shuffle(this.players);
		console.log(this.players);
	}
	startRound(){
		//show player hand closed & as a pack: card layout functions
		//erster player spielt top card of his pile
		
		//test01:
		//this.players[0].hand.map(x=>Card52.show(x,dTable));
		//mLinebreak(dTable,25);
		//this.players[1].hand.map(x=>Card52.show(x,dTable));

		//test02:
		let hand = this.players[0].hand;
		showCards52(hand,'down');
		showCards52(hand);
		showCards52(hand,'up');
		showCards52(hand,'left');
		mLinebreak(dTable);
	}
	prompt(){

	}
}

class GAristocracy extends CardGame {
	constructor(p1, p2) {
		super();
		this.player1 = p1;
		this.player2 = p2;

		//playing with 1 deck of 52 cards
		let cards = new Deck52();
		//each player should get half of the cards,

		//in the middle of the table there is an empty trick
		//each player's warzone is empty
	}
}
function getInstance(G) {
	var gc = {
		gKrieg: GKrieg, gAristocracy: GAristocracy
	};
	return new GKrieg();
	return new (gc[G.key])(G.key);
}
