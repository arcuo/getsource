import {
  createSourceFile,
  ScriptTarget,
  SyntaxKind,
  type FunctionDeclaration,
  type Node,
} from "typescript";
import { readFileSync } from "fs";
import { getCurrentFileFromStack } from "./shared";

/**
 * Get the source code of a function as a string
 * @param fn function or name of the function
 * @param parseOpts options to the swc parser
 */
export function getSourceSync(fn: string | Function) {
  const functionName = fn instanceof Function ? fn.name : fn;
  const filePath = getCurrentFileFromStack();

  if (!filePath) throw new Error("Could not get current file");

  const code = readFileSync(filePath, "utf-8");
  const ast = createSourceFile(filePath, code, {
    languageVersion: ScriptTarget.Latest,
  });

  function findFunctionNodeTraverse(
    node: Node
  ): FunctionDeclaration | undefined {
    if (node.kind === SyntaxKind.FunctionDeclaration) {
      const functionNode = node as FunctionDeclaration;
      if (functionNode.name?.getText(ast) === functionName) {
        return functionNode;
      }
    }

    for (let child of node.getChildren(ast)) {
      const result = findFunctionNodeTraverse(child);
      if (result) return result;
    }
  }

  const functionNode = findFunctionNodeTraverse(ast);
  if (!functionNode) return;

  const functionCode = functionNode.getText(ast);
  return {
    functionName,
    functionCode,
  };
}
