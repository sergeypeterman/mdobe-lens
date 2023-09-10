export function checkIntegerRange(input, min, max) {
  //console.log(`checkIntegerRange: ${input}`);
  //console.log(Number('242340-393333333333334-23432423490234920348094853458e983280673405123134523046834905768902'));
  if (Number.isInteger(input)) {
    if (input > max) {
      return { intInRange: false, message: `too large, ${max} max` };
    } else if (input < min) {
      return { intInRange: false, message: `too small, min ${min}` };
    } else {
      return { intInRange: true, message: `correct` };
    }
  } else {
    return { intInRange: false, message: `${input} is not integer` };
  }
}

export const compareStringify = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const compareAndManageStorage = (
  objectToCompare,
  constantToCompare,
  storageVarName,
  setterFunction
) => {
  let sameStructure = compareStringify(
    Object.keys(objectToCompare),
    Object.keys(constantToCompare)
  );

  if (sameStructure) {
    console.log(`reading ${storageVarName}`);
    setterFunction(objectToCompare);
  } else {
    console.log(`removing ${storageVarName}`);
    localStorage.removeItem(`${storageVarName}`);
    setterFunction(constantToCompare);
  }
};