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

    //console.log("test connection with test-db-sql");
    const testDb = await fetch(`${process.env.HOST_ADDRESS}/api/post-files`, {
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
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
}
