function getDirections(origin, dest){
	origin.replaces(" ", "+");
	dest.replaces(" ", "+");
	var geocode, text, url;
	url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + origin + "&destination=" + dest + "&key=AIzaSyA0TF0woj5xZedSgnQGKy348BquHvvxraQ";
	$.getJSON(url, function(data) {
		geocode = $.parseJSON(data);
	});
	text = "Directions from " + geocode.routes[0].legs[0].start_address + " to " + geocode.routes[0].legs[0].end_address +
			"\nTotal Trip Distance: " + geocode.routes[0].legs[0].distance.text +
			"\nTotal Trip Duration: " + geocode.routes[0].legs[0].duration.text;
			
	geocode.routes[0].legs[0].steps.forEach(function(item, index){
		text += "\n" + (index+1).toString() + ". " + item.html_instructions;
	});
	
	return text;
}