const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";
const apikey = process.env.API_KEY;

export default async function handler(req, res) {
  let columns = [
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
  ];

  let responseColumns = columns.reduce((acc, item) => {
    acc += `&result_columns[]=${item}`;
    return acc;
  }, "");

  const {
    query: { search },
  } = req;

  let userRequest = JSON.parse(search);

  let ageInd = userRequest.age.selected; //index of selected age
  let age = userRequest.age.values[ageInd].name; //selected age

  let orderInd = userRequest.order.selected; //index of selected order
  let order = userRequest.order.values[orderInd].name; //selected order

  let author =
    userRequest.creatorId.values <= 0
      ? ``
      : `&search_parameters[creator_id]=${userRequest.creatorId.values}`;

  //"&search_parameters[filters][content_type:photo]=1"+
  let contentTypes = userRequest.content.values.reduce((acc, elem, ind) => {
    acc += userRequest.content.selected[ind]
      ? `&search_parameters[filters][content_type:${elem.title}]=1`
      : "";
    return acc;
  }, "");
  //console.log(contentTypes);

  let modifier =
    `&search_parameters[filters][age]=${age}` +
    `&search_parameters[order]=${order}` +
    `&search_parameters[thumbnail_size]=240` +
    `&search_parameters[words]=${userRequest.query}` +
    `${author}` +
    responseColumns +
    contentTypes;
  let searchUrl = adobeUrl + modifier;

  //console.log(`API: Search = ${searchUrl}`);

  try {
    const respn = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "x-api-key": apikey,
        "X-Product": "MySampleApp/1.0",
      },
    });
    const result = await respn.json();
    //console.log(result);
    if (!respn.ok) {
      throw new Error(respn.message);
    }
    res.status(200).json({ response: result });
  } catch (err) {
    res.status(400).json(err.message);
  }
}
