
function getC52Key(i) {
	if (i > 52) return 'card_J1';
	let rank = getC52Rank(i);
	let suit = getC52Suit(i);
	return 'card_'+rank+suit;
}
function getC52Rank(i){
	let rank = 1 + (i % 13); 
	if (rank == 1) rank='A'; 
	else if (rank>=10) rank=['T','J','Q','K'][rank-10];
	
	return rank;
}
function getC52Suit(i){
	return ['S', 'H', 'D', 'C'][divInt(i,13)];
}
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }








