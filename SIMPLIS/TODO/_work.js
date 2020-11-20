function chainExecute(taskChain, onComplete) {
	let akku = [];
	_chainExecuteRec(akku, taskChain, onComplete);
}
function _chainExecuteRec(akku, taskChain, onComplete) {
	if (taskChain.length > 0) {

		taskChain[0].f(

			taskChain[0].cmd,

			d => {
				akku.push(d);
				_chainExecuteRec(akku, taskChain.slice(1), onComplete)
			},

			taskChain[0].data);

	} else {

		onComplete(akku);

	}
}
//usage:
//taskChain = [];
//taskChain.push({ cmd: cmd, f: _postRoute, data: { agent_type: plInfo.agentType, timeout: null } });
//f of form: function _postRoute(route, callback, data)
// the task f executes some kind of hiddenFunction that takes cmd and data as params and has a callback that takes the result
// that hiddenFunction may be a fetch call or a speech.record or a speech.say call
// speech.recognize even takes multiple callbacks: onSuccess,onFail

//this is what a promise really is!

// i could do it as promise...then... but its recursive 

// how can I adapt this to 













