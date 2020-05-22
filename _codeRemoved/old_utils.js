//#region merging types, _id, _ref helpers
function check_id(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_id', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToPlaces(specKey, akku[k], k); }
	//console.log('places', this.places)
}
function check_ref(specKey, node, R) {
	let akku = {};
	recFindProp(node, '_ref', 'self', akku);
	//console.log(node.specKey, node, akku);
	for (const k in akku) { R.addToRefs(specKey, akku[k], k); }
	//console.log('places', this.places)
}
