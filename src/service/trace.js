

export function callStack(){
  const err = new Error();
  const stack = err.stack
    .split("\n")
    .filter(line =>
      (line.indexOf('internal/modules/') === -1) &&
      (line.indexOf('at callStack') === -1) &&
      (line.indexOf('at callPoint') === -1) &&
      (line.indexOf('at callPointId ') === -1)
    )
    .map(
      line => line
        .replace(/^\s+at\s/gi,'')
        .replace("\(.+?\)",'')
    )
    .slice(1);
  return stack;
}
export function callPoint () {
  return callStack()[1]||"undefined";
}