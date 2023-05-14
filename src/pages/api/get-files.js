const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US";
const apikey = process.env.API_KEY;

export default async function handler(req, res) {
  let search_params = ["[words]"];
  let columns = [
    "thumbnail_url",
    "thumbnail_width",
    "thumbnail_height",
    "nb_downloads",
    "creation_date",
    "nb_views",
  ];
  let params = [
    { search_parameters: search_params },
    { result_columns: columns },
  ];
  let sParams = "&search_parameters";
  /* result_columns[]=is_licensed&result_columns[]=creation_date
   search_parameters[words]=dog big happy*/

   let responseColumns = columns.reduce((acc,item)=>{
    acc += `&result_columns[]=${item}`;
    return acc;
   },"");
   //console.log(responseColumns);

  const {
    query: { search },
  } = req;
  console.log(search);

  let modifier = "&search_parameters" + "[words]=" + search + responseColumns;
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
