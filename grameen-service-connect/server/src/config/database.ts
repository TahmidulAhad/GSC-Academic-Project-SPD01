import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "grameen_service_connect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log("✅ Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Unable to connect to MySQL database:", err);
    process.exit(-1);
  });

export default pool;
