import { describe, it, expect } from "bun:test";
import { getSourceSync } from ".";
import { getSourceSyncSWC } from './index.swc';

function testFunction() {
  console.log("test");
  console.log("test2");
}

describe("getSourceSync", () => {
  it("should return the source code of a function", () => {
    const source = getSourceSync(testFunction);
    expect(source).toBeDefined();
    expect(source?.functionCode).toBe("function testFunction() {\n  console.log(\"test\");\n  console.log(\"test2\");\n}");
    expect(source?.functionName).toBe("testFunction")
  });

  it("should return undefined if function isn't in the file", () =>  {
    const source = getSourceSync("testFunctionWrong");
    expect(source).toBeUndefined();
  })

});

describe("getSourceSyncSWC", () => {
  it("should return the source code of a function", () => {
    const source = getSourceSyncSWC(testFunction);
    expect(source).toBeDefined();
    expect(source?.functionCode).toBe("function testFunction() {\n    console.log(\"test\");\n    console.log(\"test2\");\n}\n");
    expect(source?.functionBodyCode).toBe("console.log(\"test\");\nconsole.log(\"test2\");\n");
    expect(source?.functionName).toBe("testFunction")
  });
  
  it("should return undefined if function isn't in the file", () =>  {
    const source = getSourceSyncSWC("testFunctionWrong");
    expect(source).toBeUndefined();
  })
});
