const {Suggestions} = require('actions-on-google');
module.exports = {
	/**
	 * getStream - Gets user's stream
	 * @param conv
	 * @param {string} callback - NAME of function from module 'show' to execute on callback.
	 * @param {string} arg - argument for callback function
	 * callback function must be from module show and of type show.func(conv)
	 **/
	 stream: function(conv, callback, arg){
		 console.log("callback from get.stream: "+callback);
		 conv.ask("What's your batch ?");
		 conv.ask(new Suggestions(["CSE","IT","Mechanical","Electrical"]));
		 conv.contexts.set("save_stream",3,{callback: callback, callback_arg: arg});
	 }
}
