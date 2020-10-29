function mpGrid(keys,bgs,fg,textColor,texts){
	let g2Pics = [];

	//let styles = { w: 200, h: 200, margin: 20, bg: 'random', cursor: 'pointer', rounding: 16, padding: 10 };
	let stylesForLabelButton = { rounding: 10, margin: 4 };
	const picStyles = ['twitterText', 'twitterImage', 'openMojiText', 'openMojiImage', 'segoe', 'openMojiBlackText', 'segoeBlack'];
	let isText=true;let isOmoji=false;

	for (let i = 0; i < keys.length; i++) {
		console.log(keys[i]);
		let k=replaceAll(keys[i],' ','-');
		let info = symbolDict[k];
		
		let label = "level "+i; //info.key;

		let d1 = mpBadge(info, label,{w:72,h:72,bg:bgs[i],fgPic:fg,fgText:textColor}, null, table, stylesForLabelButton, 'frameOnHover', isText, isOmoji); 
		
		g2Pics.push({ key: info.key, info: info, div: d1, id: d1.id, index: i });
	}


}
