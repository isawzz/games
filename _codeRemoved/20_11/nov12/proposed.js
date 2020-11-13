// #region proposed
function maPicLabelSimple(info, label, dTable, w, h, fg, bgPic, id, onClickPictureHandler, isLabelVisible) {
	let stylesForLabelButton = { rounding: 10, margin: 24 };
	let { isText, isOmoji } = getParamsForMaPicStyle('twitterText');
	let d1 = maPicLabelButtonFitText(info, label, { w: w, h: h, shade: fg, bgPic:bgPic }, onClickPictureHandler, dTable, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
	d1.id = id;
	if (!isLabelVisible) maHideLabel(id, info);
	let result = { key: info.key, info: info, div: d1, id: id, label: label, isLabelVisible: isLabelVisible };
	return result;
}
function showPicturesSimple(bestWordIsShortest=false,onClickPictureHandler, colored=false){
	Pictures = [];
	let keys = choose(currentKeys, NumPics);
	let indices = nRandomNumbers(NumPics, 0, NumPics-1);

	for (let i = 0; i < keys.length; i++) {
		let info = getRandomSetItem(currentLanguage, keys[i]);
		let id = 'pic' + i;
		let label = selectWord(info,bestWordIsShortest);
		let shade,bgPic;
		if (colored){shade = choose(['red','green','gold','blue']);bgPic='white';}
		else{shade=undefined;bgPic='random';}

		let pic = maPicLabelSimple(info, label, dTable, 200, 200, shade, bgPic, id, onClickPictureHandler, indices.includes(i));
		Pictures.push(pic);
		console.log(info.key, info)
	}
}


