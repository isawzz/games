var currentGame = 'gTouchPic'; // gSayWord | gTouchPic
var currentLanguage = 'E';
const startingCategory = 'all'; //
const immediateStart = true; //fires onClickStartButton 
const levelColors = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990', '#dcbeff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000'];
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
