function picDraw(info, dParent, styles, classes) {
	if (info.type == 'icon' || info.type == 'emotext') {
		console.log('text', info.text);

		let res = mPicX(info, dParent, styles, classes);
		//von styles kann einige wegnehmen!
		if (isdef(styles)) {
			let addStyles = {};
			for (const k in styles) {
				if (['bg', 'fg', 'rounding', 'w', 'h', 'padding', 'border'].includes(k)) continue;
				addStyles[k] = styles[k];
			}
			//mStyleX(res, addStyles);
		}
		console.log('res', res);
		info.ui = res;
		return info;
	} else {
		let d = mDiv(dParent);
		mClass(d, 'picOuter')
		let ui = mSvg(info.path, d); //, { w: 200, h: 200 });
		console.log('d', d);
		info.ui = d;
		return info;
	}

}

function fitText(text,rect,dParent,styles,classes){

	//zuerst mach ein div
	let l=rect.cx-(rect.w/2);
	let t=rect.cy-(rect.h/2);
	let d = mDivPosAbs(l,t,dParent);

	//versuch es so: limit only width of div und dann measure text
	//measure height

	//danach mach den font immer kleiner kleiner kleiner
	//bis er passt

	d.style.maxWidth = rect.w+'px';

	let fz=20;
	let family='arial';
	let weight='normal';
	d.style.fontSize =fz; 
	d.style.fontFamily = family;
	d.style.fontWeight = 900;
	let size = getTextSizeX(text, fz, family, weight = 900, d,{});
	console.log('size',size);

	let b=getBounds(d);
	console.log('bounds',b)

	let h=getBounds(d).height;
	console.log(h,rect.h)

	//mSize(d,rect.w,rect.h);
	mColor(d,'red');


	d.innerHTML = text;

	mStyleX(d,styles);

}
function test7(){
	let table = mBy('table');
	let rect = {w:200,h:100,cx:120,cy:100};
	let text = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';
	let longtext = 'hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren! hallo das ist ein total bloeder text aber genau lang genug um das auszuprobieren!';

	fitText(longtext,rect,table,{padding:5,'box-sizing':'border-box'});


}






