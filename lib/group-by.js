const { getAppropriateKeySize } = require("./common");
const generateRandomString = require("./generate-random-string");

module.exports = (elems, groupFn = () => false) => {
  const elemIdsToGroupIds = {};
  const keySize = getAppropriateKeySize(
    elems.length,
    "abcdefghijklmnopqrstuvwxyz"
  );
  elems.forEach(
    (elem) =>
      (elemIdsToGroupIds[elem.id] = generateRandomString(keySize, {
        lowercase: true,
      }))
  );

  for (let i = 0; i < elems.length; i++) {
    for (let j = i + 1; j < elems.length; j++) {
      const elemsBelongInSameGroup = groupFn(elems[i], elems[j]);
      if (elemsBelongInSameGroup) {
        elemIdsToGroupIds[elems[j].id] = elemIdsToGroupIds[elems[i].id];
      }
    }
  }

  const elemsById = elems.reduce((acc, el) => (acc[el.id] = el) && acc, {});
  return Object.values(
    Object.entries(elemIdsToGroupIds).reduce((acc, [elemId, groupId]) => {
      if (!acc[groupId]) acc[groupId] = [];
      acc[groupId].push(elemsById[elemId]);
      return acc;
    }, {})
  );
};
