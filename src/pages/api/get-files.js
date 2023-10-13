import { RESULT_COLUMNS } from "@/components/constants";
import { calculateFetchUrl } from "@/components/functions";

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

    //don't try to post to db, if env variable HOST_ADDRESS is undefined
    const hostAdress = process.env.HOST_ADDRESS;
    alert(`host address is incorrect, write to DB skipped`);
    
    if (hostAdress) {
      const testDb = await fetch(`${hostAdress}/api/post-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });
      console.log(`Sent to DB API`);

      if (!testDb.ok) {
        console.log(`Fetch error`);
        console.log(testDb);
      }
    } else {
      console.log(`host address is incorrect, write to DB skipped`);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
}
