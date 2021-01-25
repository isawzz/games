function mZone(dParent, sz = { w: 200, h: 200 }, pos) {
	let d = mDiv(dParent, { w: sz.w, h: sz.h, bg: 'random' });
	if (isdef(pos)) { mPosAbs(dParent, pos.x, pos.y); }
}
function test03_centerToCenter() {

	//make ein xbliebiges div mit irgendeiner groesse
	let z1 = mDiv(dTable, { w: 200, h: 200, bg: 'random' });


	let d = mDover(dTable);
	let item = show52(13, d);

	let di = item.div;
	di.style.position = 'absolute';
	let parent = d;
	let tablePos = getBounds(di, false, dTable);
	console.log('tablePos', tablePos.x, tablePos.y);

	mLinebreak(dTable, 100)
	let dParent = mDiv(dTable, { w: 200, h: 200, bg: 'yellow' });
	let center = actualCenter(dParent, false, dTable);
	let b = getBounds(dParent, false, dTable);
	console.log('center of yellow', center.x, center.y, b)
	let offset = { w: 35, h: 55 };
	center.x -= offset.w;
	center.y -= offset.h;

	item.div.animate([
		// keyframes
		{ position: 'absolute', left: '0px', top: '0px' },
		{ position: 'absolute', left: '' + center.x + 'px', top: center.y + 'px' },
	], {
		// timing options
		duration: 500,
		fill: 'forwards',

		// iterations: Infinity,
		// direction: 'alternate'		
	});




}
function test03_richtungCenter() {
	let d = mDover(dTable);
	let item = show52(13, d);

	let di = item.div;
	di.style.position = 'absolute';
	let parent = d;
	let tablePos = getBounds(di, false, dTable);
	console.log('tablePos', tablePos.x, tablePos.y);

	mLinebreak(dTable, 100)
	let dParent = mDiv(dTable, { w: 200, h: 200, bg: 'yellow' });
	let center = actualCenter(dParent, false, dTable);
	let b = getBounds(dParent, false, dTable);
	console.log('center of yellow', center.x, center.y, b)
	let offset = { w: 35, h: 55 };
	center.x -= offset.w;
	center.y -= offset.h;

	item.div.animate([
		// keyframes
		{ position: 'absolute', left: '0px', top: '0px' },
		{ position: 'absolute', left: '' + center.x + 'px', top: center.y + 'px' },
	], {
		// timing options
		duration: 500,
		fill: 'forwards',

		// iterations: Infinity,
		// direction: 'alternate'		
	});




}
function test03_left() {
	let d = mDover(dTable);
	let item = show52(13, d);
	item.div.animate([
		// keyframes
		{ position: 'absolute', left: '0px', top: '0px' },
		{ position: 'absolute', left: '220px', top: '110px' },
	], {
		// timing options
		duration: 500,
		fill: 'forwards',

		// iterations: Infinity,
		// direction: 'alternate'		
	});
}
function test03_rotate() {
	let d = mCanvas(dTable);
	let item = show52(13, d);
	item.div.animate([
		// keyframes
		// { transform: 'rotate(-60deg)' },
		{ transform: 'rotate(90deg)' },
	], {
		// timing options
		duration: 500,

		// iterations: Infinity,
		// direction: 'alternate'		
	});
}
function test03_translate() {
	let d = mCanvas(dTable);
	let item = show52(13, d);
	item.div.animate([
		// keyframes
		{ transform: 'translate(0px,0px)' },
		{ transform: 'translate(300px,200px)' }
	], {
		// timing options
		duration: 500,
		iterations: Infinity,
		direction: 'alternate'
	});
}

function test03_trash() {
	//mDover is same as mCanvas100
	//d is now covered by dover
	let dover = mDover(dTable); mStyleX(dover, { bg: 'pink' }); // table size wurde durch dou NICHT veraendert! dover only covers upper part of table!
	b = getBounds(dover); console.log('dover', b.width, b.height);

	//mStyleX(dover,{bg:'transparent'}); //now can see d again
	//alternatively:
	mRemoveStyle(dover, ['background-color']); //=>TODO: mRemoveStyleX mit bg,fg,...

	item = i52(35);
	mAppend(item.div, dover);
	anim1(item.div, 'left', 0, 200, 1000);

	// item=i52(25);
	// item.div=mText('hallo',dover,{padding:25});
	// container = dover;
	// mClass(container,'container');
	// //item = show52(15, dover);
	// mClass(item.div,'bubble2')
	// item.div.style.setProperty('--xStart', '0px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--xEnd', '400px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--yStart', '0px'); //`rgb(${r},${g},${b})`);
	// item.div.style.setProperty('--yEnd', '-100px'); //`rgb(${r},${g},${b})`);
	// //dTable.addEventListener("mousemove", updateBubbleColors);



	//	item=show52(14,d);
	// mPos(item.div,0,0);


}

function test03_basics() {

	// show52(24,dTable);

	// mLinebreak(dTable);

	// let i=10;while(i--){let x=randomNumber(0,51);console.log(x);show52(x,dTable,coin());}

	// mLinebreak(dTable);


	let b = getBounds(dTable); console.log(b.width, b.height); mStyleX(dTable, { bg: 'red' }); //height=0

	//let i = 10; while (i--) { show52(24, dTable); mLinebreak(dTable); } //ja, zones gehen!

	let deck = range(0, 51).map(x => i52(x));
	iResize52(deck, 40);
	splayout(deck, dTable)

	mLinebreak(dTable, 10);

	let d = mCanvas(dTable);
	let item = show52(13, d);
	mRot(item.div, 45); //rotates around center!

	//wie kann ich das animaten?
	mLinebreak(dTable, 10);

	// let dou = mDiv100(dTable); mStyleX(dou, { bg: 'yellow' }); // der wird unter den anderen table plaziert!
	// b = getBounds(dou); console.log('dou',b.width, b.height);


}

function test02_showDeckFaceDown() {
	let hand = G.instance.players[0].hand;
	hand.showDeck(dTable); //,'right',0,false);
	console.log(hand[0].faceUp)
	hand.turnFaceDown();
}
function test02_turnDeckFaceDown() {
	let hand = G.instance.players[0].hand;
	showCards52(hand, 'down');
	console.log(hand[0].faceUp)
	hand.turnFaceDown();
}
function test02_turnCard() {
	let pl = G.instance.players[0];
	//console.log(pl.hand)
	let card = pl.hand.topCard();
	console.log(card);
	Card52.show(card, dTable);
	setTimeout(() => Card52.turnFaceDown(card), 1000)
	setTimeout(() => Card52.turnFaceUp(card), 2000)
}
function test02_show4Decks() {
	let hand = G.instance.players[0].hand.getIndices();
	console.log(hand)
	showCards52(hand, 'down');
	showCards52(hand);
	showCards52(hand, 'up');
	showCards52(hand, 'left');
	mLinebreak(dTable);
}
function test02_showCard() {
	G.instance.players[0].hand.map(x => Card52.show(x, dTable));
	mLinebreak(dTable, 25);
	G.instance.players[1].hand.map(x => Card52.show(x, dTable));
}

function test01_modifyUser() {
	lookupAddToList(U, ['games', 'gAristocracy', 'running'], 2);
	changeUserTo('mia');

}
data = {
	"id": "boardGames",
	"users": {
		"nil": {
			"id": "nil",
			"seq": [
				"gTicTacToe",
				"gAristocracy",
				"gGoalNumber",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gAbacus",
			"settings": {
				"samplesPerGame": 20,
				"minutesPerUnit": 13,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 10,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "lifePlus",
				"showTime": true,
				"spokenFeedback": false,
				"silentMode": true,
				"switchGame": true,
				"trials": 2,
				"showHint": true,
				"categories": [
					"nosymemo"
				],
				"pressControlToUnfreeze": false,
				"reducedAnimations": true,
				"levelBadges": false
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 0
				},
				"gTouchColors": {
					"startLevel": 0
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 3
				},
				"gElim": {
					"startLevel": 2
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		},
		"guest0": {
			"id": "guest",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gTouchPic",
			"settings": {
				"samplesPerGame": 10,
				"minutesPerUnit": 10,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best25",
				"showTime": false,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 0
				}
			}
		},
		"test0": {
			"id": "test0",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gAbacus",
			"settings": {
				"samplesPerGame": 10,
				"minutesPerUnit": 10,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best25",
				"showTime": false,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 0
				},
				"gTouchColors": {
					"startLevel": 0
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 3
				},
				"gElim": {
					"startLevel": 0
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		},
		"gul": {
			"id": "gul",
			"seq": [
				"gTouchPic",
				"gPremem",
				"gTouchColors",
				"gMissingLetter",
				"gSteps",
				"gSayPic",
				"gMem",
				"gMissingNumber",
				"gWritePic",
				"gAnagram",
				"gElim",
				"gAbacus"
			],
			"lastGame": "gTouchPic",
			"settings": {
				"samplesPerGame": 25,
				"minutesPerUnit": 20,
				"incrementLevelOnPositiveStreak": 10,
				"decrementLevelOnNegativeStreak": 5,
				"showLabels": "toggle",
				"language": "E",
				"vocab": "best100",
				"showTime": true,
				"spokenFeedback": true,
				"silentMode": false,
				"switchGame": true,
				"trials": 2,
				"showHint": true
			},
			"games": {
				"gTouchPic": {
					"startLevel": 3
				},
				"gPremem": {
					"startLevel": 3
				},
				"gTouchColors": {
					"startLevel": 2
				},
				"gMissingLetter": {
					"startLevel": 2
				},
				"gSteps": {
					"startLevel": 0
				},
				"gSayPic": {
					"startLevel": 0
				},
				"gMem": {
					"startLevel": 1
				},
				"gMissingNumber": {
					"startLevel": 2
				},
				"gWritePic": {
					"startLevel": 2
				},
				"gAnagram": {
					"startLevel": 0
				},
				"gElim": {
					"startLevel": 1
				},
				"gAbacus": {
					"startLevel": 0
				}
			}
		}
	},
	"settings": {
		"minutesPerUnit": 15,
		"samplesPerLevel": 1,
		"trials": 3,
		"showLabels": "toggle",
		"incrementLevelOnPositiveStreak": 5,
		"decrementLevelOnNegativeStreak": 3,
		"language": "E",
		"vocab": "best25",
		"spokenFeedback": true,
		"silentMode": false,
		"categories": [
			"nosymemo"
		],
		"pressControlToUnfreeze": false,
		"reducedAnimations": true,
		"levelBadges": false,
		"showHint": true,
		"games": {
			"gTouchPic": {
				"levels": {
					"0": {
						"numPics": 2
					},
					"1": {
						"numPics": 4
					},
					"2": {
						"numPics": 9
					},
					"3": {
						"numPics": 16
					},
					"4": {
						"numPics": 25
					},
					"5": {
						"numPics": 36
					}
				}
			},
			"gMissingLetter": {
				"levels": {
					"0": {
						"numMissing": 1,
						"posMissing": "start"
					},
					"1": {
						"numMissing": 2,
						"posMissing": "start"
					},
					"2": {
						"numMissing": 1,
						"posMissing": "random"
					},
					"3": {
						"numMissing": 2,
						"posMissing": "random"
					},
					"4": {
						"numMissing": 3,
						"posMissing": "random"
					},
					"5": {
						"numMissing": 5,
						"posMissing": "random"
					}
				}
			},
			"gMissingNumber": {
				"numMissing": 1,
				"minNum": 0,
				"maxNum": 99,
				"steps": 1,
				"posMissing": "end",
				"ops": [
					"plus"
				],
				"seqLen": 5,
				"levels": {
					"0": {
						"maxNum": 10
					},
					"1": {
						"maxNum": 10,
						"ops": [
							"minus"
						]
					},
					"2": {
						"maxNum": 10,
						"ops": [
							"plus",
							"minus"
						]
					},
					"3": {
						"maxNum": 25,
						"ops": [
							"plus",
							"minus"
						]
					},
					"4": {
						"maxNum": 50,
						"steps": [
							1,
							2,
							3
						],
						"ops": [
							"plus"
						]
					},
					"5": {
						"maxNum": 50,
						"steps": [
							1,
							2
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"6": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							1,
							2
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"7": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							1,
							2,
							3,
							4,
							5
						],
						"ops": [
							"plus",
							"minus"
						]
					},
					"8": {
						"posMissing": "notStart",
						"maxNum": 99,
						"steps": [
							3,
							4,
							5,
							6,
							7,
							8,
							9,
							10
						],
						"ops": [
							"plus",
							"minus"
						]
					}
				}
			},
			"gSteps": {
				"contrast": 0.22,
				"colors": [
					"blue1",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 9,
						"numColors": 1,
						"numRepeat": 1,
						"numSteps": 2
					},
					"1": {
						"numPics": 9,
						"numColors": 1,
						"numRepeat": 1,
						"numSteps": 3
					},
					"2": {
						"numPics": 4,
						"numColors": 3,
						"numRepeat": 1,
						"numSteps": 2
					},
					"3": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 2,
						"numSteps": 2
					},
					"4": {
						"numPics": 6,
						"numColors": 1,
						"numRepeat": 2,
						"numSteps": 2
					},
					"5": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2,
						"numSteps": 2
					},
					"6": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 4,
						"numSteps": 2
					},
					"7": {
						"numPics": 2,
						"numColors": 4,
						"numRepeat": 3,
						"numSteps": 2
					}
				}
			},
			"gSet": {
				"contrast": 0.22,
				"colors": [
					"blue",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2,
						"numSteps": 2
					},
					"1": {
						"numPics": 4,
						"numColors": 1,
						"numRepeat": 4,
						"numSteps": 2
					},
					"2": {
						"numPics": 2,
						"numColors": 4,
						"numRepeat": 3,
						"numSteps": 2
					}
				}
			},
			"gElim": {
				"contrast": 0.22,
				"colors": [
					"blue",
					"violet",
					"lightgreen",
					"pink",
					"red",
					"yellow"
				],
				"levels": {
					"0": {
						"numPics": 3,
						"numColors": 3,
						"numRepeat": 1
					},
					"1": {
						"numPics": 3,
						"numColors": 1,
						"numRepeat": 3
					},
					"2": {
						"numPics": 2,
						"numColors": 2,
						"numRepeat": 2
					},
					"3": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 2
					},
					"4": {
						"numPics": 3,
						"numColors": 4,
						"numRepeat": 3
					}
				}
			},
			"gTouchColors": {
				"contrast": 0.32,
				"colors": [
					"red",
					"blue",
					"yellow",
					"green"
				],
				"levels": {
					"0": {
						"numPics": 2,
						"numColors": 2
					},
					"1": {
						"numPics": 3,
						"numColors": 3
					},
					"2": {
						"numPics": 4,
						"numColors": 3
					},
					"3": {
						"numPics": 4,
						"numColors": 4
					},
					"4": {
						"numPics": 5,
						"numColors": 4
					}
				}
			},
			"gPremem": {
				"trials": 1,
				"levels": {
					"0": {
						"numPics": 2,
						"numRepeat": 2
					},
					"1": {
						"numPics": 3,
						"numRepeat": 3
					},
					"2": {
						"numPics": 6,
						"numRepeat": 2
					},
					"3": {
						"numPics": 8,
						"numRepeat": 2
					},
					"4": {
						"numPics": 12,
						"numRepeat": 2
					},
					"5": {
						"numPics": 18,
						"numRepeat": 2
					}
				}
			},
			"gMem": {
				"levels": {
					"0": {
						"numPics": 2,
						"numRepeat": 1
					},
					"1": {
						"numPics": 4,
						"numRepeat": 1
					},
					"2": {
						"numPics": 9,
						"numRepeat": 1
					},
					"3": {
						"numPics": 2,
						"numRepeat": 1
					},
					"4": {
						"numPics": 4,
						"numRepeat": 1
					},
					"5": {
						"numPics": 4,
						"numRepeat": 1
					},
					"6": {
						"numPics": 6,
						"numRepeat": 1
					}
				}
			},
			"gSayPic": null,
			"gInno": {
				"levels": {
					"0": {
						"maxWordLength": 3
					},
					"1": {
						"maxWordLength": 4
					},
					"2": {
						"maxWordLength": 5
					},
					"3": {
						"maxWordLength": 6
					},
					"4": {
						"maxWordLength": 7
					},
					"5": {
						"maxWordLength": 8
					}
				}
			},
			"gWritePic": {
				"levels": {
					"0": {
						"maxWordLength": 4
					},
					"1": {
						"maxWordLength": 6
					},
					"2": {
						"maxWordLength": 8
					},
					"3": {
						"maxWordLength": 100
					}
				}
			},
			"gAnagram": {
				"levels": {
					"0": {
						"maxWordLength": 3
					},
					"1": {
						"maxWordLength": 4
					},
					"2": {
						"maxWordLength": 5
					},
					"3": {
						"maxWordLength": 6
					},
					"4": {
						"maxWordLength": 7
					},
					"5": {
						"maxWordLength": 8
					}
				}
			},
			"gAbacus": {
				"numMissing": 1,
				"minNum": 0,
				"maxNum": 10,
				"minFactor": 2,
				"maxFactor": 3,
				"posMissing": "end",
				"ops": [
					"plus",
					"minus",
					"mult"
				],
				"levels": {
					"0": {
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					},
					"1": {
						"maxNum": 10,
						"maxFactor": 4,
						"ops": [
							"mult"
						]
					},
					"2": {
						"maxNum": 9,
						"maxFactor": 9,
						"ops": [
							"mult"
						]
					},
					"3": {
						"maxNum": 99,
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					},
					"4": {
						"maxNum": 99,
						"ops": [
							"plus",
							"minus",
							"mult"
						]
					}
				}
			}
		}
	},
	"games": {
		"1": {
			"id": "1",
			"game": "aristocracy",
			"players": {
				"nil": {
					"hand": ["HQ", "HK", "S2"]
				},
				"mac": {
					"hand": ["CQ", "H4", "S3"]
				}
			},
			"data": {
				"market": ["SQ", "DK", "C2"]
			}
		}
	}
};
