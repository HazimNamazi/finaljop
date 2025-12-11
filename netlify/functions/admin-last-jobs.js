import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const jobs = await sql`
      SELECT id, job_title, company_name, location, created_at
      FROM jobs
      ORDER BY id DESC
      LIMIT 5;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(jobs)
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}
