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
