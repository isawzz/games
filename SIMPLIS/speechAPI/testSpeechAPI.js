function testSimilar01(w) {
	let onyes = w => { return (r, c) => console.log('JA!', w, '=', r, '(' + c + ')'); }
	let onno = w => { return (r, c) => console.log('NEIN!!!!', w, '#', r, '(' + c + ')') };

	Speech.recognize(w, 'E', onyes(w), onno(w));
}
function testLanguageChange() {
	let onyes = w => { return (r, c) => console.log('JA!', w, '=', r, '(' + c + ')'); }
	let onno = w => { return (r, c) => console.log('NEIN!!!!', w, '#', r, '(' + c + ')') };

	let w = 'hello';
	Speech.recognize(w, 'E', onyes(w), onno(w));

	w = 'Hund';
	Speech.recognize(w, 'D', onyes(w), onno(w));
}
function testWait() {
	let onyes = w => { return (r, c) => console.log('JA!', w, '=', r, '(' + c + ')'); }
	let onno = w => { return (r, c) => console.log('NEIN!!!!', w, '#', r, '(' + c + ')') };

	let w = 'hello';
	Speech.recognize(w, 'E', onyes(w), onno(w));

	w = 'hand';
	Speech.recognize(w, 'E', onyes(w), onno(w));
}

function testRecognizeAdvanced() {
	// function onyes(w) { return (r, c) => console.log('YES!', w, r, c); }
	// function onno(w) { return (r, c) => console.log('NO!!!', w, r, c); }

	let onyes = w => { return (r, c) => console.log('JA!', w, '=', r, '(' + c + ')'); }
	let onno = w => { return (r, c) => console.log('NEIN!!!!', w, '#', r, '(' + c + ')') };

	let w = 'hello';
	Speech.recognize(w, 'E', onyes(w), onno(w));

	setTimeout(() => {
		w = 'Hund';
		Speech.recognize(w, 'D', onyes(w), onno(w));
	}, 5000);
}

function testPromise(w = 'hello', lang = 'E') {
	let onyes = (r, c) => console.log('JA!', w, '=', r, '(' + c + ')');
	let onno = (r, c) => console.log('NEIN!!!!', w, '!=', r, '(' + c + ')');

	let myPromise = new Promise(function (myResolve, myReject) {
		// "Producing Code" (May take some time)
		Speech.recognize(w, lang, onyes, onno);

		myResolve(); // when successful
		myReject();  // when error
	});

	// "Consuming Code" (Must wait for a fulfilled Promise)
	myPromise.then(
		function (value) {
			console.log('resolved:', value);
			Speech.recognize('hallo', 'D', onyes, onno);
		},
		function (error) { console.log('error:', error) }
	);
}

function testRecognize2() {

	let onyes = (r, c) => console.log('JA!', r, '(' + c + ')');
	let onno = (r, c) => console.log('NEIN!!!!', r, '(' + c + ')');

	let w = 'hello';
	Speech.recognize(w, 'E', onyes, onno);

	setTimeout(() => {
		w = 'Hund';
		Speech.recognize(w, 'D', onyes, onno);
	}, 5000);
}

function testRecognize(w = 'hello', lang = 'E') {

	let onyes = (r, c) => console.log('JA!', w, '=', r, '(' + c + ')');
	let onno = (r, c) => console.log('NEIN!!!!', w, '!=', r, '(' + c + ')');
	Speech.recognize(w, lang, onyes, onno);
}

function testStartAgainAfterStartingRecorder() {
	//assumes existence of global Speech
	let onRecorderStart = () => Speech.record({ onStart: () => console.log('2!'), delayStart: 2000, retry: true });
	Speech.record({ onStart: onRecorderStart, delayStart: 2000, retry: true });
}

function testChangingLangAfterStartingRecorder() {
	//assumes existence of global Speech
	let onRecorderStart = () => Speech.setLanguage('D');
	Speech.record({ onStart: onRecorderStart, delayStart: 2000, retry: true });
}
