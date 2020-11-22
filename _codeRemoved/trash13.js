async function saveSession() {
	//localStorage.
	console.log('posting...');

	let payload = {
		"id": 1,
		"email": "john@doe.com"
	};
	fetch('http://localhost:3000/users/1', {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	}).then(data => {
		console.log(data);
		// this.notifications.show({
		//     message: 'Изменения сохранены'
		// });
	});

	// const response = await fetch('http://localhost:3000/users', {
	// 	method: 'POST', // *GET, POST, PUT, DELETE, etc.
	// 	mode: 'no-cors', // no-cors, *cors, same-origin
	// 	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	// 	credentials: 'same-origin', // include, *same-origin, omit
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 		// 'Content-Type': 'application/x-www-form-urlencoded',
	// 	},
	// 	redirect: 'follow', // manual, *follow, error
	// 	referrerPolicy: 'no-referrer', // no-referrer, *client
	// 	body: JSON.stringify({ userId:566, name: 'toto' })}); // body data type must match "Content-Type" header
	//});
	//return await response.json(); // parses JSON response into native JavaScript objects

	// fetch('http://localhost:3000/users', {
	//   username: 'max',
	//   password: 'hallo',
	//   mode: 'no-cors',
	//   method: 'post',
	//   url: `http://localhost:3000`,
	//   credentials: 'include'
	// });
	//postData('https://localhost:3000/users', { userId:566, name: 'toto' })
}
