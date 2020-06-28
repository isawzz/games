function transformParentsToBags(parents, R) {
	let parentPanels = [];
	for (const p of parents) {
		let nParent = R.uiNodes[p];
		let uidNewParent=p;
		// if parent has no child at all, make invisible container and use that for loc node
		if (isEmpty(nParent.children)) {
			console.log('parent', p, 'does NOT have any child!');

			//create an invisible node 
			let nPanel = addInvisiblePanel(p, R);
			uidNewParent = nPanel.uid;
			//also need to create uiNode for this panel!

			console.log(nParent);
			//parentPanels.push(nPanel.uid);
		}

		parentPanels.push(uidNewParent);
		//if this parent already has a child that is a container,
		//dann kann ich diesen container als echten parent nehmen

		//sonst mache einen container

		//was wenn parent genau 1 child hat aber das ist NICHT ein container?
		//dann mache ein weiteres child das ein container ist


	}
	console.log('parentPanels',parentPanels)
	return parentPanels;

}
function addInvisiblePanel(uidParent, R) {
	let uid = getUID();
	let n = { uid: uid, uidParent: uidParent, type: 'invisible' };
	R.rNodes[uid] = n;
	let rParent = R.rNodes[uidParent];
	if (nundef(rParent.children)) rParent.children = [];
	rParent.children.push(uid);
	recUi(n, uidParent, R);
	return n;
}

















