import { CONTENT_TYPES } from "@/components/constants";
import {
  string_cleanJSON_preStringify,
  string_cleanJSON_to_query,
} from "@/components/functions";

const mysql = require("mysql2/promise");

export default async function postToStockDB(req, res) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });

  //writing to assets DB
  if (req.method === "POST") {
    let writeIntoDB = req.body;
    console.log(
      `Array received, id of the first one is: ${writeIntoDB.files[0].id}`
    );
    try {
      //writeIntoDB.files.map(async (item) => {
      for (let item of writeIntoDB.files) {
        //writing into the assets table
        const newQuery = makeInsertIgnoreAssetsQuery(item, "assets");
        const [reply] = await db.query(newQuery);
        let { warningStatus, affectedRows } = reply;
        if (warningStatus && !affectedRows) {
          console.log(`item ${item.id} already exists in the assets DB`);
        } else if (affectedRows) {
          console.log(`item ${item.id} added to the assets DB`);
        }

        //writing into the assets_sales table
        const newSalesQuery = makeInsertAssetSalesQuery(item, "assets_sales");

        //there are 2 items in reply' array, taking the first, omitting the second
        const [salesFilterReply] = await db.query(newSalesQuery.filter);

        if (salesFilterReply.length > 0) {
          console.log(`already logged sales for the id ${item.id} today`);
        } else {
          const [salesReply] = await db.query(newSalesQuery.query);
          const { warningStatus, affectedRows } = salesReply;
          if (warningStatus && !affectedRows) {
            console.log(`not added, warning: ${salesReply.info}`);
          } else if (affectedRows) {
            console.log(`inserted with id=${salesReply.insertId}`);
          }
        }
      }
      //});

      db.end();
      res.status(200).json({ message: "all fine" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
      db.end();
    }
    //will need GET later
  } else if (req.method === "GET") {
    const {
      query: { id },
    } = req;
    try {
      //console.log(`post-files: ${id}`);
      const dbQuery = `SELECT * FROM assets_sales WHERE asset_id = '${id}'`;
      
      const assetSalesDB = await db.query(dbQuery);

      db.end();
      res.status(200).json({ message: assetSalesDB[0] });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
      db.end();
    }
  }
}

Date.prototype.removeTimeFromDate = function () {
  let dateWithoutTime = new Date(this.setHours(0, 0, 0, 0));
  return dateWithoutTime;
};

Boolean.prototype.to01 = function () {
  return this ? 1 : 0;
};

Array.prototype.reduceArrayOfObjectsToArrayOfValues = function (keyName) {
  let newKeywords = this.reduce((acc, item) => {
    let escapedValue = string_cleanJSON_preStringify(item[keyName]);
    item[keyName] = escapedValue;
    acc.push(escapedValue);
    return acc;
  }, []);
  return newKeywords;
};

function makeInsertAssetSalesQuery(data, table) {
  let today = new Date();
  //console.log(today.toJSON().slice(0, 10));

  let newQuery = `INSERT INTO ${table}`;
  newQuery += `(asset_id, nb_downloads, date_recorded) VALUES ('`;
  newQuery += `${data.id}', '`;
  newQuery += `${data.nb_downloads}', `;
  newQuery += `STR_TO_DATE('${today.toJSON().slice(0, 10)}','%Y-%m-%d'))`;

  let filter =
    `SELECT * FROM ${table} ` +
    `WHERE DATE_FORMAT(date_recorded,'%Y %m %d')` +
    `=DATE_FORMAT('${today.toJSON()}','%Y %m %d')` +
    ` AND asset_id = '${data.id}'`;

  return { query: newQuery, filter: filter };
}

function makeInsertIgnoreAssetsQuery(dataOrig, table) {
  let data = JSON.parse(JSON.stringify(dataOrig));

  let newKeywords = data.keywords.reduceArrayOfObjectsToArrayOfValues("name");

  const content_type_str = CONTENT_TYPES[data.media_type_id - 1].title;

  let newTitle = string_cleanJSON_preStringify(data.title);
  let newCountry = string_cleanJSON_preStringify(data.country_name);
  let newCreatorName = string_cleanJSON_preStringify(data.creator_name);

  data.title = newTitle;
  data.country_name = newCountry;
  data.creator_name = newCreatorName;

  let newQuery =
    `INSERT IGNORE INTO ` +
    `${table}` +
    `(id, title, keywords, creation_date, allFields, creator_id, has_releases, media_type_id, is_gentech, content_type_str) VALUES ('` +
    `${data.id}', '` +
    `${data.title}', '` +
    `${JSON.stringify(newKeywords)}', '` +
    `${data.creation_date}', '` +
    ` ${JSON.stringify(data)}', '` +
    ` ${data.creator_id}', '` +
    ` ${data.has_releases}', '` +
    ` ${data.media_type_id}', '` +
    ` ${data.is_gentech.to01()}', '` +
    ` ${content_type_str}')`;

  let cleanedQuery = string_cleanJSON_to_query(newQuery);
  //console.log(cleanedQuery);
  return cleanedQuery;
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
