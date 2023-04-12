import { createCompactDataParser } from "../src/CompactDataToJS";

const parser = createCompactDataParser();

import { expect } from "chai";

describe("TypeScript Interpreter", () => {
  it("should be able to parse a simple CompactData string to a string", () => {
    expect(parser.parse("a=b")).to.deep.equal({ a: "b" });
  });

  it("should be able to parse a simple CompactData map to an object", () => {
    expect(parser.parse("a(b=c)")).to.deep.equal({ a: { b: "c" } });
  });

  it("should be able to parse a simple CompactData array to an array", () => {
    expect(parser.parse("[a=b]")).to.deep.equal([{ a: "b" }]);
  });

  it("should be able to parse telephone numbers to strings instead of numbers", () => {
    expect(parser.parse("a=+441270123456")).to.deep.equal({ a: "+441270123456" });
  });

  it("should be able to parse zero-prefixed numbers to strings instead of numbers", () => {
    expect(parser.parse("a=0441270123456")).to.deep.equal({ a: "0441270123456" });
  });

  it("should be able to parse integers", () => {
    expect(parser.parse("a=441270123456")).to.deep.equal({ a: 441270123456 });
  });

  it("should be able to parse floats", () => {
    expect(parser.parse("a=4.41270123E6")).to.deep.equal({ a: 4412701.23 });
  });

  it("should be able to throw an Error on invalid CompactData", () => {
    expect(parser.parse.bind("a;b")).to.throw();
  });

  it("should be able to parse brace-strings - 1", () => {
    expect(parser.parse("a={4.41270123E6}")).to.deep.equal({ a: "{4.41270123E6}" });
  });

  it("should be able to parse brace-strings - 2", () => {
    expect(parser.parse("a={4.41~}270123E6}")).to.deep.equal({ a: "{4.41}270123E6}" });
  });

  it("should be able to parse brace-strings - 3", () => {
    expect(parser.parse("a={4.41\\}270123E6}")).to.deep.equal({ a: "{4.41}270123E6}" });
  });

  it("should be able to parse brace-strings - 4", () => {
    expect(parser.parse("a={{{{4.41270123E6}")).to.deep.equal({ a: "{{{{4.41270123E6}" });
  });

  it("should be able to parse brace-strings - 5", () => {
    expect(
      parser.parse(
        "a={?(typeof($n.l)=='array' {['record' $n.l[2]] ['locale' $locale] ['settings' $settings]~} -> process_contacts {['record' $n.l.c] ['locale' $locale] ['settings' $settings]~} -> process_contacts) }"
      )
    ).to.deep.equal({
      a: "{?(typeof($n.l)=='array' {['record' $n.l[2]] ['locale' $locale] ['settings' $settings]} -> process_contacts {['record' $n.l.c] ['locale' $locale] ['settings' $settings]} -> process_contacts) }",
    });
  });

  it("should be able to parse brace-strings - 6", () => {
    expect(parser.parse("a={}")).to.deep.equal({ a: "{}" });
  });

  it("should be able to parse brace-strings - 7", () => {
    expect(parser.parse("a={~~}")).to.deep.equal({ a: "{~}" });
  });

  it("should be able to parse brace-strings - 8", () => {
    expect(parser.parse("a={\\\\}")).to.deep.equal({ a: "{\\}" });
  });

  it("should be able to throw an Error on invalid brace-strings - 1", () => {
    expect(parser.parse.bind("a={;b=c")).to.throw();
  });
});
