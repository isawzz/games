const IS_TESTING = true; // false | true
USE_LOCAL_STORAGE = false; // false | true
const immediateStart = true;  // false | true
var skipAnimations = IS_TESTING; // false | true

//set this to start!
// gTouchPic | gTouchColors | gWritePic | gMissingLetter | gSayPic | 'sequence'
var currentGame = IS_TESTING ? 'gSayPic' : 'sequence';
var currentUser = 'Gunter';
var currentLanguage = 'E';
var currentCategories = ['nosymbols'];
var startAtLevel = IS_TESTING ? { gTouchPic: 0, gTouchColors: 6, gWritePic: 10, gMissingLetter: 10, gSayPic: 3 }
	: { gTouchPic: 1, gTouchColors: 0, gWritePic: 10, gMissingLetter: 0, gSayPic: 0 };
// var gameSequence = ['gTouchPic', 'gWritePic', 'gMissingLetter', 'gSayPic'];
var gameSequence = ['gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter', 'gSayPic'];

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

//score
var scoringMode = 'inc'; // inc | percent | mixed
var minIncrement = 1, maxIncrement = 5, levelDonePoints = 5;
var numCorrectAnswers, numTotalAnswers, percentageCorrect;
var levelIncrement, levelPoints;
var CurrentSessionData,  CurrentGameData, CurrentLevelData;
var SessionScore=0;
var LevelChange=true;
const STATES = { CORRECT: 5, INCORRECT: 6, NEXTTRIAL: 7 };
var AnswerCorrectness;

var iGROUP = -1;
var lastPosition = 0;
var trialNumber;
var boundary;
var isSpeakerRunning,isINTERRUPT;//,SpeakerCallback;

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



