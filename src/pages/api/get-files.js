const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";
const apikey = process.env.API_KEY;

export default async function handler(req, res) {
  //let search_params = ["[words]","[order]","[filters]"];
  let columns = [
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
  ];
  /* let params = [
    { search_parameters: search_params },
    { result_columns: columns },
  ];
  let sParams = "&search_parameters"; */

  let responseColumns = columns.reduce((acc, item) => {
    acc += `&result_columns[]=${item}`;
    return acc;
  }, "");

  const {
    query: { search },
  } = req;
  console.log(`API: Search = ${search}`);

  //age: 1w, 1m, 6m, 1y, 2y, 3y

  let modifier =
    "&search_parameters[filters][age]=1m" +
    "&search_parameters[order]=nb_downloads" +
    "&search_parameters[thumbnail_size]=240" +
    "&search_parameters" +
    "[words]=" +
    search +
    responseColumns;
  let searchUrl = adobeUrl + modifier;

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
