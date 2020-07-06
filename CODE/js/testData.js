//manual00 tests
const ALLTESTS = {
	0: { // regular positioning
		2: { fStruct: () => makeSimpleTree(2), options: { positioning: 'regular', data: { '_0': 'board' }, rootContent: true, extralong: false } },
		1: { fStruct: () => makeSimpleTree(20), options: { positioning: 'regular', data: { '_0': 'board' }, rootContent: true, extralong: false } },
		0: { fStruct: () => makeSimpleTree(4), options: { positioning: 'regular', data: { '_0': 'board' }, rootContent: true, extralong: false } },
	},
	1: {
		0: { fStruct: makeSimplestTree, options: { rootContent: true, extralong: false, params: { '_0': { height: 120 } } } },
		1: { fStruct: makeSimplestTree, options: { rootContent: true, extralong: false, params: { '_0': { width: 100, height: 120 } } } },
		2: { fStruct: makeSimpleTree, options: { rootContent: true, extralong: false, params: { '_0': { width: 100, height: 120 } } } },
		3: { fStruct: makeSimpleTree, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v', width: 100, height: 120 } } } },
		//done
		4: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' }, '_3': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } } },
		7: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_3': { orientation: 'v' } } } },
	},
	2: {
		0: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_3': { fg: 'red', orientation: 'v' } } } },
		1: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_3': { orientation: 'v' } } } },
		2: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		3: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } } },
		4: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' }, '_3': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } } },
		7: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_6': { orientation: 'v' } } } },
	},
	3: {
		0: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_3': { fg: 'red', orientation: 'v' } } } },
		1: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_3': { orientation: 'v' } } } },
		2: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		3: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_1': { orientation: 'v' } } } },
		4: { fStruct: makeTree33, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' }, '_3': { orientation: 'v' } } } },
		5: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		6: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' } } } },
		7: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_6': { orientation: 'v' } } } },
		8: { fStruct: makeTree332x2, options: { rootContent: true, extralong: false, params: { '_4': { orientation: 'v' }, '_6': { orientation: 'v' } } } },
		9: { fStruct: makeSimplestTree, options: undefined },
		10: { fStruct: makeSimplestTree, options: { rootContent: false } },
		11: { fStruct: makeSimpleTree, options: undefined },
		12: { fStruct: makeSimpleTree, options: { rootContent: true, extralong: false, params: { '_0': { orientation: 'v' } } } },
		13: { fStruct: makeSimpleTree, options: { rootContent: false } },
		14: { fStruct: makeTree33, options: { rootContent: false } },
		15: { fStruct: makeTree332x2, options: undefined },
		16: { fStruct: makeTree332x2, options: { rootContent: false } },
		17: { fStruct: () => makeSimpleTree(20), options: { rootContent: false } },
		18: { fStruct: makeSimplestTree, options: { rootContent: true, extralong: true } },
		19: { fStruct: makeTree33, options: { rootContent: true, extralong: true } },
		20: { fStruct: () => makeSimpleTree(3), options: { rootContent: true, extralong: true } },
		21: {
			fStruct: makeTree33, options: {
				rootContent: true, extralong: false, params: {
					'_0': { bg: 'black', orientation: 'v' },
					'_3': { bg: 'inherit', orientation: 'v' }
				}
			}
		},
		22: { fStruct: makeTree33, options: { rootContent: true, extralong: true, params: { '_0': { orientation: 'v' } } } },
		23: { fStruct: makeTree33, options: { rootContent: true, extralong: true, params: { '_3': { orientation: 'v' } } } },
	},
	4: { //random positioning: NO SOLUTIONS!!!!
		0: { fStruct: makeSimplestTree, options: { positioning: 'random', data: { '_0': 'positioned' }, rootContent: true, extralong: false } },
		1: { fStruct: makeSimpleTree, options: { positioning: 'random', data: { '_0': 'positioned' }, rootContent: true, extralong: false } },
		2: { fStruct: () => makeSimpleTree(10), options: { positioning: 'random', data: { '_0': 'positioned' }, rootContent: true, extralong: false } },
		3: { fStruct: makeTree33, options: { positioning: 'random', data: { '_0': 'positioned' }, rootContent: true, extralong: false } },
	},
	5: { //data verschiedenster art: TODO: solutions dazu!
		0: { fStruct: makeSimplestTree, options: { rootContent: true, extralong: false, options: { '_0': { height: 120 } }, data: { '_0': 'hallo' } } },
		1: { fStruct: makeSimplestTree, options: { data: { '_0': { first: '1', sec: '2' } }, rootContent: true, extralong: false, params: { '_0': { width: 100, height: 120 } } } },
	},
};
const ALLTESTSOLUTIONS = {
	0: { "0": { "_1": { "w": 43, "h": 62 }, "_2": { "w": 19, "h": 19 }, "_3": { "w": 19, "h": 19 }, "_4": { "w": 19, "h": 19 }, "_5": { "w": 19, "h": 19 } }, "1": { "_6": { "w": 127, "h": 120 }, "_7": { "w": 23, "h": 23 }, "_8": { "w": 23, "h": 23 }, "_9": { "w": 23, "h": 23 }, "_10": { "w": 23, "h": 23 }, "_11": { "w": 23, "h": 23 }, "_12": { "w": 23, "h": 23 }, "_13": { "w": 23, "h": 23 }, "_14": { "w": 23, "h": 23 }, "_15": { "w": 23, "h": 23 }, "_16": { "w": 23, "h": 23 }, "_17": { "w": 23, "h": 23 }, "_18": { "w": 23, "h": 23 }, "_19": { "w": 23, "h": 23 }, "_20": { "w": 23, "h": 23 }, "_21": { "w": 23, "h": 23 }, "_22": { "w": 23, "h": 23 }, "_23": { "w": 23, "h": 23 }, "_24": { "w": 23, "h": 23 }, "_25": { "w": 23, "h": 23 }, "_26": { "w": 23, "h": 23 } } },
	1: {
		"0": {
			"_1": {
				"w": 23,
				"h": 120
			},
			"_2": {
				"w": 19,
				"h": 19
			}
		},
		"1": {
			"_3": {
				"w": 104,
				"h": 120
			},
			"_4": {
				"w": 19,
				"h": 19
			}
		},
		"2": {
			"_5": {
				"w": 104,
				"h": 120
			},
			"_6": {
				"w": 19,
				"h": 19
			},
			"_7": {
				"w": 19,
				"h": 19
			}
		},
		"3": {
			"_8": {
				"w": 104,
				"h": 120
			},
			"_9": {
				"w": 24,
				"h": 19
			},
			"_10": {
				"w": 24,
				"h": 19
			}
		},
		"4": {
			"_11": {
				"w": 32,
				"h": 145
			},
			"_12": {
				"w": 28,
				"h": 19
			},
			"_13": {
				"w": 28,
				"h": 19
			},
			"_14": {
				"w": 28,
				"h": 82
			},
			"_15": {
				"w": 24,
				"h": 19
			},
			"_16": {
				"w": 24,
				"h": 19
			},
			"_17": {
				"w": 24,
				"h": 19
			}
		},
		"5": {
			"_18": {
				"w": 147,
				"h": 124
			},
			"_19": {
				"w": 143,
				"h": 19
			},
			"_20": {
				"w": 143,
				"h": 19
			},
			"_21": {
				"w": 143,
				"h": 61
			},
			"_22": {
				"w": 55,
				"h": 40
			},
			"_25": {
				"w": 24,
				"h": 19
			},
			"_26": {
				"w": 24,
				"h": 19
			},
			"_23": {
				"w": 24,
				"h": 40
			},
			"_24": {
				"w": 55,
				"h": 40
			},
			"_27": {
				"w": 24,
				"h": 19
			},
			"_28": {
				"w": 24,
				"h": 19
			}
		},
		"6": {
			"_29": {
				"w": 174,
				"h": 103
			},
			"_30": {
				"w": 24,
				"h": 82
			},
			"_31": {
				"w": 24,
				"h": 82
			},
			"_32": {
				"w": 116,
				"h": 82
			},
			"_33": {
				"w": 28,
				"h": 61
			},
			"_36": {
				"w": 24,
				"h": 19
			},
			"_37": {
				"w": 24,
				"h": 19
			},
			"_34": {
				"w": 24,
				"h": 61
			},
			"_35": {
				"w": 55,
				"h": 61
			},
			"_38": {
				"w": 24,
				"h": 19
			},
			"_39": {
				"w": 24,
				"h": 19
			}
		},
		"7": {
			"_40": {
				"w": 116,
				"h": 145
			},
			"_41": {
				"w": 24,
				"h": 124
			},
			"_42": {
				"w": 24,
				"h": 124
			},
			"_43": {
				"w": 59,
				"h": 124
			},
			"_44": {
				"w": 55,
				"h": 40
			},
			"_47": {
				"w": 24,
				"h": 19
			},
			"_48": {
				"w": 24,
				"h": 19
			},
			"_45": {
				"w": 55,
				"h": 19
			},
			"_46": {
				"w": 55,
				"h": 40
			},
			"_49": {
				"w": 24,
				"h": 19
			},
			"_50": {
				"w": 24,
				"h": 19
			}
		}
	},
	2: {
		"0": {
			"_1": {
				"w": 69,
				"h": 103
			},
			"_2": {
				"w": 19,
				"h": 82
			},
			"_3": {
				"w": 19,
				"h": 82
			},
			"_4": {
				"w": 23,
				"h": 82
			},
			"_5": {
				"w": 19,
				"h": 19
			},
			"_6": {
				"w": 19,
				"h": 19
			},
			"_7": {
				"w": 19,
				"h": 19
			}
		},
		"1": {
			"_8": {
				"w": 80,
				"h": 103
			},
			"_9": {
				"w": 19,
				"h": 82
			},
			"_10": {
				"w": 24,
				"h": 82
			},
			"_11": {
				"w": 28,
				"h": 82
			},
			"_12": {
				"w": 24,
				"h": 19
			},
			"_13": {
				"w": 24,
				"h": 19
			},
			"_14": {
				"w": 24,
				"h": 19
			}
		},
		"2": {
			"_15": {
				"w": 86,
				"h": 103
			},
			"_16": {
				"w": 82,
				"h": 19
			},
			"_17": {
				"w": 82,
				"h": 19
			},
			"_18": {
				"w": 82,
				"h": 40
			},
			"_19": {
				"w": 24,
				"h": 19
			},
			"_20": {
				"w": 24,
				"h": 19
			},
			"_21": {
				"w": 24,
				"h": 19
			}
		},
		"3": {
			"_22": {
				"w": 139,
				"h": 61
			},
			"_23": {
				"w": 24,
				"h": 40
			},
			"_24": {
				"w": 24,
				"h": 40
			},
			"_25": {
				"w": 82,
				"h": 40
			},
			"_26": {
				"w": 24,
				"h": 19
			},
			"_27": {
				"w": 24,
				"h": 19
			},
			"_28": {
				"w": 24,
				"h": 19
			}
		},
		"4": {
			"_29": {
				"w": 32,
				"h": 145
			},
			"_30": {
				"w": 28,
				"h": 19
			},
			"_31": {
				"w": 28,
				"h": 19
			},
			"_32": {
				"w": 28,
				"h": 82
			},
			"_33": {
				"w": 24,
				"h": 19
			},
			"_34": {
				"w": 24,
				"h": 19
			},
			"_35": {
				"w": 24,
				"h": 19
			}
		},
		"5": {
			"_36": {
				"w": 147,
				"h": 124
			},
			"_37": {
				"w": 143,
				"h": 19
			},
			"_38": {
				"w": 143,
				"h": 19
			},
			"_39": {
				"w": 143,
				"h": 61
			},
			"_40": {
				"w": 55,
				"h": 40
			},
			"_43": {
				"w": 24,
				"h": 19
			},
			"_44": {
				"w": 24,
				"h": 19
			},
			"_41": {
				"w": 24,
				"h": 40
			},
			"_42": {
				"w": 55,
				"h": 40
			},
			"_45": {
				"w": 24,
				"h": 19
			},
			"_46": {
				"w": 24,
				"h": 19
			}
		},
		"6": {
			"_47": {
				"w": 174,
				"h": 103
			},
			"_48": {
				"w": 24,
				"h": 82
			},
			"_49": {
				"w": 24,
				"h": 82
			},
			"_50": {
				"w": 116,
				"h": 82
			},
			"_51": {
				"w": 28,
				"h": 61
			},
			"_54": {
				"w": 24,
				"h": 19
			},
			"_55": {
				"w": 24,
				"h": 19
			},
			"_52": {
				"w": 24,
				"h": 61
			},
			"_53": {
				"w": 55,
				"h": 61
			},
			"_56": {
				"w": 24,
				"h": 19
			},
			"_57": {
				"w": 24,
				"h": 19
			}
		},
		"7": {
			"_58": {
				"w": 174,
				"h": 103
			},
			"_59": {
				"w": 24,
				"h": 82
			},
			"_60": {
				"w": 24,
				"h": 82
			},
			"_61": {
				"w": 116,
				"h": 82
			},
			"_62": {
				"w": 55,
				"h": 61
			},
			"_65": {
				"w": 24,
				"h": 19
			},
			"_66": {
				"w": 24,
				"h": 19
			},
			"_63": {
				"w": 24,
				"h": 61
			},
			"_64": {
				"w": 28,
				"h": 61
			},
			"_67": {
				"w": 24,
				"h": 19
			},
			"_68": {
				"w": 24,
				"h": 19
			}
		}
	},
	3: {
		"0": {
			"_1": {
				"w": 69,
				"h": 103
			},
			"_2": {
				"w": 19,
				"h": 82
			},
			"_3": {
				"w": 19,
				"h": 82
			},
			"_4": {
				"w": 23,
				"h": 82
			},
			"_5": {
				"w": 19,
				"h": 19
			},
			"_6": {
				"w": 19,
				"h": 19
			},
			"_7": {
				"w": 19,
				"h": 19
			}
		},
		"1": {
			"_8": {
				"w": 80,
				"h": 103
			},
			"_9": {
				"w": 19,
				"h": 82
			},
			"_10": {
				"w": 24,
				"h": 82
			},
			"_11": {
				"w": 28,
				"h": 82
			},
			"_12": {
				"w": 24,
				"h": 19
			},
			"_13": {
				"w": 24,
				"h": 19
			},
			"_14": {
				"w": 24,
				"h": 19
			}
		},
		"2": {
			"_15": {
				"w": 86,
				"h": 103
			},
			"_16": {
				"w": 82,
				"h": 19
			},
			"_17": {
				"w": 82,
				"h": 19
			},
			"_18": {
				"w": 82,
				"h": 40
			},
			"_19": {
				"w": 24,
				"h": 19
			},
			"_20": {
				"w": 24,
				"h": 19
			},
			"_21": {
				"w": 24,
				"h": 19
			}
		},
		"3": {
			"_22": {
				"w": 139,
				"h": 61
			},
			"_23": {
				"w": 24,
				"h": 40
			},
			"_24": {
				"w": 24,
				"h": 40
			},
			"_25": {
				"w": 82,
				"h": 40
			},
			"_26": {
				"w": 24,
				"h": 19
			},
			"_27": {
				"w": 24,
				"h": 19
			},
			"_28": {
				"w": 24,
				"h": 19
			}
		},
		"4": {
			"_29": {
				"w": 32,
				"h": 145
			},
			"_30": {
				"w": 28,
				"h": 19
			},
			"_31": {
				"w": 28,
				"h": 19
			},
			"_32": {
				"w": 28,
				"h": 82
			},
			"_33": {
				"w": 24,
				"h": 19
			},
			"_34": {
				"w": 24,
				"h": 19
			},
			"_35": {
				"w": 24,
				"h": 19
			}
		},
		"5": {
			"_36": {
				"w": 147,
				"h": 124
			},
			"_37": {
				"w": 143,
				"h": 19
			},
			"_38": {
				"w": 143,
				"h": 19
			},
			"_39": {
				"w": 143,
				"h": 61
			},
			"_40": {
				"w": 55,
				"h": 40
			},
			"_43": {
				"w": 24,
				"h": 19
			},
			"_44": {
				"w": 24,
				"h": 19
			},
			"_41": {
				"w": 24,
				"h": 40
			},
			"_42": {
				"w": 55,
				"h": 40
			},
			"_45": {
				"w": 24,
				"h": 19
			},
			"_46": {
				"w": 24,
				"h": 19
			}
		},
		"6": {
			"_47": {
				"w": 174,
				"h": 103
			},
			"_48": {
				"w": 24,
				"h": 82
			},
			"_49": {
				"w": 24,
				"h": 82
			},
			"_50": {
				"w": 116,
				"h": 82
			},
			"_51": {
				"w": 28,
				"h": 61
			},
			"_54": {
				"w": 24,
				"h": 19
			},
			"_55": {
				"w": 24,
				"h": 19
			},
			"_52": {
				"w": 24,
				"h": 61
			},
			"_53": {
				"w": 55,
				"h": 61
			},
			"_56": {
				"w": 24,
				"h": 19
			},
			"_57": {
				"w": 24,
				"h": 19
			}
		},
		"7": {
			"_58": {
				"w": 174,
				"h": 103
			},
			"_59": {
				"w": 24,
				"h": 82
			},
			"_60": {
				"w": 24,
				"h": 82
			},
			"_61": {
				"w": 116,
				"h": 82
			},
			"_62": {
				"w": 55,
				"h": 61
			},
			"_65": {
				"w": 24,
				"h": 19
			},
			"_66": {
				"w": 24,
				"h": 19
			},
			"_63": {
				"w": 24,
				"h": 61
			},
			"_64": {
				"w": 28,
				"h": 61
			},
			"_67": {
				"w": 24,
				"h": 19
			},
			"_68": {
				"w": 24,
				"h": 19
			}
		},
		"8": {
			"_69": {
				"w": 147,
				"h": 103
			},
			"_70": {
				"w": 24,
				"h": 82
			},
			"_71": {
				"w": 24,
				"h": 82
			},
			"_72": {
				"w": 90,
				"h": 82
			},
			"_73": {
				"w": 28,
				"h": 61
			},
			"_76": {
				"w": 24,
				"h": 19
			},
			"_77": {
				"w": 24,
				"h": 19
			},
			"_74": {
				"w": 24,
				"h": 61
			},
			"_75": {
				"w": 28,
				"h": 61
			},
			"_78": {
				"w": 24,
				"h": 19
			},
			"_79": {
				"w": 24,
				"h": 19
			}
		},
		"9": {
			"_80": {
				"w": 28,
				"h": 40
			},
			"_81": {
				"w": 24,
				"h": 19
			}
		},
		"10": {
			"_82": {
				"w": 28,
				"h": 23
			},
			"_83": {
				"w": 24,
				"h": 19
			}
		},
		"11": {
			"_84": {
				"w": 55,
				"h": 40
			},
			"_85": {
				"w": 24,
				"h": 19
			},
			"_86": {
				"w": 24,
				"h": 19
			}
		},
		"12": {
			"_87": {
				"w": 28,
				"h": 61
			},
			"_88": {
				"w": 24,
				"h": 19
			},
			"_89": {
				"w": 24,
				"h": 19
			}
		},
		"13": {
			"_90": {
				"w": 55,
				"h": 23
			},
			"_91": {
				"w": 24,
				"h": 19
			},
			"_92": {
				"w": 24,
				"h": 19
			}
		},
		"14": {
			"_93": {
				"w": 139,
				"h": 44
			},
			"_94": {
				"w": 24,
				"h": 40
			},
			"_95": {
				"w": 24,
				"h": 40
			},
			"_96": {
				"w": 82,
				"h": 40
			},
			"_97": {
				"w": 24,
				"h": 19
			},
			"_98": {
				"w": 24,
				"h": 19
			},
			"_99": {
				"w": 24,
				"h": 19
			}
		},
		"15": {
			"_100": {
				"w": 239,
				"h": 82
			},
			"_101": {
				"w": 30,
				"h": 61
			},
			"_102": {
				"w": 30,
				"h": 61
			},
			"_103": {
				"w": 170,
				"h": 61
			},
			"_104": {
				"w": 66,
				"h": 40
			},
			"_107": {
				"w": 30,
				"h": 19
			},
			"_108": {
				"w": 30,
				"h": 19
			},
			"_105": {
				"w": 30,
				"h": 40
			},
			"_106": {
				"w": 65,
				"h": 40
			},
			"_109": {
				"w": 30,
				"h": 19
			},
			"_110": {
				"w": 29,
				"h": 19
			}
		},
		"16": {
			"_111": {
				"w": 236,
				"h": 65
			},
			"_112": {
				"w": 29,
				"h": 61
			},
			"_113": {
				"w": 29,
				"h": 61
			},
			"_114": {
				"w": 169,
				"h": 61
			},
			"_115": {
				"w": 65,
				"h": 40
			},
			"_118": {
				"w": 29,
				"h": 19
			},
			"_119": {
				"w": 29,
				"h": 19
			},
			"_116": {
				"w": 29,
				"h": 40
			},
			"_117": {
				"w": 66,
				"h": 40
			},
			"_120": {
				"w": 30,
				"h": 19
			},
			"_121": {
				"w": 30,
				"h": 19
			}
		},
		"17": {
			"_122": {
				"w": 647,
				"h": 23
			},
			"_123": {
				"w": 30,
				"h": 19
			},
			"_124": {
				"w": 30,
				"h": 19
			},
			"_125": {
				"w": 30,
				"h": 19
			},
			"_126": {
				"w": 30,
				"h": 19
			},
			"_127": {
				"w": 30,
				"h": 19
			},
			"_128": {
				"w": 30,
				"h": 19
			},
			"_129": {
				"w": 30,
				"h": 19
			},
			"_130": {
				"w": 30,
				"h": 19
			},
			"_131": {
				"w": 30,
				"h": 19
			},
			"_132": {
				"w": 30,
				"h": 19
			},
			"_133": {
				"w": 30,
				"h": 19
			},
			"_134": {
				"w": 30,
				"h": 19
			},
			"_135": {
				"w": 30,
				"h": 19
			},
			"_136": {
				"w": 30,
				"h": 19
			},
			"_137": {
				"w": 30,
				"h": 19
			},
			"_138": {
				"w": 30,
				"h": 19
			},
			"_139": {
				"w": 30,
				"h": 19
			},
			"_140": {
				"w": 30,
				"h": 19
			},
			"_141": {
				"w": 30,
				"h": 19
			},
			"_142": {
				"w": 30,
				"h": 19
			}
		},
		"18": {
			"_143": {
				"w": 196,
				"h": 40
			},
			"_144": {
				"w": 30,
				"h": 19
			}
		},
		"19": {
			"_145": {
				"w": 196,
				"h": 61
			},
			"_146": {
				"w": 30,
				"h": 40
			},
			"_147": {
				"w": 30,
				"h": 40
			},
			"_148": {
				"w": 98,
				"h": 40
			},
			"_149": {
				"w": 30,
				"h": 19
			},
			"_150": {
				"w": 30,
				"h": 19
			},
			"_151": {
				"w": 30,
				"h": 19
			}
		},
		"20": {
			"_152": {
				"w": 196,
				"h": 40
			},
			"_153": {
				"w": 30,
				"h": 19
			},
			"_154": {
				"w": 30,
				"h": 19
			},
			"_155": {
				"w": 30,
				"h": 19
			}
		},
		"21": {
			"_156": {
				"w": 38,
				"h": 145
			},
			"_157": {
				"w": 34,
				"h": 19
			},
			"_158": {
				"w": 34,
				"h": 19
			},
			"_159": {
				"w": 34,
				"h": 82
			},
			"_160": {
				"w": 30,
				"h": 19
			},
			"_161": {
				"w": 30,
				"h": 19
			},
			"_162": {
				"w": 30,
				"h": 19
			}
		},
		"22": {
			"_163": {
				"w": 196,
				"h": 103
			},
			"_164": {
				"w": 98,
				"h": 19
			},
			"_165": {
				"w": 98,
				"h": 19
			},
			"_166": {
				"w": 98,
				"h": 40
			},
			"_167": {
				"w": 30,
				"h": 19
			},
			"_168": {
				"w": 30,
				"h": 19
			},
			"_169": {
				"w": 30,
				"h": 19
			}
		},
		"23": {
			"_170": {
				"w": 196,
				"h": 103
			},
			"_171": {
				"w": 30,
				"h": 82
			},
			"_172": {
				"w": 30,
				"h": 82
			},
			"_173": {
				"w": 34,
				"h": 82
			},
			"_174": {
				"w": 30,
				"h": 19
			},
			"_175": {
				"w": 30,
				"h": 19
			},
			"_176": {
				"w": 30,
				"h": 19
			}
		}
	},
	4: {}, //cannot have solutions because random positioning!!!!
	5: { "0": { "_1": { "w": 33, "h": 40 }, "_2": { "w": 19, "h": 19 } }, "1": { "_3": { "w": 104, "h": 120 }, "_4": { "w": 19, "h": 19 } } },
};










