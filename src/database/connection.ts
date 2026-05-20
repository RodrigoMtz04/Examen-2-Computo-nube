import mysql from "mysql2/promise";
import { Signer } from "@aws-sdk/rds-signer";
import dotenv from "dotenv";

dotenv.config();

async function generateAuthToken(): Promise<string> {
  const signer = new Signer({
    region: process.env.AWS_REGION || "us-east-1",
    hostname: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "admin",
  });

  return signer.getAuthToken();
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  database: process.env.DB_NAME || "fitness_bands_db",
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: "Amazon RDS",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(""),
  },
});

pool.on("connection", async (connection) => {
  const token = await generateAuthToken();
  connection.config.password = token;
});

export default pool;
