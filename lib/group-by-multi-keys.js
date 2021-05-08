const generateRandomString = require("./generate-random-string");

module.exports = (records, keysGeneratorFn) => {
  if (!Array.isArray(records) || typeof keysGeneratorFn !== "function") {
    throw new TypeError(`Invalid arguments`);
  }

  const groupKeySize = getAppropriateKeySize(records.length);

  // Records belong to the same group if they share at least one key

  // A single record can have many keys, and may appear multiple
  //   times in keysToGroups
  const keysToGroups = {};

  // A `groupKey` is a random alnum string that functions as an
  //   identifier for a group
  // A single record can have at most one groupKey, and will share
  //   that groupKey with other records belonging to the same group
  // A single record will only appear once in groupKeysToGroups
  const groupKeysToGroups = {};

  records.forEach((record) => {
    // list of groups that will have to be merged, because the keys
    //   of the current record overlap with those of at least one record in
    //   each of them
    const applicableGroupKeys = new Set();

    let keys = keysGeneratorFn(record);
    if (!Array.isArray(keys)) keys = [keys];

    keys.forEach((key) => {
      if (!keysToGroups[key]) {
        keysToGroups[key] = [];
      } else {
        // all records in an existing group will have the same groupKey
        applicableGroupKeys.add(keysToGroups[key][0].__groupKey);
      }

      keysToGroups[key].push(record);
    });

    if (applicableGroupKeys.size > 0) {
      // all records associated with any of the applicableGroupKeys
      //   belong to the same group, so we merge them, picking one groupKey
      //   to be the survivor
      const applicableGroupKeysArr = Array.from(applicableGroupKeys);
      const survivor = applicableGroupKeysArr[0];

      const discarded = applicableGroupKeysArr.slice(1);
      discarded.forEach((deprecatedGroupKey) => {
        // update __groupKey attribute for all associated records
        groupKeysToGroups[deprecatedGroupKey].forEach(
          (u) => (u.__groupKey = survivor)
        );

        // move associated records into group of survivor groupKey
        groupKeysToGroups[survivor] = groupKeysToGroups[survivor].concat(
          groupKeysToGroups[deprecatedGroupKey]
        );

        // discard key
        delete groupKeysToGroups[deprecatedGroupKey];
      });

      record.__groupKey = survivor;
      groupKeysToGroups[survivor].push(record);
    } else {
      // if no groupKey has been assigned to this record until now,
      //   it means this record belongs to a group we're encountering for the first
      //   time
      let groupKey;
      do {
        groupKey = generateRandomString(groupKeySize);
      } while (groupKeysToGroups[groupKey]);
      record.__groupKey = groupKey;
      groupKeysToGroups[groupKey] = [record];
    }
  });

  records.forEach((record) => delete record.__groupKey);
  return Object.values(groupKeysToGroups);
};

const allowed = "abcdefghijklmnopqrstuvwxyz0123456789";

// The key space must be large enough to avoid frequent collisions
// key size `k` is calculated as `nAllowedChars^k > 4 x nRecords^2`
function getAppropriateKeySize(nRecords) {
  return Math.ceil((2 * Math.log(2 * nRecords)) / Math.log(allowed.length));
}
