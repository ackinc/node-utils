const format = require("./format-mobile-number");

test("throws error if mobileNumber invalid", () => {
  expect(() => format("123456789")).toThrow();
});

test("throws error if mobileNumber provided without country code", () => {
  expect(() => format("1234567890")).toThrow();
});

test("supports a variety of mobileNumber input formats", () => {
  expect(() => format("+11234567890")).not.toThrow();
  expect(() => format("+1 123 456 7890")).not.toThrow();
  expect(() => format("+1 (123) 456-7890")).not.toThrow();
  expect(() => format(11234567890)).not.toThrow();
});

test("mobile numbers can be formatted in various ways", () => {
  const mobile = "+1 123 456 7890";
  expect(format(mobile)).toEqual("+11234567890");
  expect(format(mobile, "+CASR")).toEqual("+11234567890");
  expect(format(mobile, "+C A S R")).toEqual("+1 123 456 7890");
  expect(format(mobile, "+C (A) S-R")).toEqual("+1 (123) 456-7890");
});
