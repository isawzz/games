class GKrieg {
	constructor(players, state) {
		this.players = players; //should be a list of players which will be set in correct order in init
		if (isdef(state)) copyKeys(state, this); else this.init();
	}
	init() {
		//console.log('krieg init', this);
		this.cards = new Deck(); this.cards.init(true); //playing with 1 deck of 52 cards

		//each player should get half of the cards,
		for (const pl of this.players) {
			pl.hand = this.cards.deal(26);
			pl.warZone = [];		//each player's warzone is empty
		}
		T.trick = []; //in the middle of the table there is an empty trick
		shuffle(this.players); //player order is random
		this.index = 0;
	}
	resume() {
		console.log('krieg is setup', this);
	}

	present() {

		//show whose turn it is (das kommt schon aussen)
		let me = this.me = this.players[this.index];
		let others = arrWithout(this.players, [me]);

		//present other players hands
		for (const pl of others) {
			pl.hand.showDeck(dTable, 'right', 0, false);

		}

		mLinebreak(dTable);

		this.dTrick = mDiv(dTable);
		mStyleX(this.dTrick, { display: 'inline-block', 'min-height': 110, 'mid-width': 100 });
		for (const c of this.trick) {
			Card52.show(c, dTrick);
		}

		//present my hand
		mLinebreak(dTable);
		me.hand.showDeck(dTable, 'right', 0, false);

		showFleetingMessage('click to play a card!');
		activateUi();
	}
	activate() {
		let options = [
			{ play: { event: 'click', obj: this.me.hand } },//,handler:o=>}}
		];
		activateOptions(options);
		let hand = this.me.hand;
		let c = hand.topCard();
		let d = c.div;
		mStyleX(d, { cursor: 'pointer', border: 'yellow' });
		let x = this.dTrick;
		d.onclick = ev => {
			if (!canAct()) return;



			Card52.turnFaceUp(c);
			d.style.position = null;
			d.style.border = null;
			d.style.cursor = null;
			mRemoveStyle(d, ['cursor', 'border', 'position']);
			hand.pop();
			this.trick.push(hand.pop());
			console.log(x)
			mAppend(x, c.div);
		}
		//console.log('wenn click, spiele aus',Card52.toString(c)); //,c.key,c.rank,c.suit,c
		//this.cards.top.div.onclick = 
	}
}

class GAristo { }

function getInstance(G) {
	//console.log(G)
	const GameClass1 = {
		gKrieg: GKrieg, gAristocracy: GAristocracy, gGuess: GGuess,
	};
	return new (GameClass1[G.id])(G.id);
}

function playsCard(pl,card,dHand,dTarget,faceUp){
	pl.cardPlayed=card;
	removeCard(card,dHand);
	addCard(card,dTarget);
	if (faceUp == true) Card52.turnFaceUp(card);
	mRemoveStyle(card.div, ['cursor', 'position']);
}

function removeCard(c,deck){removeInPlace(deck,c);}
function addCard(c,deck,top=true){top?deck.push(c):deck.unshift(c);}





function showState(){
	console.log('______________',G.friendly);
	console.log(T.players)

}

