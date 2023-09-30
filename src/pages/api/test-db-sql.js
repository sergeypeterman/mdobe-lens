const mysql = require("mysql2");

export default function testConnection(req, res) {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEME,
  });

  db.connect(function (err) {
    if (err) {
      let message = "Error connecting to MySQL: " + err;
      //console.log(message);
      res.status(500).json({ message: message });
      return;
    }
    //console.log("Connected to MySQL!");
    res.status(200).json({ message: "Connected to MySQL!" });
  });

  db.end(); // Close the connection after testing
  
}
