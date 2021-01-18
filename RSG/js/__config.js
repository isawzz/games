
var Username = 'felix';
var GAME = 'ttt'; // catan | aristocracy | ttt | game01
var PLAYMODE = 'hotseat'; // multiplayer | hotseat | solo | passplay
var SEED = 1;

var DSPEC_PATH = '/assetsTEST/defaultSpec'; // defaultSpec | defaultSpecEmpty
var RSG_SOURCE = 'main'; // test | main | direct (muss auf main sein fuer _A, _B...)

// main: hier kann man einstellen welche assetsTEST (=main) er starten soll
var DIR_TESTS = '_A'; // _A/ _B/
var DIR_SERIES = '10card'; // b0 // 00 01 01_huge 01_NODElist 02 03 04 05hand 06 06catan 07card 08 09_speech
var TEST_SERIES = DIR_TESTS + '/' + DIR_SERIES;
var SERVERDATA_PATH = '/assetsTEST/' + TEST_SERIES + '/server'; // 00
var TEST_INDEX = 2;//2; //when != null, should override localStorage!

//test (andere art von test generierung)
var iTESTSERIES = 7;
var iTEST = null;//2; //when null, starts at last test of series!

// what rsg info should be shown:
var SHOW_SPEC = true; // true | false
var LEAVE_SPEC_OPEN = true; // true | false
var OUTPUT_EACH_SPEC_STEP = true; // true | false
var SHOW_LASTSPEC = false; // true | false
var SHOW_RTREE = true; // true | false
var SHOW_UITREE = true; // true | false
var SHOW_OIDNODES = false; // true | false
var SHOW_DICTIONARIES = false; // true | false
var SHOW_IDS_REFS = false; // true | false

// timer output, local storage use needed fuer remember last test case number!
const STOP_TESTS_ON_FAIL = true; // true | false

//which menus (top of page) should be opened at start:
var ACTIVATE_UI = true; // true | false
const OPEN_MAIN = true; // true | false
const OPEN_TEST = false; // true | false
const OPEN_OTHER = false; // true | false
const OPEN_INTERACT = false; // true | false

// ------------------ disregard from here -------------------------
var IS_START = true;
var SPEC = null; //merged userSpec and defaultSpec
var DEFS = null; //defaults (defaultSpec.defaults as separate dict)

var STOP = false;
var MAX_CYCLES = 500; //Recursion safety!
var CYCLES = 0;

//older way to specify file dirs before engine!
// var TEST_SERIES = DIR_TESTS + '01_huge'; // 00 01 01_huge 01_NODElist 02 03 04 05hand 06 06catan 07card 08
//var DSPEC_PATH = '/assetsTEST/'+ DIR_TESTS + 'defaultSpec'; // defaultSpec | defaultSpecEmpty
var TEST_DIR = '01mini'; // 01mini 02ttt 03catan 04extrem 05refs 06fe 07aristo
var SPEC_PATH = '/RSG/_data/' + TEST_DIR + '/_spec';
//var SERVERDATA_PATH = '/RSG/_data/' + TEST_DIR + '/server';

const TESTING = true; // true | false //uses files from tests, DOES NOT send routes to server, instead: server stub


//#region previous DATA files
// testGrid/ catanSpec catanServer tttSpec tttServer
// extrem
// var SPEC_PATH = '/DATA/testGrid/tttSpec'; // 03b testBinding/03 | testGrid/04
// var SERVERDATA_PATH = '/DATA/testGrid/tttServer'; // testBinding/d3 | testGrid/d4
// var SPEC_PATH = '/DATA/extrem/tttSpec'; // 03b testBinding/03 | testGrid/04
// var SERVERDATA_PATH = '/DATA/extrem/tttServer'; // testBinding/d3 | testGrid/d4

// // __hybrid | _hand1 | nRefs1Id | testCalcContentFromData/01
// var SPEC_PATH = '/DATA/testCalcContentFromData/03'; // __spec0 | __simple |  __spec0_noParams | __cardSuit | specttt | specCatan | specAristo
// //var SPEC_PATH = '/DATA/__spec0'; // __spec0 | __simple |  __spec0_noParams | __cardSuit | specttt | specCatan | specAristo
// var SERVERDATA_PATH = '/DATA/_server0'; // _server0 | __cardSuitData | serverttt_real | serverttt | serverCatan | serverAristo
//#endregion

const USE_MAX_PLAYER_NUM = false; // true | false

const CLEAR_BETWEEN_TESTS = true; // true | false
const SHOW_TRACE = true; // true | false

const VERBOSE = true; // true | false
const SHOW_CODE = false; // true | false
const SHOW_SERVERDATA = false; // true | false
const SHOW_DEFS = false; // true | false

// testing vars
var timit;
var t_total = 0;
var t_avg = 0;







const RUNTEST = false; // true | false //just runTest preprocess serverData, pageHeaderInit, and clear

//*** TESTING *** uses files in /tests/GAME/uspecN and codeN, NO caching of uspec, code, and data!
const CODE_VERSION = null;

//*** additional *** TESTING *** settings */
const USPEC_VERSION = '00';
const SERVERDATA_VERSION = 2; ///nur ttt!!!!!!!!!!!
const USE_NON_TESTING_DATA = false; //uses spec,code from /games instead of /zdata

const INCREMENTAL_UPDATE = true; // diff is run after preProcessing serverData!

//ONLY used when *** NOT testing: *** >>dazu muss flask server laufen!!!!
var VERSION = '_02'; //files sollen heissen [GAME]_01.yaml and [GAME]_01.js, und im richtigen dir sein!!
var CACHE_DEFAULTSPEC = false;
var CACHE_USERSPEC = false;
var CACHE_CODE = false;
const CACHE_INITDATA = false;
const USE_ALL_GAMES_ROUTE = false; // true | false //false means directly loading game infos from info.yaml


// important vars
var GAMEPLID = null; //game player id
var PGAMEPLID = null; //prev game player id

//settings that might change but unlikely:
//const INIT_CLEAR_LOCALSTORAGE = false; // true | false >>see above USE_LOCAL_STORAGE
const USER_SERVERDATA_STUB = false; // if true, need to jsCopy serverData to simulate new batch!
const USE_OLD_GRID_FUNCTIONS = false;// true | false
const STARTING_TAB_OPEN = 'bPlayers'; // bObjects | bPlayers | bSettings
//var OPEN_TAB = 'Seattle'; //S.settings.openTab = S_openTab; deprecated!

//mostly no need to change
var autoplayFunction = () => false;
var AIThinkingTime = 30;

var CLICK_TO_SELECT = true; //S.settings.clickToSelect = true;
var USE_SETTINGS = true; //S.settings.userSettings = S_userSettings;
var USE_STRUCTURES = true; //S.settings.userStructures = S_userStructures;
var USE_BEHAVIORS = true; //S.settings.userBehaviors = S_userBehaviors;

const USE_SOCKETIO = false;
const USE_BACKEND_AI = true;
const IS_MIRROR = false;
const FLASK = true;
const PORT = '5000';
const NGROK = null;// 'http://ee91c9fa.ngrok.io/'; // null;//'http://f3629de0.ngrok.io/'; //null; //'http://b29082d5.ngrok.io/' //null; //'http://2d97cdbd.ngrok.io/';// MUSS / am ende!!! 

//achtung!!! NO / at end!!!!!!!
const SERVER = IS_MIRROR ? 'http://localhost:5555' : FLASK ? (NGROK ? NGROK : 'http://localhost:' + PORT) : 'http://localhost:5005';
const PLAYER_CONFIG_FOR_MULTIPLAYER = ['me', 'human', 'human'];
const USERNAME_ORIG = Username;



