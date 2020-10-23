var currentGame = 'gTouchPic'; // gSayWord | gTouchPic
var currentLanguage = 'E';
const startingCategory = 'all'; //
const immediateStart = true; //fires onClickStartButton 
var level = 0;
var numCorrectAnswers = 0, numTotalAnswers = 0, percentageCorrect = 100;

//table
var dLine1Outer, dLine1, dLine1Left, dLine1Right, dLine1Middle;
var dLineTopOuter, dLineTop, dLineTopLeft, dLineTopRight, dLineTopMiddle;
var dLineMidOuter, dLineMid, dLineMidLeft, dLineMidRight, dLineMidMiddle;
var dLineBottomOuter, dLineBottom, dLineBottomLeft, dLineBottomRight, dLineBottomMiddle;
var dHint, dFeedback, dInstruction, dScore, dLevel;

//speaker
var synth, inputForm, inputTxt, voiceSelect, pitch, pitchValue, rate, rateValue, voices, utterance;

//feedback
var score, hintWord, bestWord, answerCorrect, currentInfo;


var timit;
var RESTARTING;
var emoGroup, emoGroupKeys;
