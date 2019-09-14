module.exports.execute = command => { // TODO: pagination
  let args = command.split(/\s+/);
  if (args.length < 2) {
    return "Error: no Wikipedia page title specified";
  }
  let title = args[1];
  return "TODO";
};
