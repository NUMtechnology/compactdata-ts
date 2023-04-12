import { expect } from "chai";
import compactData from "../src/";

describe("BasicUse Tests", () => {
  it("can parse basic CompactData", () => {
    const cdString = "x=1";
    const jsObj = { x: 1 };

    expect(compactData.parse(cdString)).to.deep.equal(jsObj);
  });
  it("can parse stringify a basic object", () => {
    const cdString = "x=1";
    const jsObj = { x: 1 };

    expect(compactData.stringify(jsObj)).to.equal(cdString);
  });
});
