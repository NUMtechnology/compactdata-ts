import { expect } from "chai";
import { createJSToCompactData } from "../src/JSToCompactData";

describe("Graves Tests", () => {
  it("can escape graves", () => {
    const jsToCompactData = createJSToCompactData();

    const compactdataString = 'key="~`value~`"';
    const jsObj = { key: "`value`" };

    expect(jsToCompactData.objectToCompactData(jsObj)).equal(compactdataString);
  });
});
