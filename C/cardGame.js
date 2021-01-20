//sagen wir das ist ein krieg spiel



class cardGame{
	constructor(){

	}
	setup(){ }
	deal(){	}

}
class Deck52{
	constructor(){
		this.cards = range(1,52);
		this.log();
	}
	log(){console.log(this.cards.join(','));}
	shuffle(){
		this.shuffle(this.cards);
		console.log(this.cards);
	}

}
class GKrieg{
	constructor(p1,p2){
		this.player1=p1;
		this.player2=p2;

		//playing with 1 deck of 52 cards
		let cards = new Deck52();
		//each player should get half of the cards,

		//in the middle of the table there is an empty trick
		//each player's warzone is empty
	}
}














