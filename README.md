# CompactData library written in TypeScript

```javascript
const CompactData = require("@numtechnology/compactdata");

console.log(CompactData.parse("foo=bar"));
//-> { foo: "bar" }
console.log(CompactData.stringify({ foo: "bar" }))
//-> foo=bar
```