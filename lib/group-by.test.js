const groupBy = require("./group-by");

describe("groupBy", () => {
  const records = [
    { id: 1, firstName: "Anirudh", lastName: "Nimmagadda" },
    { id: 2, firstName: "Sneha", lastName: "Nimmagadda" },
    { id: 3, firstName: "Surendra", lastName: "Nimmagadda" },
    { id: 4, firstName: "Anuradha", lastName: "Arcot" },
    { id: 5, firstName: "Sameera", lastName: null },
  ];

  it("groups elems together according to supplied group fn", () => {
    expect(
      groupBy(
        [1, 2, 3, 4, 5].map((id) => ({ id })),
        ({ id: x }, { id: y }) => x % 2 === y % 2
      )
    ).toIncludeSameMembers([
      [1, 3, 5].map((id) => ({ id })),
      [2, 4].map((id) => ({ id })),
    ]);

    for (const key of Object.keys(records[0])) {
      const groups = groupBy(records, (a, b) => a[key] === b[key]);
      expect(groups.length).toBe(new Set(records.map((el) => el[key])).size);
    }
  });

  it("returns an empty array if supplied an empty array", () => {
    const groups = groupBy([], () => true);
    expect(groups.length).toBe(0);
  });

  it("puts every element into a separate group if a groupFn is not provided", () => {
    const groups = groupBy(records);
    expect(groups.length).toBe(records.length);
  });
});
