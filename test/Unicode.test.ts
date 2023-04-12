import { expect } from "chai";
import { createStringEscapeReplacer } from "../src/Utils";

describe("Unicode", () => {
  it("should be able to convert unicode correctly with slashes", () => {
    expect(createStringEscapeReplacer().replace("\\u0022b\\u0022")).to.equal('"b"');
  });

  it("should be able to convert unicode correctly with tilde", () => {
    expect(createStringEscapeReplacer().replace("~u0022b~u0022")).to.equal('"b"');
  });

  it("should be able to convert unicode correctly", () => {
    expect(createStringEscapeReplacer().replace("\\u022b\\u022b")).to.equal("ȫȫ");
  });

  it("should be able to convert unicode correctly for UTF-16 format encoding - 1", () => {
    expect(
      createStringEscapeReplacer().replace(
        "~u00ae~ud83d~ude00~ud83d~udc41~ufe0f~u200d~ud83d~udde8~ufe0f0hello~u01c5~ud83d~udd25"
      )
    ).to.equal("®😀👁️‍🗨️0helloǅ🔥");
  });

  it("should be able to convert unicode correctly for UTF-16 format encoding - 2", () => {
    expect(createStringEscapeReplacer().replace("~ua3300")).to.equal("ꌰ0");
  });

  it("should be able to convert unicode correctly for UTF-16 format encoding ignoring escaped sequences - 3", () => {
    expect(
      createStringEscapeReplacer().replace(
        "\\~u00ae~ud83d~ude00~ud83d~udc41~ufe0f~u200d~ud83d~udde8~ufe0f0hello~u01c5\\~ud83d\\~udd250000"
      )
    ).to.equal("~u00ae😀👁️‍🗨️0helloǅ~ud83d~udd250000");
  });
});
