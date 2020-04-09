//nur data...string
class Info{
	constructor(data,params){
		this.data=jsCopy(data);
		this.params=jsCopy(params);
		this.ui=this.create(data,params);
	}
	create(data,params){
		let d=mLabel(data);

	}
}