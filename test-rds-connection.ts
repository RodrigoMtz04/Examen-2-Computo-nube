import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const USE_RDS = process.env.USE_RDS === "true";

async function testRDSConnection(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Verificando Conexión a Aurora RDS    ║");
  console.log("╚════════════════════════════════════════╝\n");

  // 1. Verificar variables de entorno
  console.log("📋 Verificando variables de entorno...");
  console.log(`   USE_RDS: ${USE_RDS}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_USER: ${process.env.DB_USER}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT}`);
  console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? "***" : "NO CONFIGURADA"}`);

  if (!USE_RDS) {
    console.log("\n⚠️  USE_RDS=false - Conectando a BD Local");
    return;
  }

  // 2. Verificar credenciales
  if (!process.env.DB_PASSWORD) {
    console.error("❌ Error: DB_PASSWORD no configurada en .env");
    process.exit(1);
  }

  console.log("\n✅ Credenciales encontradas");

  // 3. Intentar conexión
  console.log("\n📡 Conectando a Aurora RDS con autenticación de contraseña...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
      ssl: "Amazon RDS",
    });

    console.log("✅ Conexión exitosa!");

    // 5. Ejecutar queries de prueba
    console.log("\n📊 Ejecutando queries de prueba...");

    // Test 1: Simple ping
    const [pingResult] = await connection.query("SELECT 1 as connected");
    console.log("✅ Query simple: OK");

    // Test 2: Ver tablas
    const [tables]: any = await connection.query("SHOW TABLES");
    if (Array.isArray(tables)) {
      console.log(`✅ Tablas en BD (${tables.length}):`);
      tables.forEach((table: any, index: number) => {
        console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
      });
    } else {
      console.log(`✅ Tablas en BD: OK`);
    }

    // Test 3: Contar registros
    const [countResult]: any = await connection.query(
      "SELECT COUNT(*) as count FROM recommendations"
    );
    console.log(
      `✅ Registros en 'recommendations': ${countResult[0]?.count || 0}`
    );

    // Test 4: Ver últimas predicciones
    const [lastRecords]: any = await connection.query(
      "SELECT * FROM recommendations ORDER BY created_at DESC LIMIT 3"
    );
    if (Array.isArray(lastRecords) && lastRecords.length > 0) {
      console.log("\n📝 Últimas 3 predicciones:");
      lastRecords.forEach((record: any, index: number) => {
        console.log(
          `   ${index + 1}. Band: ${record.predicted_band}, Confidence: ${record.confidence}`
        );
      });
    } else {
      console.log("\n📝 No hay predicciones registradas aún");
    }

    // Cerrar conexión
    await connection.end();

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║  ✅ CONEXION A AURORA RDS EXITOSA! ✅  ║");
    console.log("╚════════════════════════════════════════╝");
    console.log(
      "\nYa puedes ejecutar: npm run dev\n"
    );
  } catch (error: any) {
    console.error("\n❌ Error de conexión:");
    console.error(`   Tipo: ${error.code}`);
    console.error(`   Mensaje: ${error.message}`);

    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Sugerencias:");
      console.error("   • Verifica DB_PASSWORD en .env");
      console.error("   • Verifica AWS_ACCESS_KEY_ID");
      console.error("   • Verifica que USE_RDS=true");
    } else if (
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ECONNREFUSED"
    ) {
      console.error("\n💡 Sugerencias:");
      console.error("   • Verifica DB_HOST (¿es correcto?)");
      console.error("   • Verifica Security Group de RDS (¿permite puerto 3306?)");
      console.error("   • Verifica conexión a Internet");
    }

    process.exit(1);
  }
}

testRDSConnection();


