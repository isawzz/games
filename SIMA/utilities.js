
async function broadcastSettings(isCurrent = true, isDefault = true) {
	//load settings from settings.yaml or settingsTEST.yaml
	let fname = SETTINGS_KEY;
	let settings = await loadYamlDict('./settings/' + fname + '.yaml');
	let users = await loadYamlDict('./settings/users.yaml');

	//das war jetzt regular or TEST

	//soll ich zu defaults or current or both broadcasten?
	if (isCurrent) Settings = settings;
	if (isDefault) DefaultSettings = jsCopy(settings);

	saveServerData();

}
function ensureMinVocab(n, totalNeeded) {
	switch (n) {
		case 25: if (totalNeeded >= 20) return 50; break;
		case 50: if (totalNeeded >= 35) return 75; break;
		case 75: if (totalNeeded >= 50) return 100; break;
	}
	if (isNumber(n)) return n;


	//hier geh jetzt auf die categories

}

function aniFadeInOut(elem, secs) {
	mClass(elem, 'transopaOn');
	//dLineBottomMiddle.opacity=0;
	//mClass(dLineBottomMiddle,'aniFadeInOut');
	setTimeout(() => { mRemoveClass(elem, 'transopaOn'); mClass(elem, 'transopaOff'); }, secs * 1000);
}
function luminance(r, g, b) {
	var a = [r, g, b].map(function (v) {
		v /= 255;
		return v <= 0.03928
			? v / 12.92
			: Math.pow((v + 0.055) / 1.055, 2.4);
	});
	return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
	// usage:
	// contrast([255, 255, 255], [255, 255, 0]); // 1.074 for yellow
	// contrast([255, 255, 255], [0, 0, 255]); // 8.592 for blue
	// minimal recommended contrast ratio is 4.5, or 3 for larger font-sizes
	var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05)
		/ (darkest + 0.05);
}

function saveStats() {
	let g = lastCond(CurrentSessionData.games, x => x.name == 'gSayPicAuto');
	let xxx = arrLast(g.levels).items;
	let yyy = xxx.map(x => {
		let res = { key: x.goal.key };
		res[currentLanguage] = { answer: x.goal.answer, req: x.goal.reqAnswer, conf: x.goal.confidence, isCorrect: x.isCorrect };
		return res;
	});
	downloadAsYaml({ data: yyy }, currentLanguage + '_' + currentCategories[0] + '_data');

}




















