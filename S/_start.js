window.onload = SPEECHStart;

async function SPEECHStart() {
	await loadAssets();
	ensureSymBySet();
	makeHigherOrderGroups();
	initTable();
	setGroup(startingCategory);
	if (immediateStart) onClickStartButton();
}


function getSizeWithStylesX(text, styles, wmax, hmax) {
	var d = document.createElement("div");
	document.body.appendChild(d);
	//console.log(styles);
	let cStyles = jsCopy(styles);
	cStyles.position = 'fixed';
	cStyles.opacity = 0;
	cStyles.top = '-9999px';
	if (isdef(wmax)) cStyles.width=wmax;
	if (isdef(hmax)) cStyles.height=wmax;
	//if (isdef(wMax)) d.maxWidth=wMax;
	mStyleX(d, cStyles);
	d.innerHTML = text;
	height = d.clientHeight;
	width = d.clientWidth;
	let x=getBounds(d)
	//console.log('==>',x.width,x.height);
	d.parentNode.removeChild(d);
	let res = { w: x.width, h: x.height };
	//console.log(res)
	return res;
}











