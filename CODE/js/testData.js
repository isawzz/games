//manual00 tests
function contentNoRootContent(x, R) {
	if (x.uid == R.tree.uid) return null; else return x.uid;
}
function contentNoParentContent(x, R) {
	if (nundef(x.children)) return x.uid; else return null;
}
function contentRootExtralong(x, R) {
	if (x.uid == R.tree.uid) return 'hallo das ist ein besonders langer string!!!';
	else return x.uid;
}
function contentNoParentContentRootExtralong(x, R) {
	if (nundef(x.children)) return x.uid;
	else if (x.uid == R.tree.uid) return 'hallo das ist ein super super super langer string let it go - unclutch!';
	else return null;
}
function contentHallo(n, r) { return isdef(n.children) ? null : n.uid == '_2' ? 'HALLO' : 'WELT'; }

function typeEmpty(n, R) { return 'empty'; }
function type00flex(n, R) { return 'type00flex'; }
function typePanelInfo(n, R) { return isdef(n.children) ? 'panel' : 'info'; }

const ALLTESTS = {
	0: { // pres strat rec
		0: {
			fStruct: makeRoot, options: {
				presentationStrategy: 'rec', autoType: 'cssEmpty',
				params: { _1: { width: 40, height: 40, color: 'red', 'background-color': 'blue' } }
			}
		},
		// 1: { fStruct: makeSimplestTree, options: { params: { '_1': { width: 100, height: 120 } } } },
		// 2: { fStruct: makeSimpleTree, options: { params: { '_1': { width: 100, height: 120 } } } },
		// 3: { fStruct: makeSimpleTree, options: { params: { '_1': { orientation: 'v', width: 100, height: 120 } } } },
		// //done
		// 4: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' }, '_4': { orientation: 'v' } } } },
		// 5: { fStruct: makeTree332x2, options: { params: { '_1': { orientation: 'v' } } } },
		// 6: { fStruct: makeTree332x2, options: { params: { '_4': { orientation: 'v' } } } },
	},
	1: {
		0: { fStruct: makeSimplestTree, options: { params: { '_1': { height: 120 } } } },
		1: { fStruct: makeSimplestTree, options: { params: { '_1': { width: 100, height: 120 } } } },
		2: { fStruct: makeSimpleTree, options: { params: { '_1': { width: 100, height: 120 } } } },
		3: { fStruct: makeSimpleTree, options: { params: { '_1': { orientation: 'v', width: 100, height: 120 } } } },
		//done
		4: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' }, '_4': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { params: { '_1': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { params: { '_4': { orientation: 'v' } } } },
	},
	2: {
		0: { fStruct: makeTree33, options: { params: { '_4': { fg: 'red', orientation: 'v' } } } },
		1: { fStruct: makeTree33, options: { params: { '_4': { orientation: 'v' } } } },
		2: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' } } } },
		3: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' } } } },
		4: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' }, '_4': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { params: { '_1': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { params: { '_4': { orientation: 'v' } } } },
		7: { fStruct: makeTree332x2, options: { params: { '_7': { orientation: 'v' } } } },
	},
	3: {
		0: { fStruct: makeTree33, options: { params: { '_4': { fg: 'red', orientation: 'v' } } } },
		1: { fStruct: makeTree33, options: { params: { '_4': { orientation: 'v' } } } },
		2: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' } } } },
		3: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' } } } },
		4: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' }, '_4': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { params: { '_1': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { params: { '_4': { orientation: 'v' } } } },
		7: { fStruct: makeTree332x2, options: { params: { '_7': { orientation: 'v' } } } },
		8: { fStruct: makeTree332x2, options: { params: { '_4': { orientation: 'v' }, '_7': { orientation: 'v' } } } },
		9: { fStruct: makeSimplestTree, options: undefined },
		10: { fStruct: makeSimplestTree, options: { fContent: contentNoRootContent } },
		11: { fStruct: makeSimpleTree, options: undefined },
		12: { fStruct: makeSimpleTree, options: { params: { '_1': { orientation: 'v' } } } },
		13: { fStruct: makeSimpleTree, options: { fContent: contentNoRootContent } },
		14: { fStruct: makeTree33, options: { fContent: contentNoRootContent } },
		15: { fStruct: makeTree332x2, options: undefined },
		16: { fStruct: makeTree332x2, options: { fContent: contentNoRootContent } },
		17: { fStruct: () => makeSimpleTree(20), options: { fContent: contentNoRootContent } },
		18: { fStruct: makeSimplestTree, options: { fContent: contentRootExtralong } },
		19: { fStruct: makeTree33, options: { fContent: contentRootExtralong } },
		20: { fStruct: () => makeSimpleTree(3), options: { fContent: contentRootExtralong } },
		21: {
			fStruct: makeTree33, options: {
				params: {
					'_1': { bg: 'black', orientation: 'v' },
					'_4': { bg: 'inherit', orientation: 'v' }
				}
			}
		},
		22: { fStruct: makeTree33, options: { fContent: contentRootExtralong, params: { '_1': { orientation: 'v' } } } },
		23: { fStruct: makeTree33, options: { fContent: contentRootExtralong, params: { '_4': { orientation: 'v' } } } },
	},
	4: { //random positioning_: NO SOLUTIONS!!!!
		0: { fStruct: makeSimplestTree, options: { fContent: n => n.uid == '_1' ? 'random' : n.uid, positioning: 'random' } },
		1: { fStruct: makeSimpleTree, options: { fContent: n => n.uid == '_1' ? 'random' : n.uid, positioning: 'random' } },
		2: { fStruct: () => makeSimpleTree(10), options: { fContent: n => n.uid == '_1' ? 'random' : n.uid, positioning: 'random' } },
		3: { fStruct: makeTree33, options: { fContent: n => n.uid == '_1' ? 'random' : n.uid, positioning: 'random' } },
	},
	5: { //data verschiedenster art: TODO: solutions dazu!
		0: { fStruct: makeSimplestTree, options: { fContent: n => n.uid == '_1' ? 'hallo' : n.uid, params: { '_1': { height: 120 } } } },
		1: {
			fStruct: makeSimplestTree, options: {
				fContent: n => n.uid == '_1' ? { first: '1', uid: n.uid } : n.uid,
				params: { '_1': { bg: 'blue', 'text-align': 'center', width: 100, height: 120 } }
			}
		},
	},
	6: { // regular positioning
		41: {
			fStruct: () => makeTreeNNEach(2, 4), options: {
				params: {
					'_1': { orientation: 'h' },
					'_2': { orientation: 'w', rows: 2, cols: 2 },
					'_7': { orientation: 'w', rows: 2, cols: 2 }
				}
			}
		},
		40: {
			fStruct: () => makeTreeNNEach(1, 4),
			options: {
				params:
				{
					'_2': { orientation: 'w', rows: 2, cols: 2 }
				}
			}
		},
		39: {
			fStruct: () => makeTreeNNEach(2, 2), options: {
				params: {
					'_2': { orientation: 'w', rows: 1, cols: 2 },
					'_5': { orientation: 'w', rows: 1, cols: 2 }
				}
			}
		},
		38: {
			fStruct: () => makeTreeNNEach(2, 4), options: {
				params: {
					'_2': { orientation: 'w', rows: 2, cols: 2 },
					'_7': { orientation: 'w', rows: 2, cols: 2 }
				}
			}
		},
		37: { fStruct: makeSimpleTree, options: { fType: typePanelInfo, fContent: contentHallo } },
		36: { fStruct: makeSimpleTree, options: { fType: typePanelInfo, fContent: contentHallo, presentationStrategy: 'new' } },
		35: { fStruct: () => makeTreeNN(2, 2), options: { fType: typeEmpty, presentationStrategy: 'new' } },
		34: { fStruct: makeTree33, options: { fType: typeEmpty, presentationStrategy: 'new' } },
		33: { fStruct: makeTree33, options: { fType: typeEmpty, presentationStrategy: 'new', params: { '_1': { orientation: 'v' } } } },
		32: { fStruct: makeTree33, options: { presentationStrategy: 'orig', params: { '_1': { orientation: 'v' } } } },
		31: {
			fStruct: makeTree33, options: {
				fType: typePanelInfo,
				presentationStrategy: 'new',
				params: { '_1': { orientation: 'v' } }
			}
		},
		30: {
			fStruct: makeTree33, options: {
				fType: typeEmpty,
				presentationStrategy: 'rec',
				params: { '_1': { orientation: 'h' } }
			}
		},
		29: { fStruct: makeTree33, options: { params: { '_1': { orientation: 'v' } } } },
		28: { fStruct: () => makeSimpleTree(8), options: { presentationStrategy: 'new', fType: type00flex } },
		27: { fStruct: makeSimplestTree, options: { presentationStrategy: 'new', fType: type00flex } },
		26: { fStruct: makeSimplestTree, options: { presentationStrategy: 'new', fType: typeEmpty } },
		25: { fStruct: makeSimplestTree, options: { presentationStrategy: 'new' } },
		24: { fStruct: makeSimplestTree, options: undefined },
		23: { fStruct: makeSimplestTree, options: { presentationStrategy: 'orig' } },
		22: { fStruct: makeSimplestTree, options: { fType: typeEmpty } },
		21: { fStruct: () => makeHugeBoardInBoardOld(25, 5), options: { fContent: contentNoParentContent } },
		20: { fStruct: () => makeHugeBoardInBoard(25, 5), options: { fContent: contentNoParentContent } },
		19: { fStruct: () => makeHugeBoardInBoard(40, 5), options: { fContent: contentNoParentContent } },
		18: { fStruct: () => makeHugeBoardInBoard(4, 2), options: { fContent: contentNoParentContent } },
		17: { fStruct: () => makeTreeNNEach(2, 4), options: { fContent: contentNoParentContent, params: { '_1': { orientation: 'w', rows: 1, cols: 2 }, '_2': { contentwalign: 'center', contenthalign: 'center' }, '_7': { contentwalign: 'center', orientation: 'w', rows: 2, cols: 2 } } } },
		16: {
			fStruct: () => makeTreeNNEach(2, 4), options: {
				fContent: contentRootExtralong,
				params: {
					'_1': { orientation: 'w', rows: 1, cols: 2 },
					'_2': { contenthalign: 'center' },
					'_7': { contentwalign: 'center', orientation: 'w', rows: 2, cols: 2 }
				}
			}
		},
		15: {
			fStruct: () => makeTreeNNEach(2, 4), options: {
				params: {
					'_1': { orientation: 'w', rows: 1, cols: 2 },
					'_7': { orientation: 'w', rows: 2, cols: 2 }
				}
			}
		},
		14: { fStruct: () => makeTreeNN(2, 4), options: { fContent: contentNoParentContentRootExtralong, params: { '_1': { orientation: 'w', rows: 1, cols: 2 }, '_2': { orientation: 'w', rows: 2, cols: 2 } } } },
		13: { fStruct: () => makeTreeNN(2, 4), options: { params: { '_1': { orientation: 'w', rows: 1, cols: 2 }, '_2': { orientation: 'w', rows: 2, cols: 2 } } } },
		12: { fStruct: () => makeTreeNN(2, 4), options: { fContent: contentNoParentContent, params: { '_1': { orientation: 'w', rows: 1, cols: 2 }, '_2': { orientation: 'w', rows: 2, cols: 2 } } } },
		11: { fStruct: () => makeSimpleTree(3), options: { fContent: contentRootExtralong, params: { '_1': { orientation: 'w', rows: 3, cols: 1 } } } },
		10: { fStruct: () => makeSimpleTree(3), options: { params: { '_1': { orientation: 'w', rows: 3, cols: 1 } } } },
		9: { fStruct: () => makeSimpleTree(3), options: { fContent: contentNoParentContent, params: { '_1': { orientation: 'w', rows: 3, cols: 1 } } } },
		8: { fStruct: () => makeSimpleTree(2), options: { fContent: contentRootExtralong, params: { '_1': { orientation: 'w', rows: 2, cols: 1 } } } },
		7: { fStruct: () => makeSimpleTree(2), options: { params: { '_1': { orientation: 'w', rows: 2, cols: 1 } } } },
		6: { fStruct: () => makeSimpleTree(2), options: { fContent: contentNoParentContent, params: { '_1': { orientation: 'w', rows: 2, cols: 1 } } } },
		5: { fStruct: () => makeSimpleTree(4), options: { fContent: contentRootExtralong, params: { '_1': { orientation: 'w', rows: 2, cols: 2 } } } },
		4: { fStruct: () => makeSimpleTree(4), options: { params: { '_1': { orientation: 'w', rows: 2, cols: 2 } } } },
		3: { fStruct: () => makeSimpleTree(2), options: { fContent: contentRootExtralong } },
		2: { fStruct: () => makeSimpleTree(2), options: { positioning: 'regular', fContent: contentRootExtralong } },
		1: { fStruct: () => makeSimpleTree(20), options: { positioning: 'regular' } },
		0: { fStruct: () => makeSimpleTree(4), options: { fContent: n => n.uid == '_1' ? 'board' : n.uid, positioning: 'regular' } },
	},
	7: {
		0: { fStruct: makeSimpleTree, options: { autoType: 'cssEmpty', fContent: contentNoParentContent } },

	},
};
const ALLTESTSOLUTIONS = {
	0: {},
	1: { "0": { "_1": { "w": 23, "h": 120 }, "_2": { "w": 19, "h": 19 } }, "1": { "_1": { "w": 104, "h": 120 }, "_2": { "w": 19, "h": 19 } }, "2": { "_1": { "w": 104, "h": 120 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 } }, "3": { "_1": { "w": 104, "h": 120 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 } }, "4": { "_1": { "w": 27, "h": 145 }, "_2": { "w": 23, "h": 19 }, "_3": { "w": 23, "h": 19 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "5": { "_1": { "w": 130, "h": 124 }, "_2": { "w": 126, "h": 19 }, "_3": { "w": 126, "h": 19 }, "_4": { "w": 126, "h": 61 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 40 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "6": { "_1": { "w": 104, "h": 145 }, "_2": { "w": 19, "h": 124 }, "_3": { "w": 19, "h": 124 }, "_4": { "w": 58, "h": 124 }, "_5": { "w": 54, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 54, "h": 19 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } } },
	2: { "0": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "1": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "2": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 65, "h": 19 }, "_3": { "w": 65, "h": 19 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "3": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 65, "h": 19 }, "_3": { "w": 65, "h": 19 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "4": { "_1": { "w": 27, "h": 145 }, "_2": { "w": 23, "h": 19 }, "_3": { "w": 23, "h": 19 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "5": { "_1": { "w": 130, "h": 124 }, "_2": { "w": 126, "h": 19 }, "_3": { "w": 126, "h": 19 }, "_4": { "w": 126, "h": 61 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 40 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "6": { "_1": { "w": 104, "h": 145 }, "_2": { "w": 19, "h": 124 }, "_3": { "w": 19, "h": 124 }, "_4": { "w": 58, "h": 124 }, "_5": { "w": 54, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 54, "h": 19 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "7": { "_1": { "w": 146, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 100, "h": 82 }, "_5": { "w": 44, "h": 61 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 61 }, "_7": { "w": 28, "h": 61 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 24, "h": 19 } } },
	3: { "0": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "1": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "2": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 65, "h": 19 }, "_3": { "w": 65, "h": 19 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "3": { "_1": { "w": 69, "h": 103 }, "_2": { "w": 65, "h": 19 }, "_3": { "w": 65, "h": 19 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "4": { "_1": { "w": 27, "h": 145 }, "_2": { "w": 23, "h": 19 }, "_3": { "w": 23, "h": 19 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "5": { "_1": { "w": 130, "h": 124 }, "_2": { "w": 126, "h": 19 }, "_3": { "w": 126, "h": 19 }, "_4": { "w": 126, "h": 61 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 40 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "6": { "_1": { "w": 104, "h": 145 }, "_2": { "w": 19, "h": 124 }, "_3": { "w": 19, "h": 124 }, "_4": { "w": 58, "h": 124 }, "_5": { "w": 54, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 54, "h": 19 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "7": { "_1": { "w": 146, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 100, "h": 82 }, "_5": { "w": 44, "h": 61 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 61 }, "_7": { "w": 28, "h": 61 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 24, "h": 19 } }, "8": { "_1": { "w": 94, "h": 166 }, "_2": { "w": 19, "h": 145 }, "_3": { "w": 19, "h": 145 }, "_4": { "w": 48, "h": 145 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 44, "h": 19 }, "_7": { "w": 44, "h": 61 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 24, "h": 19 } }, "9": { "_1": { "w": 23, "h": 40 }, "_2": { "w": 19, "h": 19 } }, "10": { "_1": { "w": 23, "h": 23 }, "_2": { "w": 19, "h": 19 } }, "11": { "_1": { "w": 44, "h": 40 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 } }, "12": { "_1": { "w": 23, "h": 61 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 } }, "13": { "_1": { "w": 44, "h": 23 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 } }, "14": { "_1": { "w": 111, "h": 44 }, "_2": { "w": 19, "h": 40 }, "_3": { "w": 19, "h": 40 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "15": { "_1": { "w": 172, "h": 82 }, "_2": { "w": 19, "h": 61 }, "_3": { "w": 19, "h": 61 }, "_4": { "w": 126, "h": 61 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 40 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "16": { "_1": { "w": 172, "h": 65 }, "_2": { "w": 19, "h": 61 }, "_3": { "w": 19, "h": 61 }, "_4": { "w": 126, "h": 61 }, "_5": { "w": 44, "h": 40 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 40 }, "_7": { "w": 54, "h": 40 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 } }, "17": { "_1": { "w": 490, "h": 23 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 }, "_4": { "w": 19, "h": 19 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 }, "_8": { "w": 19, "h": 19 }, "_9": { "w": 19, "h": 19 }, "_10": { "w": 24, "h": 19 }, "_11": { "w": 23, "h": 19 }, "_12": { "w": 24, "h": 19 }, "_13": { "w": 24, "h": 19 }, "_14": { "w": 24, "h": 19 }, "_15": { "w": 24, "h": 19 }, "_16": { "w": 24, "h": 19 }, "_17": { "w": 24, "h": 19 }, "_18": { "w": 24, "h": 19 }, "_19": { "w": 24, "h": 19 }, "_20": { "w": 24, "h": 19 }, "_21": { "w": 24, "h": 19 } }, "18": { "_1": { "w": 196, "h": 40 }, "_2": { "w": 19, "h": 19 } }, "19": { "_1": { "w": 196, "h": 61 }, "_2": { "w": 19, "h": 40 }, "_3": { "w": 19, "h": 40 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "20": { "_1": { "w": 196, "h": 40 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 }, "_4": { "w": 19, "h": 19 } }, "21": { "_1": { "w": 27, "h": 145 }, "_2": { "w": 23, "h": 19 }, "_3": { "w": 23, "h": 19 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "22": { "_1": { "w": 196, "h": 103 }, "_2": { "w": 65, "h": 19 }, "_3": { "w": 65, "h": 19 }, "_4": { "w": 65, "h": 40 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } }, "23": { "_1": { "w": 196, "h": 103 }, "_2": { "w": 19, "h": 82 }, "_3": { "w": 19, "h": 82 }, "_4": { "w": 23, "h": 82 }, "_5": { "w": 19, "h": 19 }, "_6": { "w": 19, "h": 19 }, "_7": { "w": 19, "h": 19 } } },
	4: {}, //cannot have solutions because random positioning_!!!!
	5: { "0": { "_1": { "w": 33, "h": 120 }, "_2": { "w": 19, "h": 19 } }, "1": { "_1": { "w": 104, "h": 120 }, "_2": { "w": 19, "h": 19 } } },
	6: {},
	7: { "0": { "_1": { "w": 11, "h": 22 }, "_2": { "w": 11, "h": 11 }, "_3": { "w": 11, "h": 11 } } },
};










