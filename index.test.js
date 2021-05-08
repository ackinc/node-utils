const { generateRandomString: rsg } = require(".");

it("throws a TypeError if specified length is not a whole number", () => {
  expect(() => rsg()).toThrow(TypeError);
  expect(() => rsg(undefined)).toThrow(TypeError);
  expect(() => rsg(null)).toThrow(TypeError);

  expect(() => rsg(true)).toThrow(TypeError);
  expect(() => rsg(false)).toThrow(TypeError);

  expect(() => rsg(-Infinity)).toThrow(TypeError);
  expect(() => rsg(-1)).toThrow(TypeError);
  expect(() => rsg(1.3)).toThrow(TypeError);

  expect(() => rsg("1")).toThrow(TypeError);
  expect(() => rsg("a")).toThrow(TypeError);

  expect(() => rsg([])).toThrow(TypeError);
  expect(() => rsg({})).toThrow(TypeError);
});

test("generated string is of specified length", () => {
  expect(rsg(0).length).toBe(0);
  expect(rsg(5).length).toBe(5);
  expect(rsg(1e5).length).toBe(1e5);
});

test("generated string satisfies specified constraints", () => {
  expect(rsg(16, { lowercase: true })).toMatch(/^[a-z]+$/);
  expect(rsg(16, { uppercase: true })).toMatch(/^[A-Z]+$/);
  expect(rsg(16, { digits: true })).toMatch(/^\d+$/);

  // to ensure every allowed symbol is covered
  const symbolsCovered = new Set();
  do {
    const s = rsg(16, { symbols: true });
    expect(s).toMatch(charlistToRegex(rsg.symbols));
    s.split("").forEach((sym) => symbolsCovered.add(sym));
  } while (symbolsCovered.size < rsg.symbols.length);

  expect(rsg(16, { lowercase: true, uppercase: true })).toMatch(/^[A-Za-z]+$/);
  expect(rsg(16, { lowercase: true, uppercase: true, digits: true })).toMatch(
    /^[A-Za-z0-9]+$/
  );
  expect(rsg(16, { lowercase: true, digits: true, symbols: true })).toMatch(
    new RegExp(`^[a-z0-9${regexEscape(rsg.symbols)}]+$`)
  );
});

function charlistToRegex(chars) {
  const escaped = regexEscape(chars);
  return new RegExp(`^[${escaped}]+$`);
}

function regexEscape(str) {
  let tmp = str.replace(/\\/g, "\\\\");
  if (tmp[0] === "^") tmp = tmp.replace(/\^/, "\\^");
  tmp = tmp.replace(/]/g, "\\]");
  tmp = tmp.replace(/-/g, "\\-");
  return tmp;
}
