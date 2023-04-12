import { expect } from "chai";
import { createUnicodeEscaper } from "../src/UnicodeEscaper";

const escaper = createUnicodeEscaper();

describe("UnicodeEscaper", () => {
  it("should be able to escape unicode characters - 001", () => {
    expect(escaper.escape("ABC \n\t\f\b\n®😀👁️‍🗨️ǅ🔥")).equal("ABC \\n\\t\\f\\b\\n®😀👁️‍🗨️ǅ🔥");
  });

  it("should be able to escape unicode characters - 002", () => {
    expect(escaper.escape('{"key"="hello\bworld"}')).equal('{"key"="hello\\bworld"}');
  });

  it("should be able to escape unicode characters - 003", () => {
    expect(escaper.escape('{"key"="hello\nworld"}')).equal('{"key"="hello\\nworld"}');
  });

  it("should be able to escape unicode characters - 004", () => {
    expect(escaper.escape('{"key"="hello\tworld"}')).equal('{"key"="hello\\tworld"}');
  });

  it("should be able to escape unicode characters - 005", () => {
    expect(escaper.escape('{"key"="hello\rworld"}')).equal('{"key"="hello\\rworld"}');
  });

  it("should be able to escape unicode characters - 006", () => {
    expect(escaper.escape('{"key"="hello\fworld"}')).equal('{"key"="hello\\fworld"}');
  });

  it("should be able to escape unicode characters - 007", () => {
    expect(escaper.escape('{"key"="Claims - £3,000, £7,000 and £15,000"}')).equal(
      '{"key"="Claims - £3,000, £7,000 and £15,000"}'
    );
  });

  it("should be able to escape unicode characters - 008", () => {
    expect(escaper.escape('{"key"="ꌰ0"}')).equal('{"key"="ꌰ0"}');
  });

  it("should be able to escape unicode characters - 009", () => {
    expect(escaper.escape('{"key"="💔0"}')).equal('{"key"="💔0"}');
  });

  it("should be able to escape unicode characters - 010", () => {
    expect(escaper.escape('{"key"="🐶0"}')).equal('{"key"="🐶0"}');
  });

  it("should be able to convert escaped unicode characters - 1", () => {
    expect(escaper.escape('{"key"="~ua3300"}')).equal('{"key"="~~ua3300"}');
  });

  it("should be able to convert vertical tabs correctly - 1", () => {
    expect(escaper.escape('{"key"="\v"}')).equal('{"key"="~u000B"}');
  });

  it("should be able to convert vertical tabs correctly - 2", () => {
    expect(escaper.escape('{"key"="\\v"}')).equal('{"key"="\\v"}');
  });
});
