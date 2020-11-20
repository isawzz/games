const IS_TESTING = false; // false | true

//common for all games and users / control flow
const EXPERIMENTAL = IS_TESTING; 
const CLEAR_LOCAL_STORAGE = false;
const immediateStart = true;  // false | true
const SHOW_FREEZER = false; // !IS_TESTING;

var MASTER_VOLUME = 1;
var loopGameSequence = true;
var StepByStepMode = false; //wartet auf click next um wieder zu starten!
var skipAnimations = IS_TESTING; // false | true
var skipAniGameOver = true; //IS_TESTING;
var skipBadgeAnimation = true;
USE_LOCAL_STORAGE = true; // false | true
var MAXLEVEL = 10;

// delays
var DELAY = 1000;
var ROUND_DELAY = 500;
var DELAY_BETWEEN_MIKE_AND_SPEECH = 2000;
var fleetingMessageTimeout;

// output showing
var RecogOutput = true;
var RecogHighPriorityOutput = true;
var SpeakerOutput = false;
var ROUND_OUTPUT = true;

var ProgTimeout; //to cancel timer!
var ProgTimeIsUp; // = false; flag for program timer
var Settings;
var MaxNumTrials = 1;
var MinWordLength = 1;
var MaxWordLength = 100;
var NumPics;
var NumLabels;
var Pictures = [];
var Goal, Selected;
var NextPictureIndex = 0;

var currentUser;
var currentGame;
var currentLevel;
var currentLanguage;
var currentCategories;
var currentKeys; //see setKeys_, reset at each level!!!!!

//defaults hardcoded
var startAtLevel = IS_TESTING ? { gSayPicAuto: 10, gTouchPic: 10, gTouchColors: 10, gWritePic: 10, gMissingLetter: 10, gSayPic: 10 } : { gMissingLetter: 10, gTouchPic: 10, gTouchColors: 10, gWritePic: 10, gSayPic: 10 };

var MicrophoneUi; //this is the ui



// var GameSelectionMode = 'program'; // indiv | program | training
//var SAMPLES_PER_LEVEL_ = new Array(20).fill(SettingspicsPerLevel);// [1, 1, 2, 2, 80, 100];

// GameSelectionMode = indiv
// gTouchPic | gTouchColors | gWritePic | gMissingLetter | gSayPic | 'sequence'
// var currentGame = IS_TESTING ? 'gTouchPic' : 'gTouchPic';
// var currentLevel = 10;
// var currentUser = 'Gunter';
// var currentLanguage_ = 'E';
// var currentCategories_ = ['nosymbols']; //['kitchen'];
//var minutesPerUnit = IS_TESTING ? .5 : 0;
// var picsPerLevel_ = IS_TESTING ? 1 : 1;



//to be set by each game on level change:


//speech recognition
var OnMicrophoneReady, OnMicrophoneGotResult, OnMicrophoneProblem;

//vars for round to round:

//score
var scoringMode, DefaultScoringMode = 'n'; // n | inc | percent | mixed | autograde
var minIncrement = 1, maxIncrement = 5, levelDonePoints = 5;
var numCorrectAnswers, numTotalAnswers, percentageCorrect;
var levelIncrement, levelPoints;
var CurrentSessionData, CurrentGameData, CurrentLevelData;
var SessionScore = 0;
var LevelChange = true;
//const STATES = { CORRECT: 5, INCORRECT: 6, NEXTTRIAL: 7 };
var IsAnswerCorrect;

var lastPosition = 0;
var trialNumber;
var boundary;
var isSpeakerRunning, GlobalSTOP;//,SpeakerCallback;

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



//deprecated: brauch ich doch noch 
// 	var gameSequence = IS_TESTING ? ['gSayPicAuto', 'gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter', 'gSayPic']
// 	: ['gTouchPic', 'gMissingLetter', 'gSayPic', 'gTouchColors', 'gWritePic'];
// // : ['gSayPic', 'gTouchColors', 'gWritePic'];
// // : ['gSayPic', 'gTouchColors', 'gWritePic'];//'gMissingLetter','gTouchPic', 
// var startingLevel = new Array(100).fill(10);

//RESERVED FOR PROGRAM! GameSelectionMode = program
// var HCGameSeq = [
// 	{ game: 'gTouchColors', startLevel: 8, cl: 10 },
// 	{ game: 'gMissingLetter', startLevel: 6, cl: 10 },
// 	{ game: 'gTouchPic', startLevel: 9, cl: 10 },
// 	{ game: 'gWritePic', startLevel: 9, cl: 10 }];
// //var Settings.program.currentGameIndex;
// var gameSequence = HCGameSeq;
//var Settings.program.currentLevel_ = 0;
