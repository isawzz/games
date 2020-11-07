function showBadges_dep(dParent, level, bgs) {
	clearElement(dParent);
	// let picLabelStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', true);
	//let picLabelStyles = getHarmoniousStylesPlus({ rounding: 10, margin: 24 }, {}, {}, 60, 60, 0, 'arial', 'random', 'transparent', true);
	//let picStyles = getHarmoniousStylesXX(100, 100, 10, 'arial', 'random', 'random', false);
	// ensureSymByType();
	let keys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate',
		'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
		'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];
	let fg = '#00000080';
	let textColor = 'white';
	let texts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	let achieved = [];
	for (let i = 0; i < level; i++) { achieved.push(keys[i]); }
	badges = mpLineup(dParent, achieved, bgs, fg, textColor, texts);
	// let dGrid = mDiv(table);
	// let elems = [];
	// let isText = true;
	// let isOmoji = false;

	// for (let i=0;i<keys.length;i++) {
	// 	let k=keys[i];
	// 	let bg=bgs[i];

	// 	let info = symbolDict[k];
	// 	let el = maPicLabel(info, dGrid, picLabelStyles[0], picLabelStyles[1], picLabelStyles[2], isText, isOmoji)
	// 	elems.push(el);
	// }

	// let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	// let size = layoutGrid(elems, dGrid, gridStyles, { rows:10, isInline: true });

}

function showPictures(bestWordIsShortest = false, onClickPictureHandler, colored=false) {
	//console.log('dassssssssssssssssssssssssssssssssssssssssssssssssssssssss')
	Pictures = [];
	let keys = choose(currentKeys, NumPics);
	//keys[0]='face with hand over mouth';
	//keys=['egg']
	//keys=['oil drum'];//,'door']

	let stylesForLabelButton = { rounding: 10, margin: 24 };
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem(currentLanguage, keys[i]);
		let id = 'pic' + i;
		//console.log(bestWordIsShortest)
		let label = selectWord(info,bestWordIsShortest);
		console.log('______',info.key, info);
		let shade,bgPic;
		if (colored){shade = choose(['red','green','gold','blue']);bgPic='white';}
		else{shade=undefined;bgPic='random';}
		let d1 = maPicLabelButtonFitText(info, label, { w: 200, h: 200, shade:shade, bgPic:bgPic }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		d1.id = id;

		//if (currentLevel > SHOW_LABEL_UP_TO_LEVEL) maHideLabel(id, info);
		Pictures.push({ key: info.key, info: info, div: d1, id: id, index: i, label:label, isLabelVisible: true});
	}
	//randomly pic NumLabels pics and hide their label!
	if (NumLabels==NumPics) return;

	let remlabelPic = choose(Pictures,NumPics-NumLabels);

	for(const p of remlabelPic) {maHideLabel(p.id,p.info);p.isLabelVisible=false;}
}














