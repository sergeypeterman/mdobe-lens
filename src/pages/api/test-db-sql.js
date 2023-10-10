import { CONTENT_TYPES } from "@/components/constants";

const mysql = require("mysql2/promise");

export default async function testConnection(req, res) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });

  let writeIntoDB;

  if (req.method === "POST") {
    writeIntoDB = req.body;
    console.log(
      `Array received, id of the first one is: ${writeIntoDB.files[0].id}`
    );
    try {
      writeIntoDB.files.map(async (item) => {
        const newQuery = makeInsertAssetsQuery(item, "assets");
        const [reply] = await db.query(newQuery);
        const { warningStatus, affectedRows } = reply;
        console.log(warningStatus, affectedRows);
        if (warningStatus && !affectedRows) {
          console.log(`item ${item.id} already exists in the assets DB`);
        } else if (affectedRows) {
          console.log(`item ${item.id} recorded`);
        }
      });
      db.end();
    } catch {
      console.log(err);
      res.status(500).json({ message: err });
      db.end();
    }
  }

  try {
    //console.log("reached");
    //const dateToday = new Date().toJSON();
    //const [rows, fields] = await db.query(
    //  `SELECT * FROM assets WHERE DATE_FORMAT(creation_date,'%Y %m %d')=DATE_FORMAT('${dateToday}','%Y %m %d')`
    //); 

    if (rows.length > 0) {
      res.status(200).json({ message: rows });
      console.log(rows);
    } else {
      res.status(404).json({ message: "not found" });
      console.log("not found");
    }
  } catch (err) {
    //console.log("catched");
    console.log(err);
    res.status(500).json({ message: err });
    db.end();
  }
}

Date.prototype.removeTimeFromDate = function () {
  let dateWithoutTime = new Date(this.setHours(0, 0, 0, 0));
  return dateWithoutTime;
};

Boolean.prototype.to01 = function () {
  return this ? 1 : 0;
};

function makeInsertAssetsQuery(data, table) {
  let newID = data.id;
  let newKeywords = data.keywords.reduce((acc, item) => {
    acc.push(item.name);
    return acc;
  }, []);

  const content_type_str = CONTENT_TYPES[data.media_type_id - 1].title;

  let newQuery = `INSERT IGNORE INTO `;
  newQuery += `${table}`;
  newQuery += `(id, title, keywords, creation_date, allFields, creator_id, has_releases, 
    media_type_id, is_gentech, content_type_str) VALUES ('`;
  newQuery += `${newID}', '`;
  newQuery += `${data.title}', '`;
  newQuery += `${JSON.stringify(newKeywords)}', '`;
  newQuery += `${data.creation_date}', '`;
  newQuery += ` ${JSON.stringify(data)}', '`;
  newQuery += ` ${data.creator_id}', '`;
  newQuery += ` ${data.has_releases}', '`;
  newQuery += ` ${data.media_type_id}', '`;
  newQuery += ` ${data.is_gentech.to01()}', '`;
  newQuery += ` ${content_type_str}')`;
  return newQuery;
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
