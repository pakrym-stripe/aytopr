import { addEntry, hasVersion, updateDate, updateSection } from "./changelog";

test("Adds entry to a section", () => {
  expect(
    addEntry(
      `
## 1.2.3 - date here

* entry 1
* entry 2
### Subsection

## 1.2.2 - date here
`,
      "1.2.3",
      "* new entry"
    )
  ).toBe(`
## 1.2.3 - date here

* entry 1
* entry 2
### Subsection
* new entry

## 1.2.2 - date here
`);

  expect(
    addEntry(
      `
## 1.2.3 - date here
## 1.2.2 - date here
`,
      "1.2.3",
      "* new entry"
    )
  ).toBe(`
## 1.2.3 - date here
* new entry

## 1.2.2 - date here
`);
});


test("Sets content of a section", () => {
  expect(
    updateSection(
      `
## 1.2.3 - date here

* entry 1
* entry 2
### Subsection

## 1.2.2 - date here
`,
      "1.2.3",
      "* new entry"
    )
  ).toBe(`
## 1.2.3 - date here

* new entry

## 1.2.2 - date here
`);

});


test("Checks section exists", () => {
  expect(
    hasVersion(
      `
## 1.2.3 - date here
## 1.2.2 - date here
`,
      "1.2.3"
    )
  ).toBe(true);

  expect(
    hasVersion(
      `
## 1.2.3 - date here
## 1.2.2 - date here
`,
      "1.2.5"
    )
  ).toBe(false);
});

test("Updates date", () => {
    expect(
      addEntry(
        `
## 1.2.3 - date here

* entry 1
* entry 2

## 1.2.2 - date here
  `,
        "1.2.3",
        "* new entry"
      )
    ).toBe(`
## 1.2.3 - date here

* entry 1
* entry 2
* new entry

## 1.2.2 - date here
  `);
  
    expect(
        updateDate(
        `
## 1.2.4 - date here
## 1.2.3 - date here
## 1.2.2 - date here
`,
        "1.2.3",
        "new date"
      )
    ).toBe(`
## 1.2.4 - date here
## 1.2.3 - new date
## 1.2.2 - date here
`);
  });
  