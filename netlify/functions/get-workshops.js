import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const workshops = await sql`SELECT * FROM workshops ORDER BY date ASC`;

    return {
      statusCode: 200,
      body: JSON.stringify(workshops)
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
