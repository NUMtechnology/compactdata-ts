import { expect } from "chai";
import { escapeGraves } from "../src/StringifyUtils";

describe("UtilFuncs Tests", () => {
  it("001", () => {
    expect(escapeGraves(null)).equal(null);
  });

  it("002", () => {
    expect(escapeGraves("")).equal("");
  });

  it("003", () => {
    expect(escapeGraves("hello")).equal("hello");
  });

  it("004", () => {
    expect(escapeGraves("`hello`")).equal("~`hello~`");
  });

  it("005", () => {
    expect(escapeGraves("``")).equal("~`~`");
  });
});
