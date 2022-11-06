const formatMobileNumber = require("./lib/format-mobile-number");
const generateRandomString = require("./lib/generate-random-string");
const groupBy = require("./lib/group-by");
const groupByMultiKeys = require("./lib/group-by-multi-keys");

function buildArr(n, generatorFn = (x) => x) {
  const ret = [];
  for (let i = 0; i < n; i++) ret.push(generatorFn(i));
  return ret;
}

module.exports = {
  buildArr,
  formatMobileNumber,
  generateRandomString,
  groupBy,
  groupByMultiKeys,
};
