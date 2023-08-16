const interpolate = require("./interpolate-string");

describe("interpolate", () => {
  it("replaces placeholders in supplied template with provided values", () => {
    expect(interpolate("Hi, I'm {{name}}", { name: "Anirudh" })).toEqual(
      "Hi, I'm Anirudh"
    );

    expect(
      interpolate("Hi, I'm {{name}}. I'm {{age}} years old.", {
        name: "Anirudh",
        age: 30,
      })
    ).toEqual("Hi, I'm Anirudh. I'm 30 years old.");

    expect(
      interpolate(
        "Hi, I'm {{name}}. I'm {{age}} years old. Are you older or younger than {{age}}?",
        { name: "Anirudh", age: 30 }
      )
    ).toEqual(
      "Hi, I'm Anirudh. I'm 30 years old. Are you older or younger than 30?"
    );
  });

  it("throws when no value is supplied for a placeholder if opts.throwIfDataMissing is set", () => {
    // does not throw because opts.throwIfDataMissing is not set
    expect(interpolate("Hi, I'm {{name}}", {})).toEqual("Hi, I'm ");
    expect(interpolate("Hi, I'm {{name}}", { name: undefined })).toEqual(
      "Hi, I'm "
    );
    expect(interpolate("Hi, I'm {{name}}", { name: null })).toEqual("Hi, I'm ");

    // throws
    expect(() =>
      interpolate("Hi, I'm {{name}}", {}, { throwIfDataMissing: true })
    ).toThrow();
    expect(() =>
      interpolate(
        "Hi, I'm {{name}}",
        { name: undefined },
        { throwIfDataMissing: true }
      )
    ).toThrow();
    expect(() =>
      interpolate(
        "Hi, I'm {{name}}",
        { name: null },
        { throwIfDataMissing: true }
      )
    ).toThrow();
  });
});
