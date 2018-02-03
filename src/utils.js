let expressionCount = 0;
let parameterCount = 0;

export function expressionToString(f) {
  if (f.name) {
    return f.name;
  }

  const matches = f.toString().match(/^(?:\s*\(?(?:.*?)*\)?\s*?=>\s*){?([\s\S]*)}?$/);
  if (!matches) {
    return `F_${(++expressionCount)}(X_${(++parameterCount)})`;
  }

  const firstPass = matches[1];
  const secondPass =
    (firstPass.match(/{/g) || []).length === (firstPass.match(/}/g) || []).length - 1 ?
      firstPass.slice(0, firstPass.lastIndexOf('}')) :
      firstPass

  return secondPass;
};
