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
    await db.query(
      "INSERT INTO test (name, address) VALUES ('insertedFromAPI', 'reactnextjs')"
    );

    const [rows, fields] = await db.query("SELECT * FROM test");

    res.status(200).json({ message: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
}
