require("dotenv").config({ path: "I:/Dev/mdobe-lens/.env.local" });

const mysql = require("mysql2/promise");
console.log("connecting worker");
async function connectAndHarvest() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });
  const apikey = process.env.API_KEY;

  request.limit.values = 1;
  offset = 0;
  //amount = 10000;

  console.log("connecting done");

  try {
    const currArray = await getAdobeArray(apikey);
    console.log(currArray);
  } catch (err) {
    console.log(err);
  }

  db.end();
  return;
}
connectAndHarvest();

//variables:
const CONTENT_TYPES = [
  { name: 1, title: "photo", enabled: true },
  { name: 2, title: "illustration", enabled: true },
  { name: 3, title: "vector", enabled: true },
  { name: 4, title: "video", enabled: true },
  { name: 5, title: "UNKNOWN", enabled: false },
  { name: 6, title: "3d", enabled: true },
  { name: 7, title: "template", enabled: true },
];

const ORDER = [
  { name: "relevance", title: "Relevance", enabled: true },
  { name: "creation", title: "Creation", enabled: true },
  { name: "featured", title: "Featured", enabled: true },
  { name: "undiscovered", title: "Undiscovered", enabled: true },
  { name: "nb_downloads", title: "Downloads", enabled: true },
];
const GENTECH = [
  { name: "all", title: "All", enabled: true },
  { name: "true", title: "AI generated", enabled: true },
  { name: "false", title: "non-AI generated", enabled: true },
];
//[age]=1w, 1m, 6m, 1y, 2y, 3y
const AGE = [
  { name: "1w", title: "1 week", enabled: true },
  { name: "1m", title: "1 month", enabled: true },
  { name: "6m", title: "6 months", enabled: true },
  { name: "1y", title: "1 year", enabled: true },
  { name: "2y", title: "2 years", enabled: true },
  { name: "3y", title: "3 years", enabled: true },
  { name: "", title: "any", enabled: true },
];
const RESULT_COLUMNS = [
  "id",
  "thumbnail_url",
  "thumbnail_width",
  "thumbnail_height",
  "nb_downloads",
  "creation_date",
  "country_name",
  "creator_name",
  "creator_id",
  "width",
  "height",
  "has_releases",
  "keywords",
  "title",
  "media_type_id",
  "premium_level_id",
  "video_small_preview_url",
  "video_small_preview_width",
  "video_small_preview_height",
  "video_small_preview_content_length",
  "video_small_preview_content_type",
  "nb_results",
  "details_url",
  "is_gentech",
];

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
//settings
request.limit.values = 1;
offset = 0;
const amount = 10000;
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

async function getAdobeArray(apikey) {
  let searchUrl = calculateFetchUrl(request, offset);
  console.log(`API: Search = ${searchUrl}`);

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
