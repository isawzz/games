window.onload = DOCStart;

async function DOCStart() {

	testFetchCsvAsTextAndSearch(); return;
	testFetchIndexHtmlAsTextAndSearch(); return;
	//testDirList();return;
	//let x=isAlphaNum('_rParse');console.log(x);return;
	// let vault = await documentVault(['/CODE/js/_rParse.js']);
	// console.log(vault); return;
	//testRegexSplit(); return;
	//testIconViewer(); return;
	//testMultiline(); return;
	//testIndenting();return;
	await loadAssets();

	createDocs();
}













