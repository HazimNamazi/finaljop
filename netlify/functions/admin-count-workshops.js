import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const result = await sql`
      SELECT COUNT(*) AS count FROM workshops;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(result[0])
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}
