class Activator {
	constructor(n, ui, R) {
		this.n = n; //a uiNode
		this.ui = isdef(n.uiActive) ? n.uiActive : ui;
		this.uid = n.uid;
		this.R = R;
		// this.hoverActive = ACTIVATE_UI; //false;
		// this.clickActive = ACTIVATE_UI; //false;
		this.hoverActive = false;
		this.clickActive = false;
		//console.log('ACTIVATOR NEW!!!',n)
	}
	activate(fEnter, fLeave, fClick) { this.activateHover(fEnter, fLeave); this.activateClick(fClick); }
	activateHover(fEnter, fLeave) {
		if (this.hoverActive) return;
		this.hoverActive = true;
		this.ui.onmouseenter = (ev) => {ev.stopPropagation();fEnter(this.uid, this.R);}
		this.ui.onmouseleave = (ev) =>  {ev.stopPropagation();fLeave(this.uid, this.R);}
	}
	activateClick(fClick) {
		if (this.clickActive) return;
		this.clickActive = true;
		this.ui.onclick = (ev) => {ev.stopPropagation();fClick(this.uid, this.R);}
	}
	deactivate() {
		if (!this.hoverActive && !this.clickActive) return;
		this.deactivateHover();
		this.deactivateClick();
	}
	deactivateHover() {
		if (!this.hoverActive) return;
		this.hoverActive = false;

		removeEvents(this.ui, 'mouseenter', 'mouseleave');
	}
	deactivateClick() {
		if (!this.clickActive) return;
		this.clickActive = false;

		removeEvents(this.ui, 'click');
	}
}

function activateUis(R) {
	//console.log('activating uis!!!')
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (isdef(n.oid) && isdef(n.ui)) {
			n.act.activate(highSelfAndRelatives, unhighSelfAndRelatives, selectUid);
		}
	}
	R.isUiActive = true;
}
function deactivateUis(R) {
	//console.log('deactivating uis!!!')
	for (const uid in R.uiNodes) {
		let n = R.uiNodes[uid];
		if (n.oid && n.ui) {
			//console.log(n);
			n.act.deactivate();
		}
	}
	R.isUiActive = false;
}
function highSelfAndRelatives(uid, R) {
	for (const oid of R.uid2oids[uid]) {
		for (const uid1 of R.oid2uids[oid]) {
			//console.log('high',uid1)
			//console.log('activate','uid',uid,'oid',oid);
			//if (oid == '145') continue;
			let ui = R.getUI(uid1);
			mHigh(ui);
		}
	}
	//also if this uid is an object overlapped by other objects, bringToFront
	let n = R.uiNodes[uid];
	if (n.potentialOverlap) {
		let ui = R.getUI(uid);
		bringToFront(ui);
	}
}
function unhighSelfAndRelatives(uid, R) {
	for (const oid of R.uid2oids[uid]) {
		for (const uid1 of R.oid2uids[oid]) {
			let ui = R.getUI(uid1);
			mUnhigh(ui);
		}
	}
	let n = R.uiNodes[uid];
	if (n.potentialOverlap) {
		let ui = R.getUI(uid);
		sendToBack(ui);
	}
}
function selectUid(uid, R) {
	console.log('user has selected', uid);
}












