const OFFLINE = true;
const SERVERURL = OFFLINE ? 'http://localhost:3000/app/' : 'https://speech-games.herokuapp.com/app/';

const IS_TESTING = true; // *** only set this one! ***

DEFAULTUSERNAME = 'nil'; // IS_TESTING ? 'nil' : 'gul';

//**************************************************************** */
const BROADCAST_SETTINGS = true; //***********************************IS_TESTING; // ACHTUNG!!!!!!!!!!!!! true;

var USE_ADDONS = false;




var USE_LOCAL_STORAGE = !BROADCAST_SETTINGS; // true | false //localStorage is cleared when false!!!!!
const CLEAR_LOCAL_STORAGE = BROADCAST_SETTINGS;
var PROD_START = !IS_TESTING;

