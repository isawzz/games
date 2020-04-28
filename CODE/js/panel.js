function createPanel(n,area,R){
	createUi(n,area,R);

	let m=mTextDiv(n.mark,n.ui);mFont(m,8);
	let children=makePanelChildren(n,R);
		//for(const)	
}

function makePanelChildren(n,R){
	let plist=n.panels;
	if (nundef(plist)) return [];
	if (!isList(plist)) {
		//make list out of children w/o considering pool/oids yet!
		//if this is a _ref, use existing node in oidNodes, do NOT create new node!
	}
	let chlist=[];
	for(const p1 of plist){
		//now consider pool/oid
		//case 0: neither parent nor child have pool or oid
		//make a static node
		//if a plist corresponds to more than 1 node (taking oid into acct)
		//implicitly a panel is created for those
		//this panel will be marked 'i' n.mark is list of marks for each node!
		// if ()
		//  'static';

		// R.oidNodes = 
	}
	return chlist;
}