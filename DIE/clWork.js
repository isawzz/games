class GGuess extends IClass{
	updatePlayer(pl){

		let key = getRandomKeys(1,'all');
		pl.item = getRandomSetItem(Settings.language, key);
		pl.word = pl.item.best;
		//console.log(pl.item)
	}
}





















