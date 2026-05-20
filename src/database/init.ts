import pool from "./connection";

export async function initializeDatabase(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS recommendations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hm VARCHAR(10) NOT NULL,
      cel VARCHAR(10) NOT NULL,
      mi VARCHAR(10) NOT NULL,
      predicted_band VARCHAR(50) NOT NULL,
      confidence DECIMAL(5, 4) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.execute(createTableQuery);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
