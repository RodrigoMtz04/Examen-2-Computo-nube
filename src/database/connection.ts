import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const USE_RDS = process.env.USE_RDS === "true";
const USE_IAM_AUTH = process.env.USE_IAM_AUTH === "true";

let Signer: any = null;
if (USE_RDS && USE_IAM_AUTH) {
  Signer = require("@aws-sdk/rds-signer").Signer;
}

async function generateAuthToken(): Promise<string> {
  if (!Signer) {
    throw new Error("IAM Signer no está disponible");
  }

  const signer = new Signer({
    region: process.env.AWS_REGION || "us-east-1",
    hostname: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "admin",
  });

  return signer.getAuthToken();
}

const poolConfig: any = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  database: process.env.DB_NAME || "fitness_bands_db",
  port: parseInt(process.env.DB_PORT || "3306"),
  password: process.env.DB_PASSWORD || "root",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Si usamos RDS Aurora con autenticación tradicional
if (USE_RDS && !USE_IAM_AUTH) {
  poolConfig.ssl = "Amazon RDS";
  // Usar contraseña del .env
}

// Si usamos RDS Aurora con IAM Auth
if (USE_RDS && USE_IAM_AUTH) {
  poolConfig.ssl = "Amazon RDS";
  poolConfig.authPlugins = {
    mysql_clear_password: () => () => Buffer.from(""),
  };
}

const pool = mysql.createPool(poolConfig);

pool.on("connection", async (connection) => {
  if (USE_RDS && USE_IAM_AUTH) {
    try {
      const token = await generateAuthToken();
      connection.config.password = token;
    } catch (error) {
      console.error("Error generando token IAM:", error);
    }
  }
});

export default pool;
