function getRandomExerciser(dPic){
	let row=randomNumber(0,5)*100; //Math.round(Math.random()*10); //200;
	let col=randomNumber(0,7)*100; //Math.random()*500;
	dPic.style.width='100px';
	dPic.style.height='100px';
	dPic.style.background=`url('../assets/images/postures/exercises.gif') -${col}px -${row}px`;
}









