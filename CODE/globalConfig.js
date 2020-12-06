var USERNAME;

//feature sets:
var Settings, DefaultSettings, UserHistory, SettingsChanged;

var DB, G;

var Speech;

var TaskChain, CancelChain, ChainTimeout, BlockChain; //chains are NOT reentrant!

var Pictures, Goal, Selected;


//#region unused as of HA
const TIMIT_SHOW = false; // true | false

//#region unused as of S
var SIGI;
var UIS = {};


