import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function initializeRDSDatabase(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Inicializando Aurora RDS            ║");
  console.log("╚════════════════════════════════════════╝\n");

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || "3306"),
      ssl: "Amazon RDS",
    });

    console.log("✅ Conectado a Aurora RDS\n");

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, "database", "init.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    // Dividir por puntos y comas (;) para ejecutar cada comando
    const commands = sqlContent
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.length > 0);

    console.log(`📋 Encontrados ${commands.length} comandos SQL\n`);

    // Ejecutar cada comando
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      try {
        console.log(`   [${i + 1}/${commands.length}] Ejecutando...`);

        // Saltar comentarios
        if (cmd.startsWith("--") || cmd.startsWith("/*")) {
          console.log(`   ✓ Comentario saltado`);
          continue;
        }

        // Obtener primera palabra para identificar el tipo de comando
        const firstWord = cmd.trim().split(/\s+/)[0].toUpperCase();

        const [result] = await connection.query(cmd);

        if (firstWord === "CREATE") {
          console.log(`   ✅ Tabla/BD creada`);
        } else if (firstWord === "INSERT") {
          console.log(`   ✅ Datos insertados`);
        } else if (firstWord === "USE") {
          console.log(`   ✅ BD seleccionada`);
        } else {
          console.log(`   ✅ Comando ejecutado`);
        }
      } catch (error: any) {
        // Si la tabla ya existe, no es error
        if (error.code === "ER_TABLE_EXISTS_ERROR") {
          console.log(`   ℹ️  Tabla ya existe (ignorado)`);
        } else {
          console.log(`   ⚠️  ${error.message}`);
        }
      }
    }

    console.log("\n📊 Verificando tablas creadas...");

    // Verificar tablas
    const [tables]: any = await connection.query("SHOW TABLES");
    if (Array.isArray(tables) && tables.length > 0) {
      console.log(`✅ Tablas en BD (${tables.length}):`);
      tables.forEach((table: any, index: number) => {
        console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
      });
    }

    // Contar registros
    try {
      const [fitnessBands]: any = await connection.query(
        "SELECT COUNT(*) as count FROM fitness_bands"
      );
      console.log(
        `\n📋 Registros en 'fitness_bands': ${fitnessBands[0]?.count || 0}`
      );
    } catch (e) {
      console.log("\n⚠️  Tabla fitness_bands no encontrada");
    }

    await connection.end();

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║  ✅ BD INICIALIZADA EXITOSAMENTE! ✅  ║");
    console.log("╚════════════════════════════════════════╝");
    console.log("\nYa puedes ejecutar: npm run dev\n");
  } catch (error: any) {
    console.error("\n❌ Error de inicialización:");
    console.error(`   Tipo: ${error.code}`);
    console.error(`   Mensaje: ${error.message}`);
    process.exit(1);
  }
}

initializeRDSDatabase();

