import * as converter from 'units-converter';

function convertUnits(convType, value, unitOrig, unitNew, cb){
	let newVal = converter[convType](value).from(unitOrig).to(unitNew).value;
	cb(value + " " + unitOrig + " = " + unitNew + " " + newVal);
}

module.exports.execute = (command, cb) => {
  let args = command.split(/\s+/);
  if (args.length < 3) {
		cb("Error: Value and units not specified");
		return;
  }
  if (isNaN(args[2])) {
		cb("Error: First argument must be a numerical value");
  }
  let conType = args[1];
  if(!(converter.hasOwnProperty(conType))){
	cb("Error: Conversion type does not exist");
  }
  
  let val = +args[2];
  let uOrig = args[3];
  let uNew;
  
  if (args[4] == "to") {
		uNew = args[5];
  } else {
		uNew = args[4];
  }
  if(!(converter[conType].hasOwnProperty(uOrig)) || !(converter[conType].hasOwnProperty(uNew))){
	cb("Error: Units do not match conversion type");
  }
  
  convertUnits(conType, val, uOrig, uNew, cb);
};