const { getAppropriateKeySize } = require("./common");
const generateRandomString = require("./generate-random-string");

module.exports = (records, getKeys) => {
  if (!Array.isArray(records) || typeof getKeys !== "function") {
    throw new TypeError(`Invalid arguments`);
  }

  // this function must add a temporary attribute to each record,
  //   being careful not to overwrite existing attributes
  const groupKeyAttrName = getAppropriateKeyAttrName(records);

  // keys should be long enough that we don't have collision trouble
  //   when generating them
  const groupKeySize = getAppropriateKeySize(
    records.length,
    generateRandomString.lowercase
  );

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

    let keys = getKeys(record);
    if (!Array.isArray(keys)) keys = [keys];

    keys.forEach((key) => {
      if (!keysToGroups[key]) {
        keysToGroups[key] = [];
      } else {
        // all records in an existing group will have the same groupKey
        applicableGroupKeys.add(keysToGroups[key][0][groupKeyAttrName]);
      }

      keysToGroups[key].push(record);
    });

    if (applicableGroupKeys.size > 0) {
      // all records associated with any of the applicableGroupKeys
      //   belong to the same group, so if they are currently in different groups,
      //   we merge those groups, picking one group and groupKey to be the survivor
      const applicableGroupKeysArr = Array.from(applicableGroupKeys);
      const survivor = applicableGroupKeysArr[0];

      const discarded = applicableGroupKeysArr.slice(1);
      discarded.forEach((deprecatedGroupKey) => {
        // update __groupKey attribute for all associated records
        groupKeysToGroups[deprecatedGroupKey].forEach(
          (u) => (u[groupKeyAttrName] = survivor)
        );

        // move associated records into group of survivor groupKey
        groupKeysToGroups[survivor] = groupKeysToGroups[survivor].concat(
          groupKeysToGroups[deprecatedGroupKey]
        );

        // discard key
        delete groupKeysToGroups[deprecatedGroupKey];
      });

      record[groupKeyAttrName] = survivor;
      groupKeysToGroups[survivor].push(record);
    } else {
      // if no groupKey has been assigned to this record until now,
      //   it means this record belongs to a group we're encountering for the first
      //   time
      let groupKey;
      do {
        groupKey = generateRandomString(groupKeySize, { lowercase: true });
      } while (groupKeysToGroups[groupKey]);
      record[groupKeyAttrName] = groupKey;
      groupKeysToGroups[groupKey] = [record];
    }
  });

  records.forEach((record) => delete record[groupKeyAttrName]);
  return Object.values(groupKeysToGroups);
};

function getAppropriateKeyAttrName(records) {
  if (!records.find((r) => "__groupKey" in r)) return "__groupKey";

  let attrNameCandidate;
  do {
    const randStr = generateRandomString(10, { lowercase: true });
    attrNameCandidate = `__groupKey__${randStr}`;
  } while (records.find((r) => attrNameCandidate in r));

  return attrNameCandidate;
}
