const IS_TESTING = true; // false | true
USE_LOCAL_STORAGE = true; // false | true

// gTouchPic | gTouchColors | gWritePic | gMissingLetter | gSayPic | 'sequence'
var currentGame = IS_TESTING ? 'gTouchPic' : 'sequence';
var currentUser = 'Gunter';
var currentLanguage = 'E';
var currentCategories = ['nosymbols'];
var startAtLevel = IS_TESTING ? { gSayPicAuto: 10, gTouchPic: 3, gTouchColors: 6, gWritePic: 10, gMissingLetter: 10, gSayPic: 0 }
	: { gMissingLetter: 3, gTouchPic: 7, gTouchColors: 8, gWritePic: 10, gSayPic: 0 };
var gameSequence = IS_TESTING ? ['gSayPicAuto', 'gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter', 'gSayPic']
	: ['gSayPic', 'gTouchColors', 'gWritePic'];//'gMissingLetter','gTouchPic', 
var currentLevel;
var currentKeys; //see setKeys, reset at each level!!!!!

//speech recognition
var MicrophoneUi; //this is the ui
var OnMicrophoneReady, OnMicrophoneGotResult, OnMicrophoneProblem;

//control flow
const immediateStart = true;  // false | true
var skipAnimations = IS_TESTING; // false | true
var skipBadgeAnimation = true;
var StepByStepMode = false; //wartet auf click next um wieder zu starten!

// delays
var DELAY = 1000;
var ROUND_DELAY = 500;
var DELAY_BETWEEN_MIKE_AND_SPEECH = 2000;

// output showing
var RecogOutput = false;
var RecogHighPriorityOutput = true;
var SpeakerOutput = false;
var ROUND_OUTPUT = true;

//common for all games and users
var PICS_PER_LEVEL = IS_TESTING ? 1 : 3;
var SAMPLES_PER_LEVEL = new Array(20).fill(PICS_PER_LEVEL);// [1, 1, 2, 2, 80, 100];
var MAXLEVEL = 10;
var fleetingMessageTimeout;

//to be set by each game on level change:
var MaxNumTrials = 1;
var MinWordLength = 1;
var MaxWordLength = 100;
var NumPics;
var NumLabels;

//vars for round to round:
var Pictures = [];
var Goal, Selected;
var NextPictureIndex = 0;

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
var isSpeakerRunning, isINTERRUPT;//,SpeakerCallback;

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



