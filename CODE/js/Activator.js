class Activator{
	constructor(n,ui,R){
		//console.log(n)
		this.n=n; //a uiNode
		this.ui=isdef(n.uiActive)?n.uiActive:ui;
		//console.log(this.ui)
		this.uid=n.uid;
		this.R=R;


	}
	activateHover(fEnter,fLeave){
		//add mouseenter,mouseleave event handlers to ui
		//console.log('activateHover','ui',this.ui)
		//console.log('activating',this.n);
		//this.ui.addEventListener('mouseenter',()=>highSelfAndRelatives(this.uid));
		this.ui.onmouseenter=()=>fEnter(this.uid,this.R);
		this.ui.onmouseleave=()=>fLeave(this.uid,this.R);
		//this.ui.addEventListener('mouseleave',()=>unhighSelfAndRelatives(this.uid));
		//console.log(this.ui.onmouseenter)
	}
	deactivateHover(){
		removeEvents(this.ui);
		//remove all mouseenter,mouseleave event handlers from ui
	}
}

function activateUis(R){
	for(const uid in R.uiNodes){
		let n = R.uiNodes[uid];
		
		if (n.oid && n.ui) {
			n.act.activateHover(highSelfAndRelatives,unhighSelfAndRelatives);
		}
	}
}
function highSelfAndRelatives(uid,R) {
	//console.log('haaaaaaaaaaaaaaaaaaaaa',R.uid2oids[uid],R.oid2uids[R.uid2oids[uid][0]])
	for (const oid of R.uid2oids[uid]) {
		//console.log(oid)
		for (const uid1 of R.oid2uids[oid]) {

			//console.log(uid1)
			let ui = R.getUI(uid1);
			//console.log(ui);
			//mStyle(ui,{'background-color':'yellow'})
			mHigh(ui);
		}
	}
}
function unhighSelfAndRelatives(uid,R) {
	//console.log('lo')
	for (const oid of R.uid2oids[uid]) {
		//console.log(oid)
		for (const uid1 of R.oid2uids[oid]) {

			//console.log(uid1)
			let ui = R.getUI(uid1);
			//console.log(ui);
			//mStyle(ui,{'background-color':'yellow'})
			mUnhigh(ui);
		}
	}
}












