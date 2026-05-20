import pool from "../database/connection";

export interface RecommendationRecord {
  id?: number;
  int: string;
  ex: string;
  mot: string;
  tech: string;
  predicted_band: string;
  confidence: number;
  created_at?: Date;
}

export async function saveRecommendation(
  record: RecommendationRecord
): Promise<number> {
  const query = `
    INSERT INTO recommendations (\`int\`, \`ex\`, \`mot\`, \`tech\`, predicted_band, confidence)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [
    record.int,
    record.ex,
    record.mot,
    record.tech,
    record.predicted_band,
    record.confidence,
  ]);

  return (result as any).insertId;
}

export async function getRecommendations(): Promise<RecommendationRecord[]> {
  const query = `SELECT * FROM recommendations ORDER BY created_at DESC`;
  const [rows] = await pool.execute(query);
  return rows as RecommendationRecord[];
}
