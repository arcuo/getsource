# getsource

Display the source code of a function in a TypeScript file.

## Usage

```ts
import { getSourceSync } from "getsource";

function testFunction() {
  console.log("test");
  console.log("test2");
}

const source = getSourceSync(testFunction);
console.log(source?.functionCode);
console.log(source?.functionBodyCode);
console.log(source?.functionName);
```

## License

MIT
