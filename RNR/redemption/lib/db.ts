import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abc@123",
  database: "rnr",
});

export default connection;
