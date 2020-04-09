class mPanel{
	constructor(node){}

	do(node,func){
		if (isList(node.panel)){
			node.panels = node.panels.map(x => func(x));
		}
	}























	//#region unused!!!
	merge(node){}
	expand(node){}
	visualize(){}
	


}