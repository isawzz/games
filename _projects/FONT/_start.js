window.onload = async () => { start(); }

async function start() {
	await loadAssets(); // load from symbolDict
	t1();

}
function t1(){
	let ui = mImg('/assets/BAUSTELLE/first.svg', table);
	let styles={w:100,h:100,bg:'blue',fg:'white'};
	mStyleX(ui,styles)
	//if (isdef(styles)) mStyleX(ui, styles);
}



