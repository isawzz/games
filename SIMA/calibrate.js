var calGames,isCal,calStartLevels,calGame;


function exitCalibrationMode() {
	let b = mBy('dCalibrate');
	b.style.backgroundColor = 'transparent';

	[sBefore,sAfter] = calibrateUser();
	stopGame();
	gameOver('Processing your test result...',true);
	addSessionToUserGames();
	isCal = false;
}
function enterCalibrationMode(all1) {
	addSessionToUserGames();

	isCal = true;
	let b = mBy('dCalibrate');
	b.style.backgroundColor = 'red';
	if (all1 == 1) { calGames = [G.key]; }
	else { calGames = jsCopy(U.seq); }

	calGame = calGames[0];

	calStartLevels = getStartLevels(USERNAME); // {game:getUserStartLevel(calGame)};
	setGame(calGame);
	setBadgeLevel(G.level);
	startUnit();

}

function isLastCalGame(){return G.key == calGames[0]; }

function calibrating(){return isCal==true;}// USERNAME == 'test';}

function calibrateUser(){
	let sBefore=calStartLevels; //getStartLevels(uname);
	let sAfter = getStartLevels(USERNAME);
	console.log(sBefore,sAfter);

	for (const gname in GAME) {
		let origStartLevel = lookupSet(calStartLevels,[gname],0);
		let testStartLevel = lookupSet(sAfter,[gname],origStartLevel);
	}
	return [sBefore,sAfter];
}






