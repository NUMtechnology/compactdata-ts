import { expect } from "chai";
import { parseCompactData } from "../src/CompactDataParser";

const bad = [
  ";",
  "[",
  "]",
  "(",
  ")",
  "=",
  "[[]",
  "[]]",
  "(()",
  "())",
  "[;]",
  "(;)",
  "()()",
  "[][]",
  "(a=b;)",
  "[a=b;]",
  "[];;",
  "();;",
  "a;b",
  "a=`b`c`d`",
  "a=b`c`d",
];
describe("CompactDataParser bad grammar", () => {
  it("Can report bad grammar", () => {
    const compactdatas = bad.map((s) => {
      try {
        const result = parseCompactData(s);
        console.error(`Unexpected success for : ${s}`);
        return result;
      } catch (e) {
        const err = e as Error;
        console.error(err.message);
      }
      return null;
    });
    const nonNullResults = compactdatas.filter((v) => v !== null);
    if (nonNullResults.length > 0) {
      console.log(JSON.stringify(nonNullResults));
    }
    expect(nonNullResults.length).to.equal(0);
  });
});
