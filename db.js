import pg from "pg";

const { Pool } = pg;

// A Railway fornece a connection string na variável DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const initDb = async () => {
  // Skip database initialization if no DATABASE_URL is provided
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  DATABASE_URL not set - skipping database initialization");
    console.log("ℹ️  The app will work, but votes will not be persisted");
    return;
  }

  try {
    const client = await pool.connect();
    try {
      // Tabela simples para armazenar os votos
      await client.query(`
        CREATE TABLE IF NOT EXISTS votes (
          id SERIAL PRIMARY KEY,
          session_id UUID,
          question_id INT NOT NULL,
          option_id VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log("✅ Database initialized successfully");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
    console.log(
      "ℹ️  Server will continue running, but database features may not work"
    );
  }
};

export const saveVote = async (sessionId, questionId, optionId) => {
  // If no DATABASE_URL, return empty votes (read-only mode)
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  Vote not saved - DATABASE_URL not configured");
    return {};
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(
        "INSERT INTO votes (session_id, question_id, option_id) VALUES ($1, $2, $3)",
        [sessionId, questionId, optionId]
      );

      // Retorna contagem atualizada para essa pergunta
      const result = await client.query(
        "SELECT option_id, COUNT(*) as count FROM votes WHERE session_id = $1 AND question_id = $2 GROUP BY option_id",
        [sessionId, questionId]
      );

      // Formata para o formato que o frontend espera: { 'opt1': 10, 'opt2': 5 }
      const votes = {};
      result.rows.forEach((row) => {
        votes[row.option_id] = parseInt(row.count);
      });

      return votes;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Error saving vote:", err.message);
    return {};
  }
};

export const getVotesForQuestion = async (sessionId, questionId) => {
  // If no DATABASE_URL, return empty votes
  if (!process.env.DATABASE_URL) {
    console.log("⚠️  Cannot fetch votes - DATABASE_URL not configured");
    return {};
  }

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT option_id, COUNT(*) as count FROM votes WHERE session_id = $1 AND question_id = $2 GROUP BY option_id",
        [sessionId, questionId]
      );

      const votes = {};
      result.rows.forEach((row) => {
        votes[row.option_id] = parseInt(row.count);
      });

      return votes;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Error fetching votes:", err.message);
    return {};
  }
};

export default pool;
