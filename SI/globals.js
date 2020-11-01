var currentGame = 'gTouchPic'; // gWritePic | gTouchPic | gSayWord
var currentLanguage = 'E';
const WORD_GROUPS = ['nosymbols'];
var MAX_WORD_LENGTH = [3,4,5,7,10,111];
const PICS_PER_LEVEL = 10;
USE_LOCAL_STORAGE = false;

const immediateStart = true; //has to be true for now!!! fires onClickStartButton 

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

var level = 0;
var numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;
let badges=[];

//sidebar
var dLeiste;

//table
var dLine1Outer, dLine1, dLine1Left, dLine1Right, dLine1Middle;
var dLineTopOuter, dLineTop, dLineTopLeft, dLineTopRight, dLineTopMiddle;
var dLineMidOuter, dLineMid, dLineMidLeft, dLineMidRight, dLineMidMiddle;
var dLineBottomOuter, dLineBottom, dLineBottomLeft, dLineBottomRight, dLineBottomMiddle;
var dHint, dFeedback, dInstruction, dScore, dLevel;
var dInput, inputBox;
var defaultFocusElement;

//speaker
var synth, inputForm, inputTxt, voiceSelect, pitch, pitchValue, rate, rateValue, voices, utterance;

//feedback
var score, hintWord, bestWord, answerCorrect, currentInfo;


var timit;
var RESTARTING;
