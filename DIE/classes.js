class GKrieg extends CardGame {
	constructor(p1, color1, p2, color2) {
		super();
		this.players = [new Player(p1, color1), new Player(p2, color2)];
	}
	startGame() {
		this.cards = new Deck52(); this.cards.init(true); //playing with 1 deck of 52 cards

		//each player should get half of the cards,
		for (const pl of this.players) {
			pl.hand = this.cards.deal(26);
			pl.warZone = [];		//each player's warzone is empty
		}
		this.trick = []; //in the middle of the table there is an empty trick
		shuffle(this.players); //player order is random
		//console.log(this.players);
	}
	startRound() {

		//show whose turn it is (das kommt schon aussen)

		//divide table into ones: 
		//each zone should be of hight 200

		//show player hand closed & as a pack: card layout functions
		let hand = this.players[0].hand;
		this.players[0].hand.showDeck(dTable, 'right', 0, false);

		mLinebreak(dTable,400);

		this.players[1].hand.showDeck(dTable, 'right', 0, false);

		// START
		//test02_showDeckFaceDown();
		//erster player spielt top card of his pile


	}
	prompt() {

	}
}

class GAristocracy extends CardGame {
	constructor(p1, p2) {
		super();
		this.player1 = p1;
		this.player2 = p2;
		let cards = new Deck52(); //playing with 1 deck of 52 cards
	}
}

function getInstance(G) {
	//console.log(G)
	const GameClass1 = {
		gKrieg: GKrieg, gAristocracy: GAristocracy,
	};
	return new (GameClass1[G.key])(G.key);
}


