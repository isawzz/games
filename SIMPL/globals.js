const IS_TESTING = true; // false | true
USE_LOCAL_STORAGE = true; // false | true
const immediateStart = true;  // false | true
var skipLevelAnimation = IS_TESTING; // false | true

//set this to start!
var currentGame = 'sequence'; // gTouchPic | gWritePic | gMissingLetter | gSayPic | 'sequence'
var currentUser = 'Gunter';
var currentLanguage = 'E';
var currentCategories = ['nosymbols'];
var startAtLevel = IS_TESTING?
 { gTouchPic: 1, gTouchColors: 0, gWritePic: 10, gMissingLetter: 0, gSayPic: 10 }
 : { gTouchPic: 1, gTouchColors: 0, gWritePic: 0, gMissingLetter: 0, gSayPic: 0 };
// var gameSequence = ['gTouchPic', 'gWritePic', 'gMissingLetter', 'gSayPic'];
var gameSequence = ['gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter'];//, 'gSayPic'];

var currentLevel;
var currentKeys; //see setKeys, reset at each level!!!!!

//common for all games and users
var PICS_PER_LEVEL = IS_TESTING ? 1 : 5;
var SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);// [1, 1, 2, 2, 80, 100];
var MAXLEVEL = 10;
var DELAY = 1000;
var fleetingMessageTimeout;


//to be set by each game on level change:
var MaxNumTrials = 1;
var MinWordLength = 1;
var MaxWordLength;
var NumPics;
var NumLabels;

//vars for round to round:
var Pictures = [];
var Goal, Selected;

var numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;
var levelHistory;

var iGROUP = -1;
var lastPosition = 0;
var trialNumber;
var boundary;

//ui state flags
const uiHaltedMask = 1 << 0; //eg. when entering settings
const beforeActivationMask = 1 << 1;
const hasClickedMask = 1 << 2;
var uiPausedStack = [];
var uiPaused = 0;

const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED,
	GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue',
	'deeppink', TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE,
	// '#911eb4', '#42d4f4', '#f032e6',	'#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#aaffc3', 
	'#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'deeppink',
	'palegreen', '#e6194B'];
//['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];
let levelKeys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
	'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
	'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];

//sidebar
var dLeiste;

//table
var dLineTopOuter, dLineTop, dLineTopLeft, dLineTopRight, dLineTopMiddle;
var dLineTitleOuter, dLineTitle, dLineTitleLeft, dLineTitleRight, dLineTitleMiddle;
var dLineTableOuter, dLineTable, dLineTableLeft, dLineTableRight, dLineTableMiddle;
var dLineBottomOuter, dLineBottom, dLineBottomLeft, dLineBottomRight, dLineBottomMiddle;
var dHint, dFeedback, dInstruction, dScore, dLevel;
var inputBox;
var defaultFocusElement;
var dTable, dTitle;

//settings
var dSettings = mBy('dSettings');

//speaker
var synth, inputForm, inputTxt, voiceSelect, pitch, pitchValue, rate, rateValue, voices, utterance;

//recog: see recog.js

//feedback
var score, hintWord, bestWord, answerCorrect, currentInfo;

//testing
var timit;

//to be phased out
// const STATES = {
// 	STARTING: -1, GAME_INITIALIZED: -2, ROUND_INITIALIZED: -3, NONE: 0,
// 	BOUNDARY: 1, GROUPCHANGE: 2, LEVELCHANGE: 3, GAMEOVER: 4, CORRECT: 5, INCORRECT: 6, NEXTTRIAL: 7
// };
// var GameState;
var LevelChange;
const STATES = { CORRECT: 5, INCORRECT: 6, NEXTTRIAL: 7 };
var AnswerCorrectness;
//var GameStage;


