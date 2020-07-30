const {Suggestions, Table, BasicCard, Image, List} = require('actions-on-google');
const get = require('./get.js');
module.exports = {
	/**
	 * routine - show routine for the specified day
	 * @param {int} day - 0 represents Sunday, -1 represents all
	 */
	routine: function(conv,day){
		console.log("Entering Routine")
		if ( day < -1 || day > 6 )
			throw new Error("Day out of range");
		var userId = conv.user.storage.userId;
		const admin=require('firebase-admin');
		const db=admin.firestore(); 
		return db.collection("users").doc(userId).get()
		.then(doc => {
				if (!doc.exists){
					conv.close("How about we get to know each other a bit ?");
					get.stream(conv,'routine');
					throw(new Object({custom: 1, text:"User not registered"}))
				}
				else{
					console.log('Document data:', doc.data());
					return db.collection("routines").doc(doc.data()['stream_full']).get().then( doc => {return doc })
				}
		})
		.then((doc) => {
			if (!doc.exists){
				conv.close("Erm.. We forgot to add your routine. Sorry!");
				console.log("Erm.. We forgot to add your routine. Sorry!");
				console.log("Your uid is: "+ conv.user.storage.userId);
				//conv.ask(new Suggestions([]));
				//TODO Add contact us suggestion chip.
			}
			else{
				console.log("Day received: "+ day);

				conv.ask("There you go!");
				var routine=doc.data()[day];
				var dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
				if (dayName === undefined) // No specified routine day, showing summery
					dayName = doc.id;

				console.log("Routine: "+ JSON.stringify(routine));
				console.log("Routine keys"+ Object.keys(routine));

				 var items = {}
				 for ( period in routine )
					 items["Period-"+period] = {
						 title: `${routine[period].sub} in ${routine[period].room} by ${routine[period].teacher} at ${routine[period].time}`,
						 synonyms: [
							 `Period ${period}`,
							 period,
							 routine[period].time
						 ]
					 }
					 console.log(items);
					 conv.ask(new List({
								 title: `${dayName}'s Routine`,
								 items: items
					 }));

				 console.log(doc.data());
			}
			return; //Last then
		}
		)
		.catch( err =>  {
				if ( err.custom ){
					console.log(err.text);
				}
				else{
					conv.close("Cats ate our server wires. Please try again.")
					//TODO Store errors persistently
					console.log("ERROR: ", err);
				}
		})
	}
}
