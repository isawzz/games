

function Rgen(R,cycle) {

	if (cycle > 10) {console.log('MAX!!!!!!!!!');return;}


	let workingSpec = jsCopy(R.lastSpec);
	//console.log('workingSpec',workingSpec)

	RgenIdRef(R); //macht nur places und refs
	RgenArrays(R); //macht nur idarr,refarr, byNames und byNodes


	let name = RsortIds(workingSpec,R); // replaced 1 name!

	let genKey='G';
	R.gens[genKey].push(workingSpec);
	R.lastSpec = workingSpec;
	R.ROOT = R.lastSpec.ROOT;

	//console.log('all names:',R.allIdRefNames);
	if (name && !isEmpty(R.allIdRefNames)) Rgen(R,cycle+1);

}
