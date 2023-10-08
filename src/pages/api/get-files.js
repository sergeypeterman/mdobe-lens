import { RESULT_COLUMNS } from "@/components/constants";

const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";
const apikey = process.env.API_KEY;

export default async function handler(req, res) {
  const {
    query: { search, offset },
  } = req;

  let userRequest = JSON.parse(search);

  let searchUrl = calculateFetchUrl(userRequest, offset);
  console.log(`API: Search = ${searchUrl}`);

  try {
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
    res.status(200).json({ response: result });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
}

const calculateFetchUrl = (userRequest, offset) => {
  let columns = RESULT_COLUMNS;

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