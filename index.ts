import { parseSync, printSync, type FunctionDeclaration } from "@swc/core";
import { readFileSync } from "fs";

function getCurrentFileFromStack() {
  const stack = new Error().stack;
  const lines = stack?.split("\n");
  const fileLine = lines?.at(-1);
  const file = fileLine?.match(/\((.*):\d+:\d+\)$/)?.[1];
  return file;
}

/**
 * Get the source code of a function as a string
 * @param fn function or name of the function
 * @param parseOpts options to the swc parser
 */
export function getSourceSync(
  fn: string | Function,
  parseOpts?: Partial<Parameters<typeof parseSync>[1]>
) {
  const functionName = fn instanceof Function ? fn.name : fn;
  const file = getCurrentFileFromStack();

  if (!file) throw new Error("Could not get current file");

  const source = readFileSync(file, "utf-8");
  const ast = parseSync(source, {
    syntax: "typescript",
    tsx: true,
    ...parseOpts,
  });

  function findFunctionNodeTraverse(
    node: any
  ): FunctionDeclaration | undefined {
    if (!node || typeof node !== "object") return;

    if (
      node.type === "FunctionDeclaration" &&
      node.identifier?.value === functionName
    ) {
      return node;
    }

    for (const key in node) {
      if (node[key] && typeof node[key] === "object") {
        const result = findFunctionNodeTraverse(node[key]);
        if (result) return result;
      }
    }
  }

  let functionNode = findFunctionNodeTraverse(ast.body);
  if (!functionNode) return;

  const functionCode = printSync({ ...ast, body: [functionNode] }).code;
  const functionBodyCode = printSync({
    ...ast,
    body: [...functionNode.body!.stmts],
  }).code;

  return {
    functionName,
    functionCode,
    functionBodyCode,
  };
}
