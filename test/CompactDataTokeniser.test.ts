import { expect } from "chai";
import { tokeniser } from "../src/CompactDataTokeniser";

describe("CompactDataTokeniser", () => {
  it("Can tokenise a simple double-quoted CompactData string", () => {
    const tokens = tokeniser('a="b"');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("a");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('"b"');
  });

  it("Can tokenise a simple grave-quoted CompactData string", () => {
    const tokens = tokeniser("a=`b`");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("a");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("`b`");
  });

  it("Can tokenise a simple unquoted CompactData string", () => {
    const tokens = tokeniser("hello=world");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("hello");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("world");
  });

  it("Can tokenise a CompactData map", () => {
    const tokens = tokeniser("(a=`b`)");
    expect(tokens.length).to.equal(5);
    expect(tokens[0].value).to.equal("(");
    expect(tokens[1].value).to.equal("a");
    expect(tokens[2].value).to.equal("=");
    expect(tokens[3].value).to.equal("`b`");
    expect(tokens[4].value).to.equal(")");
  });

  it("Can tokenise a CompactData array", () => {
    const tokens = tokeniser("[a=`b`]");
    expect(tokens.length).to.equal(5);
    expect(tokens[0].value).to.equal("[");
    expect(tokens[1].value).to.equal("a");
    expect(tokens[2].value).to.equal("=");
    expect(tokens[3].value).to.equal("`b`");
    expect(tokens[4].value).to.equal("]");
  });

  it("Can tokenise a CompactData map with pairs and arrays and maps", () => {
    const tokens = tokeniser('(hello=[world];array = [ one ; "two";`three`])');
    expect(tokens.length).to.equal(17);
    expect(tokens[0].value).to.equal("(");
    expect(tokens[1].value).to.equal("hello");
    expect(tokens[2].value).to.equal("=");
    expect(tokens[3].value).to.equal("[");
    expect(tokens[4].value).to.equal("world");
    expect(tokens[5].value).to.equal("]");
    expect(tokens[6].value).to.equal(";");
    expect(tokens[7].value).to.equal("array");
    expect(tokens[8].value).to.equal("=");
    expect(tokens[9].value).to.equal("[");
    expect(tokens[10].value).to.equal("one");
    expect(tokens[11].value).to.equal(";");
    expect(tokens[12].value).to.equal('"two"');
    expect(tokens[13].value).to.equal(";");
    expect(tokens[14].value).to.equal("`three`");
    expect(tokens[15].value).to.equal("]");
    expect(tokens[16].value).to.equal(")");
  });

  it("Can tokenise a CompactData pair with a float value", () => {
    const tokens = tokeniser("age=-99.9e+55");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("age");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal(-9.99e56);
  });

  it("Can tokenise a CompactData pair with an int value", () => {
    const tokens = tokeniser("age=100");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("age");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal(100);
  });

  it("Can tokenise a CompactData pair with a null value", () => {
    const tokens = tokeniser("x=null");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal(null);
  });

  it("Can tokenise a CompactData pair with a true value", () => {
    const tokens = tokeniser("x=true");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal(true);
  });

  it("Can tokenise a CompactData pair with a false value", () => {
    const tokens = tokeniser("x=false");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal(false);
  });

  it("Can tokenise a CompactData pair with double quotes inside graves", () => {
    const tokens = tokeniser('x=`The string "hello" is quoted`');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('`The string "hello" is quoted`');
  });

  it("Can tokenise a CompactData pair with graves inside double quotes", () => {
    const tokens = tokeniser('x="The string `hello` is quoted"');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('"The string `hello` is quoted"');
  });

  it("Can tokenise a CompactData pair with double quotes inside double quotes - 1", () => {
    const tokens = tokeniser('x="The string \\"hello\\" is quoted"');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('"The string \\"hello\\" is quoted"');
  });

  it("Can tokenise a CompactData pair with double quotes inside double quotes - 2", () => {
    const tokens = tokeniser('x="The string ~"hello~" is quoted"');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('"The string ~"hello~" is quoted"');
  });

  it("Can tokenise a CompactData pair with graves inside graves - 1", () => {
    const tokens = tokeniser("x=`The string \\`hello\\` is quoted`");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("`The string \\`hello\\` is quoted`");
  });

  it("Can tokenise a CompactData pair with graves inside graves - 2", () => {
    const tokens = tokeniser("x=`The string ~`hello~` is quoted`");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("`The string ~`hello~` is quoted`");
  });

  it("Can tokenise a CompactData pair with a unicode value", () => {
    const tokens = tokeniser("x=The string \\u0041 has unicode");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("x");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("The string \\u0041 has unicode");
  });

  it("Can tokenise a CompactData pair with embedded graves", () => {
    const tokens = tokeniser('test="xx `missing` xx "');
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("test");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal('"xx `missing` xx "');
  });

  it("Can tokenise a CompactData pair with a number that should be treated as a string - 1", () => {
    const tokens = tokeniser("test=+44");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("test");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("+44");
  });

  it("Can tokenise a CompactData String with escapes", () => {
    const tokens = tokeniser("test=hello :\\), Goodbye :~)");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("test");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("hello :\\), Goodbye :~)");
  });

  it("Can tokenise a CompactData pair with a number that should be treated as a string - 2", () => {
    const tokens = tokeniser("test=0123");
    expect(tokens.length).to.equal(3);
    expect(tokens[0].value).to.equal("test");
    expect(tokens[1].value).to.equal("=");
    expect(tokens[2].value).to.equal("0123");
  });
});
