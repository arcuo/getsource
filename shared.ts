export function getCurrentFileFromStack() {
  const stack = new Error().stack;
  const lines = stack?.split("\n");
  const fileLine = lines?.at(-1);
  const file = fileLine?.match(/\((.*):\d+:\d+\)$/)?.[1];
  return file;
}