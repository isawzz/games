var table = mBy('table');
var sammelDict = {};
var UIS = {};
const problemKeys = ['person: white hair', 'fire-dash', 'horse', 'warehouse']
const listOther = ['student', 'astronaut', 'teacher', 'judge', 'farmer', 'cook', 'mechanic', 'factory worker', 'office worker', 'scientist', 'technologist', 'singer', 'artist', 'pilot', 'firefighter', 'family', 'volcano'];

const keysForAll = ['key', 'fz', 'w', 'h', 'type', 'hex', 'hexcode', 'text', 'family', 'isDuplicate', 'isColored'];
const keysForEmo = ['annotation', 'emoji', 'group', 'subgroups', 'E', 'D', 'E_valid_sound', 'D_valid_sound', 'path'];
const keysIgnore = ['skintone_base_emoji','skintone_base_hexcode','unicode','order','order2'];

window.onload = async () => { await loadAssets(); start(); }
async function start() {

	await sammelDictFromCsv();
	
	//test firstNumber
	//let x = firstNumber(0.6); //'ABDsssdf_-1');	console.log(x)
	//let x = isNumber(0.6)
	//console.log(x)
	
	//console.log(symbolKeys.length);
	//let mod = await correctSammelDict();//10);
	//console.log(mod);
}
async function sammelDictFromCsv(){
	// await loadAssets();
	symbolKeys.sort();
	sammelDict = {};
	let i=0;
	for (const k of symbolKeys) {
		i += 1; 
		let info = symbolDict[k];
		info.index = i;
		if (info.type != 'emo') { sammelDict[k] = jsCopy(info); continue; }
		let tags = [];
		sammelDict[k] = {};
		for (const k1 in info) {
			if (keysForAll.includes(k1) || keysForEmo.includes(k1)) { sammelDict[k][k1] = info[k1]; }
			else if (keysIgnore.includes(k1)) continue;
			else {
				let val = info[k1];
				if (isNumber(val) || !isString(val)) { continue; }
				val = val.trim();
				if (isEmpty(val)) { continue; }
				if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(val[0])) { continue; }
				if (firstNumber(val)) {  continue; }
				if (val.length == 1) {continue;}
				//if (k1=='openmoji_author' || k1 == 'openmoji_date') console.log('emoji:',val,val.length); //,val[0],info.emoji);
				//if (val[0] =='�') {console.log('==>das ist ein emoji!!!',val);}
				if (info[k1][0] == info.emoji[0]) {continue; }
				val=val.replace('"','');
				console.log('durchgekommen:',val,'('+k1+')');
				addIf(tags,val);
			}
		}
		sammelDict[k].tags = tags;
	}
	console.log('DONE!');

}
async function correctSammelDict(n) {
	sammelDict = await loadSammelDict();
	//console.log(sammelDict);
	let modifiedRecords = {};
	//makeSymYaml();
	//jetzt hab ich das sammelDict und kann fuer die emos corrections machen!!!
	symbolKeys = Object.keys(sammelDict);
	let MAX = isdef(n) ? n : symbolKeys.length;
	let i = -1;
	symbolKeys.sort();
	for (const k of symbolKeys) {
		i += 1; if (i >= MAX) break;
		let info = sammelDict[k];
		info.index = i;
		if (info.type != 'emo') { modifiedRecords[k] = jsCopy(info); continue; }
		let tags = [];
		//let tbdel = [];
		modifiedRecords[k] = {};
		for (const k1 in info) {
			//console.log(k1)
			if (keysForAll.includes(k1) || keysForEmo.includes(k1)) { modifiedRecords[k][k1] = info[k1]; }
			else {
				let val = info[k1];
				if (!isString(val)) { continue; }
				//console.log(val)
				val = val.trim();
				//console.log(val);
				if (isEmpty(val)) { continue; }
				if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(val[0])) { console.log(val); continue; }
				if (firstNumber(val)) {  continue; }
				console.log('durchgekommen:',val)
				tags.push(val);
			}
		}
		modifiedRecords[k].tags = tags;
		//tbdel.map(x => delete info[x])
		// if (!isEmpty(tags)) { console.log(k, tags); }
		//order ist sowieso mist, hau ich gleich raus
		//brauch eigentlich NUR die 
	}
	// if (MAX>0)
	console.log('DONE!');
	if (MAX == symbolKeys.length) {sammelDict = modifiedRecords; saveSammelDict();}
	return modifiedRecords;
}

async function loadSammelDict() {
	let url = '/assets/sammelDict2.yaml';
	let response = await route_path_yaml_dict(url); //TODO: depending on ext, treat other assts as well!
	return response;

}

function saveSammelDict() {
	//console.log(sammelDict)
	let y = jsonToYaml(sammelDict);

	downloadTextFile(y, 'sammelDict');
}
function berechnungen(info) {
	let elem = UIS[info.key];
	console.log(elem.getBoundingClientRect(elem));
	let b = elem.getBoundingClientRect(elem);
	info.fz = 100;
	info.w = Math.round(b.width);
	info.h = Math.round(b.height);
}
function recordInfo() {
	console.log('start recording...')
	for (const k in sammelDict) { berechnungen(sammelDict[k]); }
	saveSammelDict();

}
function makeSymYaml() {
	let list = symbolKeys;
	for (const k of list) {
		showAndSave(k);
	}
	setTimeout(recordInfo, 1000);
}
function showAndSave(key) {
	let info = picInfo(key);
	sammelDict[info.key] = info;
	var element = mDiv(table);
	let style = { display: 'inline', bg: 'yellow', fz: 100, padding: 0, margin: 0 };
	mStyleX(element, style);
	UIS[key] = element;
	// let decCode = hexStringToDecimal('f494'); //warehouse
	// let text = '&#' + decCode + ';';
	// let family = 'pictoFa';
	element.style.fontFamily = info.family;
	element.innerHTML = info.text;
}
