import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createConnection({
  port: 3306,
  host: "b5pgj1fg42icdb7zpjdu-mysql.services.clever-cloud.com",
  user: "uwv07v724txkjyit",
  password: "zfAwRSRAakuCLTdeppt3",
  database: "b5pgj1fg42icdb7zpjdu",
  connectionLimit: 10,
});

pool.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});
module.exports = pool;
