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














