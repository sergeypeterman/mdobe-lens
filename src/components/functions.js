import { RESULT_COLUMNS } from "./constants";

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

export const calculateFetchUrl = (userRequest, offset) => {
  let columns = RESULT_COLUMNS;
  const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";

  let responseColumns = columns.reduce((acc, item) => {
    acc += `&result_columns[]=${item}`;
    return acc;
  }, "");

  let ageInd = userRequest.age.selected; //index of selected age
  let age = userRequest.age.values[ageInd].name; //selected age

  let orderInd = userRequest.order.selected; //index of selected order
  let order = userRequest.order.values[orderInd].name; //selected order

  let gentechID = userRequest.gentech.selected;
  let gentech = userRequest.gentech.values[gentechID].name;

  let author =
    userRequest.creatorId.values <= 0
      ? ``
      : `&search_parameters[creator_id]=${userRequest.creatorId.values}`;

  let limit =
    userRequest.limit.values > 100
      ? `&search_parameters[limit]=100`
      : userRequest.limit.values <= 0
      ? `&search_parameters[limit]=32`
      : `&search_parameters[limit]=${userRequest.limit.values}`;

  let contentTypes = userRequest.content.values.reduce((acc, elem, ind) => {
    //console.log(`content_type:${elem.title}, ${userRequest.content.selected[ind]}`);
    acc += userRequest.content.selected[ind]
      ? `&search_parameters[filters][content_type:${elem.title}]=1`
      : "";
    return acc;
  }, "");
  //console.log(`userRequest.ai: ${gentech}`);

  let modifier =
    `&search_parameters[filters][age]=${age}` +
    //`&search_parameters[filters][gentech]=${gentech}` +
    `&search_parameters[order]=${order}` +
    `&search_parameters[thumbnail_size]=240` +
    `&search_parameters[words]=${userRequest.query}` +
    `${author}` +
    `${limit}` +
    `&search_parameters[offset]=${offset}` +
    responseColumns +
    contentTypes;
  let searchUrl = adobeUrl + modifier;

  return searchUrl;
};

export function string_cleanJSON_preStringify(str) {
  if (!str.replace) return str;

  str = str.replace(/'/g, "\\'"); //escape all at least ' once
  str = str.replace(/"/g, '\\"'); //escape all at least " once

  str = str.replace(/[\t\r\n\f]/g, ""); // remove problematic escape characters

  if (str.charAt(str.length - 1) == "\\") str += " "; // add blank space at the end if \ is last character - for example: {"var":"\"} would be problematic

  return str;
}

export function string_cleanJSON_to_query(str) {
  str = str.replace(/(\\)+\\/g, "\\"); // replace all \ more than 1 in a row, to be just 1 ( \\ -> gets escaped again when it's processed to just \)

  str = str.replace(/(\\)+"/g, '\\\\\\"'); // replace all \" more than 1 (ex \\\") - i don't know why \\\\\\ - this seem to work in my case, might need to alter based on str manipulations before insert

  str = str.replace(/(\\)+'/g, "\\'"); // i don't know why \\ - this seem to work in my case, might need to alter based on str manipulations before insert

  str = str.replace(/(\\)+t/g, "t"); // same process as above but with problematic escape characters

  str = str.replace(/(\\)+r/g, "r");
  str = str.replace(/(\\)+n/g, "n");
  str = str.replace(/(\\)+f/g, "f");

  return str;
}