const lookup = require('country-code-lookup');

module.exports = function getIso2(input) {
  if (input.toLowerCase() == 'great britain') {
    input = 'United Kingdom';
  }
  let countryInfo = lookup.byCountry(input); // first try country name
  if (countryInfo !== null) {
    return countryInfo.iso2;
  }
  try {
    countryInfo = lookup.byIso(input); // then try iso code (2/3/number)
  } catch (e) {
    countryInfo = null;
  }
  if (countryInfo !== null) {
    return countryInfo.iso2;
  }
  countryInfo = lookup.byInternet(input); // then try internet code
  if (countryInfo !== null) {
    return countryInfo.iso2;
  }
  countryInfo = lookup.byFips(input); // then try FIPS, whatever that is
  if (countryInfo !== null) {
    return countryInfo.iso2;
  }
  return null; // give up
}
