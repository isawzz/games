function addonCreateScreen() {
	show(mBy('dAddons'));
	let bg = colorTrans('silver', .25);
	let dScreen = mScreen(mBy('dAddons'), { bg: bg, display: 'flex', layout: 'vcc' });
	let dContent = mDiv(dScreen, { display: 'flex', layout: 'vcs', fg: 'contrast', fz: 24, bg: 'silver', patop: 50, pabottom: 50, matop: -50, w: '100vw' });
	return [dScreen, dContent];
}














