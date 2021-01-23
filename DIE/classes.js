class GKrieg extends CardGame {
	constructor(players,state) { 
		super(); 
		this.players = players; //should be a list of players which will be set in correct order in init
		if (isdef(state)) copyKeys(state,this); else this.init();
	}
	init(){
		console.log('krieg init', this);
		this.cards = new Deck52(); this.cards.init(true); //playing with 1 deck of 52 cards

		//each player should get half of the cards,
		for (const pl of this.players) {
			pl.hand = this.cards.deal(26);
			pl.warZone = [];		//each player's warzone is empty
		}
		this.trick = []; //in the middle of the table there is an empty trick
		shuffle(this.players); //player order is random
		this.index=0;
	}
	resume(){
		console.log('krieg is setup',this);
	}
	
	present() {

		//show whose turn it is (das kommt schon aussen)
		let me = this.players[this.index];
		let others = arrWithout(this.players,[me]);

		//present other players hands
		for(const pl of others){
			pl.hand.showDeck(dTable, 'right', 0, false);

		}

		mLinebreak(dTable, 300);

		//present my hand
		me.hand.showDeck(dTable, 'right', 0, false);

		showFleetingMessage('click to play a card!');

	}
	prompt() {

	}
}

class GAristo extends CardGame {
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
	return new (GameClass1[G.id])(G.id);
}


