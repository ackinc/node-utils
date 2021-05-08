const groupByMultiKeys = require("./group-by-multi-keys");

describe("groupByMultiKeys", () => {
  const records = [
    {
      id: 0,
      firstName: "Anirudh",
      lastName: "Nimmagadda",
      age: 29,
      emails: ["anirudh1@example.com"],
    },
    {
      id: 1,
      firstName: "Anirudh",
      emails: ["anirudh2@example.com"],
    },
    {
      id: 2,
      firstName: "Ani",
      lastName: "N",
      emails: ["anirudh1@example.com", "anirudh2@example.com"],
    },
    {
      id: 3,
      firstName: "John",
      lastName: "Smith",
      age: 42,
      emails: ["jsmith1@example.com"],
    },
    {
      id: 4,
      firstName: "John",
      lastName: "S",
      emails: ["jsmith1@example.com", "jsmith2@example.com"],
    },
    {
      id: 5,
      firstName: "James",
      lastName: "R",
      emails: ["james@example.com"],
    },
  ];

  it("throws when supplied anything but an array and a function", () => {
    expect(() => groupByMultiKeys()).toThrow(TypeError);
    expect(() => groupByMultiKeys([])).toThrow(TypeError);
    expect(() => groupByMultiKeys([], {})).toThrow(TypeError);
  });

  it("groups records by generated key", () => {
    const grouped = groupByMultiKeys(records, (r) => r.firstName);

    expect(
      grouped.map((records) => records.map(({ id }) => id))
    ).toIncludeSameMembers([[0, 1], [2], [3, 4], [5]]);
  });

  test("if multiple keys are generated per record, it groups records when *any* of their generated keys match", () => {
    // records with the same email belong to the same person
    const grouped = groupByMultiKeys(records, (r) => r.emails);

    expect(
      grouped.map((records) => records.map(({ id }) => id))
    ).toIncludeSameMembers([[0, 1, 2], [3, 4], [5]]);
  });

  it("works fine when records have multiple overlapping keys", () => {
    const anotherUser = {
      id: 6,
      firstName: "John",
      emails: [
        "jsmith1@example.com",
        "jsmith2@example.com",
        "jsmith3@example.com",
        "jsmith4@example.com",
      ],
    };

    const allRecords = records.concat(anotherUser);

    const grouped = groupByMultiKeys(allRecords, (user) => user.emails);
    expect(
      grouped.map((records) => records.map(({ id }) => id))
    ).toIncludeSameMembers([[0, 1, 2], [3, 4, 6], [5]]);
  });
});
