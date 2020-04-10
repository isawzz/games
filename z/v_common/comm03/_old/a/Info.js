//nur data...string
//interface: input o,params
class Info {
	constructor(node) { this.node = jsCopy(node); }
	attachTo(node) { }
	createUI(data, params) { let d = this.ui = mNode(data); return d; }
}