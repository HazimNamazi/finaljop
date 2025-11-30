import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const job_id = event.queryStringParameters.job_id;

    if (!job_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "job_id is required" })
      };
    }

    const result = await sql`
      SELECT id, job_title, company_name, location, salary_range
      FROM jobs
      WHERE id = ${job_id}
      LIMIT 1;
    `;

    if (!result.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Job not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result[0])
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
