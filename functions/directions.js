function getDirections(origin, destination){
	let geocode, text, url;
	url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + destination + "&key=AIzaSyA0TF0woj5xZedSgnQGKy348BquHvvxraQ";
	$.getJSON(url, function(data) {
		geocode = $.parseJSON(data);
	});
	text = "Directions from " + geocode.routes[0].legs[0].start_address + " to " + geocode.routes[0].legs[0].end_address +
			"\nTotal Trip Distance: " + geocode.routes[0].legs[0].distance.text +
			"\nTotal Trip Duration: " + geocode.routes[0].legs[0].duration.text;
			
	geocode.routes[0].legs[0].steps.forEach(function(item, index){
		let instruction = item.html_instructions.replace("\u003cb\u003e", "");
		instruction = item.html_instructions.replace("\u003c/b\u003e", "");
		instruction = item.html_instructions.replace("\u003cdiv style=\"font-size:0.9em\"\u003e", "\n");
		instruction = item.html_instructions.replace("\u003c/div\u003e", "");
		text += "\n" + (index+1).toString() + ". " + instruction;
	});
	
	return text;
}

module.exports.execute = command => {
  let args = command.split(/\s+/);
  if (args.length < 2) {
	return "Error: Origin and destination not specified";
  }
  if (args[1] != "from") {
	return "Error: Formatting error, missing keyword \"from\"";
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
	return "Error: Formatting error, missing keyword \"to\"";
  }
  
  let dest = args[destindex];
  for (let i=destindex; i < args.length; i++){
	dest += "+" + args[i];
  }
  
  return getDirections(orig, dest);
};