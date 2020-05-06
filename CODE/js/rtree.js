function ensureRtree(R) {
	if (nundef(R.tree) || isEmpty(R.tree)) {
		//console.log('____________ creating new tree!!!!!!!!!!!!!!!!!')
		R.LocToUid = {}; //locations
		R.NodesByUid = {}; // rtree
		R.treeNodesByOidAndKey = {}; //andere sicht of rtree
		R.tree = recBuildRTree(R.lastSpec.ROOT,'ROOT', '.', null, R.lastSpec, R);
		R.NodesByUid[R.tree.uid] = R.tree;

	} else {
		console.log('(tree present!)');

	}
}
