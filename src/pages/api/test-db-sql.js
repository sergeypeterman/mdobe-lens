const mysql = require("mysql2/promise");

export default async function testConnection(req, res) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });
  try {
    let newCreator =
      testData.creator_id; /* + Math.floor(Math.random() * 1000) */
    let newKeywords = testData.keywords.reduce((acc, item) => {
      acc.push(item.name);
      return acc;
    }, []);

    let newQuery = `INSERT INTO test(id, title, keywords, creation_date, allFields) VALUES ('${newCreator}', '${
      testData.title
    }', '${JSON.stringify(newKeywords)}', '${
      testData.creation_date
    }', '${JSON.stringify(testData)}')`;

    console.log(`writing test_data with id=${newCreator}`);
    console.log(newQuery);

    await db.query(newQuery);
    console.log("after await");
    const [rows, fields] = await db.query("SELECT * FROM test");

    db.end();
    res.status(200).json({ message: rows });
  } catch (err) {
    //console.log("catched");
    //console.log(err);
    res.status(500).json({ message: err });
  }
}

const testData = {
  id: 631424599,
  thumbnail_url:
    "https://t4.ftcdn.net/jpg/06/31/42/45/240_F_631424599_1pAtOr69tajSBbm1pJismai2PKvpUpGd.jpg",
  thumbnail_width: 480,
  thumbnail_height: 240,
  nb_downloads: 832,
  creation_date: "2023-08-05 10:46:58.681653",
  country_name: "Thailand",
  creator_name: "korkeng",
  creator_id: 206137286,
  width: 5477,
  height: 2739,
  has_releases: 0,
  keywords: [
    {
      name: "abstract",
    },
    {
      name: "dot",
    },
    {
      name: "wave",
    },
  ],
  title:
    "Flowing dots particles wave pattern 3D curve halftone black gradient curve shape isolated on white background. Vector in concept of technology, science, music, modern.",
  media_type_id: 3,
  premium_level_id: 0,
  video_small_preview_url: null,
  video_small_preview_width: null,
  video_small_preview_height: null,
  video_small_preview_content_length: null,
  video_small_preview_content_type: null,
  details_url:
    "https://stock.adobe.com/631424599?as_channel=affiliate&as_source=api&as_content=e501d686e7d14a75a1b2a769bea7b700",
  is_gentech: false,
};
