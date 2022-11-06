// When generating randomized keys for each element of an array,
//   the key space must be large enough to avoid frequent collisions
//   during generation
// key size `k` is calculated as `nAllowedChars^k > 4 x nRecords^2`
function getAppropriateKeySize(nRecords, allowedChars) {
  return Math.ceil(
    (2 * Math.log(2 * nRecords)) / Math.log(allowedChars.length)
  );
}

module.exports = { getAppropriateKeySize };
