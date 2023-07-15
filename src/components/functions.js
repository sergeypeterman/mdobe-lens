export function checkIntegerRange(input, min, max) {
    console.log(`checkIntegerRange: ${input}`);
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