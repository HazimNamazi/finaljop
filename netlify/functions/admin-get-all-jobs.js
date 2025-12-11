import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const jobs = await sql`
      SELECT *
      FROM jobs
      ORDER BY id DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(jobs)
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}
