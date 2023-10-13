const path = require('node:path');
require("dotenv").config({ path: path.resolve(`../../../.env.local`) }); //{ path: `I:/Dev/mdobe-lens/.env.local` }
console.log(process.env.LOCAL_PATH);
console.log(path.resolve(`../../../.env.local`));
const {
  RESULT_COLUMNS,
  GENTECH,
  ORDER,
  AGE,
  CONTENT_TYPES,
} = require(`${process.env.LOCAL_PATH}/src/pages/test-db/db-constants.js`);

const request = {
  order: {
    name: "order",
    type: "radio",
    caption: "Order by:",
    values: ORDER,
    selected: 0,
  },
  content: {
    name: "media_type_id",
    type: "checkbox",
    caption: "Content types:",
    values: CONTENT_TYPES,
    selected: [true, true, true, true, false, false, false],
    any: true,
  },
  age: {
    name: "age",
    type: "radio",
    caption: "Uploaded in the last:",
    values: AGE,
    selected: 2,
  },
  query: "",
  creatorId: {
    name: "creator_id",
    type: "number",
    values: 0,
    caption: "Author id:",
    min: 0,
    max: 999999999, // xxx.xxx.xxx
  },
  limit: {
    name: "limit",
    type: "number",
    values: 100,
    caption: "Per page:",
    min: 1,
    max: 100,
  },
  gentech: {
    name: "gentech",
    type: "radio",
    caption: "AI generated:",
    values: GENTECH,
    selected: 0,
  },
};

const mysql = require("mysql2/promise");
console.log("connecting worker");
const itemsPerRequest = 100;

//***** Stills, 10000, 2y *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 4; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [true, true, true, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 10000);
//***** Stills, 10000, 2y *****/

//***** Stills, 1000, 1w *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 0; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [true, true, true, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 1000);
//***** Stills, 1000, 1w *****/

//***** Stills, 10000, 6m *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 2; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [true, true, true, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 1000);
//***** Stills, 10000, 6m *****/

//***** Video, 1000, 1m *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 1; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [false, false, false, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 1000);
//***** Video, 1000, 1m *****/

//***** Video, 1000, 6m *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 2; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [false, false, false, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 1000);
//***** Video, 1000, 6m *****/

//***** Video, 10000, 2y *****/
request.limit.values = itemsPerRequest;
request.order.selected = 4; //"relevance", "creation", "featured", "undiscovered", "nb_downloads
request.age.selected = 4; //[age]=1w, 1m, 6m, 1y, 2y, 3y
request.content.selected = [false, false, false, true, false, false, false];
// "photo", "illustration", "vector", "video", "UNKNOWN", "3d", "template"
connectAndHarvest(request, 10000);
//***** Video, 10000, 2y *****/

async function connectAndHarvest(requestOrig, amount) {
  let request = JSON.parse(JSON.stringify(requestOrig));
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });
  const apikey = process.env.API_KEY;

  console.log("connecting done");

  try {
    for (let i = 0; i < amount / itemsPerRequest; i++) {
      let offset = i * itemsPerRequest;
      const currArray = await getAdobeArray(apikey, offset, request);
      //console.log(currArray);

      const writeResult = await writeIntoDB(currArray, db);
      console.log(writeResult);
      console.log(`${(i + 1) * itemsPerRequest} assets processed`);
    }
  } catch (err) {
    console.log(err);
  }

  db.end();
  return;
}

//settings
//request.limit.values = 1;
//const amount = 10000;
//eo settings

// functions:
const calculateFetchUrl = (userRequest, offset) => {
  let columns = RESULT_COLUMNS;
  const adobeUrl =
    "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";

  let responseColumns = columns.reduce((acc, item) => {
    acc += `&result_columns[]=${item}`;
    return acc;
  }, "");

  console.log("\nAdobe API request parameters:");
  console.log(`Query: ${userRequest.query ? userRequest.query : "EMPTY"}`);

  let ageInd = userRequest.age.selected; //index of selected age
  let age = userRequest.age.values[ageInd].name; //selected age
  console.log(`Age: ${age}`);

  let orderInd = userRequest.order.selected; //index of selected order
  let order = userRequest.order.values[orderInd].name; //selected order
  console.log(`Order by: ${order}`);

  let gentechID = userRequest.gentech.selected;
  let gentech = userRequest.gentech.values[gentechID].name;
  //console.log(``);

  let author =
    userRequest.creatorId.values <= 0
      ? ``
      : `&search_parameters[creator_id]=${userRequest.creatorId.values}`;
  author && console.log(`Creator_id: ${author}`);

  let limit =
    userRequest.limit.values > 100
      ? `&search_parameters[limit]=100`
      : userRequest.limit.values <= 0
      ? `&search_parameters[limit]=32`
      : `&search_parameters[limit]=${userRequest.limit.values}`;
  console.log(`Items per request: ${userRequest.limit.values}`);

  let types = "";
  let contentTypes = userRequest.content.values.reduce((acc, elem, ind) => {
    //console.log(`content_type:${elem.title}, ${userRequest.content.selected[ind]}`);
    acc += userRequest.content.selected[ind]
      ? `&search_parameters[filters][content_type:${elem.title}]=1`
      : "";
    types += userRequest.content.selected[ind] ? `${elem.title} ` : "";
    return acc;
  }, "");
  //console.log(`userRequest.ai: ${gentech}`);
  console.log(`Content types: ${types}\n`);

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

async function getAdobeArray(apikey, offset, request) {
  let searchUrl = calculateFetchUrl(request, offset);
  //console.log(`API: Search = ${searchUrl}`);

  const respn = await fetch(searchUrl, {
    method: "GET",
    headers: {
      "x-api-key": apikey,
      "X-Product": "MySampleApp/1.0",
    },
  });
  const result = await respn.json();

  if (!respn.ok) {
    console.log(respn);
    throw new Error(`API Response Error: ${respn.statusText}`);
  }

  return result;
}

async function writeIntoDB(adobeArray, db) {
  /*   let added = 0;
  let warnings = 0;
  let lastItem;
  let assetsAlreadyExists = 0;
  let assetsAdded = 0; */

  const result = {
    assets: { added: 0, exists: 0 },
    assetsSales: { added: 0, warnings: 0 },
    lastItem: 0,
  };
  try {
    for (let item of adobeArray.files) {
      //writing into the assets table
      const newQuery = makeInsertIgnoreAssetsQuery(item, "assets");
      const [reply] = await db.query(newQuery);
      let { warningStatus, affectedRows } = reply;
      if (warningStatus && !affectedRows) {
        //console.log(`item ${item.id} already exists in the assets DB`);
        result.assets.exists++;
      } else if (affectedRows) {
        //console.log(`item ${item.id} added to the assets DB`);
        result.assets.added++;
      }

      //writing into the assets_sales table
      const newSalesQuery = makeInsertAssetSalesQuery(item, "assets_sales");

      //there are 2 items in reply' array, taking the first, omitting the second
      const [salesFilterReply] = await db.query(newSalesQuery.filter);
      result.lastItem = item.id;
      if (salesFilterReply.length > 0) {
        //console.log(`already logged sales for the id ${item.id} today`);
      } else {
        const [salesReply] = await db.query(newSalesQuery.query);
        const { warningStatus, affectedRows } = salesReply;
        if (warningStatus && !affectedRows) {
          console.log(`not added, warning: ${salesReply.info}`);
          result.assetsSales.warnings++;
        } else if (affectedRows) {
          //console.log(`inserted with id=${salesReply.insertId}`);
          result.assetsSales.added++;
        }
      }
    }
  } catch (err) {
    console.log(err);
    return { result: err };
  }

  return result;
}

Date.prototype.removeTimeFromDate = function () {
  let dateWithoutTime = new Date(this.setHours(0, 0, 0, 0));
  return dateWithoutTime;
};

Boolean.prototype.to01 = function () {
  return this ? 1 : 0;
};

Array.prototype.reduceArrayOfObjectsToArrayOfValues = function (keyName) {
  let newKeywords = this.reduce((acc, item) => {
    let escapedValue = string_cleanJSON_preStringify(item[keyName]);
    item[keyName] = escapedValue;
    acc.push(escapedValue);
    return acc;
  }, []);
  return newKeywords;
};

function makeInsertAssetSalesQuery(data, table) {
  let today = new Date();
  //console.log(today.toJSON().slice(0, 10));

  let newQuery = `INSERT INTO ${table}`;
  newQuery += `(asset_id, nb_downloads, date_recorded) VALUES ('`;
  newQuery += `${data.id}', '`;
  newQuery += `${data.nb_downloads}', `;
  newQuery += `STR_TO_DATE('${today.toJSON().slice(0, 10)}','%Y-%m-%d'))`;

  let filter =
    `SELECT * FROM ${table} ` +
    `WHERE DATE_FORMAT(date_recorded,'%Y %m %d')` +
    `=DATE_FORMAT('${today.toJSON()}','%Y %m %d')` +
    ` AND asset_id = '${data.id}'`;

  return { query: newQuery, filter: filter };
}

function makeInsertIgnoreAssetsQuery(dataOrig, table) {
  let data = JSON.parse(JSON.stringify(dataOrig));

  let newKeywords = data.keywords.reduceArrayOfObjectsToArrayOfValues("name");

  const content_type_str = CONTENT_TYPES[data.media_type_id - 1].title;

  let newTitle = string_cleanJSON_preStringify(data.title);
  let newCountry = string_cleanJSON_preStringify(data.country_name);
  let newCreatorName = string_cleanJSON_preStringify(data.creator_name);

  data.title = newTitle;
  data.country_name = newCountry;
  data.creator_name = newCreatorName;

  let newQuery =
    `INSERT IGNORE INTO ` +
    `${table}` +
    `(id, title, keywords, creation_date, allFields, creator_id, has_releases, media_type_id, is_gentech, content_type_str) VALUES ('` +
    `${data.id}', '` +
    `${data.title}', '` +
    `${JSON.stringify(newKeywords)}', '` +
    `${data.creation_date}', '` +
    ` ${JSON.stringify(data)}', '` +
    ` ${data.creator_id}', '` +
    ` ${data.has_releases}', '` +
    ` ${data.media_type_id}', '` +
    ` ${data.is_gentech.to01()}', '` +
    ` ${content_type_str}')`;

  let cleanedQuery = string_cleanJSON_to_query(newQuery);
  //console.log(cleanedQuery);
  return cleanedQuery;
}

function string_cleanJSON_preStringify(str) {
  if (!str.replace) return str;

  str = str.replace(/'/g, "\\'"); //escape all at least ' once
  str = str.replace(/"/g, '\\"'); //escape all at least " once

  str = str.replace(/[\t\r\n\f]/g, ""); // remove problematic escape characters

  if (str.charAt(str.length - 1) == "\\") str += " "; // add blank space at the end if \ is last character - for example: {"var":"\"} would be problematic

  return str;
}

function string_cleanJSON_to_query(str) {
  str = str.replace(/(\\)+\\/g, "\\"); // replace all \ more than 1 in a row, to be just 1 ( \\ -> gets escaped again when it's processed to just \)

  str = str.replace(/(\\)+"/g, '\\\\\\"'); // replace all \" more than 1 (ex \\\") - i don't know why \\\\\\ - this seem to work in my case, might need to alter based on str manipulations before insert

  str = str.replace(/(\\)+'/g, "\\'"); // i don't know why \\ - this seem to work in my case, might need to alter based on str manipulations before insert

  str = str.replace(/(\\)+t/g, "t"); // same process as above but with problematic escape characters

  str = str.replace(/(\\)+r/g, "r");
  str = str.replace(/(\\)+n/g, "n");
  str = str.replace(/(\\)+f/g, "f");

  return str;
}
