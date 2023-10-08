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
    const result = await db.query("SELECT * FROM test");
    console.log(result);
    const rows = result[0];

    res.status(200).json({ message: rows });
  } catch (err) {}
}
