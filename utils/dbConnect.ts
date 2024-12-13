import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT_NUMBER
    ? parseInt(process.env.PORT_NUMBER, 10)
    : undefined, // Convert to number or handle undefined
});

export default async function dbConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("Connected to PostgreSQL database", result.rows);
    client.release();
  } catch (error) {
    console.error("Error in connection", error.stack);
  }
}
