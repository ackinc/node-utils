const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "1234567890";
const symbols = "~`!@#$%^&*()_-+={[}]|\\:;\"'<,>.?/";

function generateRandomString(nChars, constraints = {}) {
  if (typeof nChars !== "number" || nChars < 0 || nChars % 1 !== 0) {
    throw new TypeError(`nChars must be a whole number`);
  }

  const retval = [];
  let allowed = "";

  if (Object.keys(constraints).length === 0) {
    allowed = lowercase + uppercase + digits + symbols;
  } else {
    if (constraints.lowercase) allowed += lowercase;
    if (constraints.uppercase) allowed += uppercase;
    if (constraints.digits) allowed += digits;
    if (constraints.symbols) allowed += symbols;
  }

  if (allowed.length === 0) {
    if (nChars === 0) return "";
    throw new Error(`Cannot generate a string if no characters are allowed!`);
  }

  for (let i = 0; i < nChars; i++) {
    retval.push(allowed[Math.floor(allowed.length * Math.random())]);
  }
  return retval.join("");
}

generateRandomString.lowercase = lowercase;
generateRandomString.uppercase = uppercase;
generateRandomString.digits = digits;
generateRandomString.symbols = symbols;

module.exports = { generateRandomString };
