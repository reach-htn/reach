const converter = require('units-converter');

module.exports.execute = (command, cb) => {
  let args = command.split(/\s+/);
  if (args.length < 3) {
		cb("Error: Value and units not specified");
		return;
  }
  if (isNaN(args[2])) {
    cb("Error: First argument must be a numerical value");
    return;
  }
  let conType = args[1];
  if (!(converter.hasOwnProperty(conType))) {
    cb("Error: Conversion type does not exist");
    return;
  }
  
  let val = +args[2];
  let uOrig = args[3];
  let uNew;
  
  if (args[4] == "to") {
		uNew = args[5];
  } else {
		uNew = args[4];
  }
  
  try {
    let newVal = converter[conType](val).from(uOrig).to(uNew).value;
    cb(val + " " + uOrig + " = " + newVal + " " + uNew);
  } catch (e) {
    console.log(e);
    cb(`Error: could not convert from ${uOrig} to ${uNew} using ${conType}.`);
  }
};
