// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const adobeUrl =
  "https://stock.adobe.io/Rest/Media/1/Search/Files?locale=en_US&amp;search_parameters[words]=unicorns";
const apikey = process.env.API_KEY;

export default async function handler(req, res) {
  try {
    const respn = await fetch(adobeUrl, {
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
