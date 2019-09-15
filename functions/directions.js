const functions = require('firebase-functions');

// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;

// var $ = jQuery = require('jquery')(window);

const superagent = require('superagent');

function getDirections(origin, destination, cb) {
	
	superagent.get('https://maps.googleapis.com/maps/api/directions/json').query({
		'origin': origin,
		'destination': destination,
		'key': functions.config().gcp.key
	}).timeout({response: 1000, deadline: 2000}).then(res => {
		let geocode = res.body;
		let text = "Directions from " + geocode.routes[0].legs[0].start_address + " to " + geocode.routes[0].legs[0].end_address +
				"\nTotal Trip Distance: " + geocode.routes[0].legs[0].distance.text +
				"\nTotal Trip Duration: " + geocode.routes[0].legs[0].duration.text;
		
		for (let i = 0; i < geocode.routes[0].legs[0].steps.length; i++) {
			let item = geocode.routes[0].legs[0].steps[i];
			let instruction = item.html_instructions.replace(/\<b\>/g, "");
			instruction = instruction.replace(/\<\/b\>/g, "");
			instruction = instruction.replace(/\<div style=\"font\-size\:0\.9em\"\>/g, "\n");
			instruction = instruction.replace(/\<\/div\>/g, "");
			text += "\n" + (i+1).toString() + ". " + instruction;
		}
		
		cb(text);
	}).catch(err => {
		console.log(err.message);
		cb('Error: could not retrieve direction data');
	});
	
	// $.getJSON(url, function(data) {
	// 	let geocode = $.parseJSON(data);
	// 	let text = "Directions from " + geocode.routes[0].legs[0].start_address + " to " + geocode.routes[0].legs[0].end_address +
	// 			"\nTotal Trip Distance: " + geocode.routes[0].legs[0].distance.text +
	// 			"\nTotal Trip Duration: " + geocode.routes[0].legs[0].duration.text;
		
	// 	for (let i = 0; i < geocode.routes[0].legs[0].steps.length; i++) {
	// 		let item = geocode.routes[0].legs[0].steps[i];
	// 		let instruction = item.html_instructions.replace("\u003cb\u003e", "");
	// 		instruction = item.html_instructions.replace("\u003c/b\u003e", "");
	// 		instruction = item.html_instructions.replace("\u003cdiv style=\"font-size:0.9em\"\u003e", "\n");
	// 		instruction = item.html_instructions.replace("\u003c/div\u003e", "");
	// 		text += "\n" + (index+1).toString() + ". " + instruction;
	// 	}
		
	// 	cb(text);
	// }).fail(() => {
	// 	cb('Error: could not retrieve direction data');
	// });
}

module.exports.execute = (command, cb) => {
  let args = command.split(/\s+/);
  if (args.length < 2) {
		cb("Error: Origin and destination not specified");
		return;
  }
  if (args[1] != "from") {
		cb("Error: Formatting error, missing keyword \"from\"");
		return;
  }
  
  let orig = args[2];
  let destindex;
  for (let i=3; i < args.length; i++){
		if (args[i] == "to") {
			destindex = i+1;
			break;
		}
		orig += "+" + args[i];
  }
  
  if (destindex >= args.length){
		cb("Error: Formatting error, missing keyword \"to\"");
		return;
  }
  
  let dest = args[destindex];
  for (let i=destindex; i < args.length; i++){
		dest += "+" + args[i];
  }
  
  getDirections(orig, dest, cb);
};
