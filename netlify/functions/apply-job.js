import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const body = JSON.parse(event.body);

    const { job_id, student_id, cv_link } = body;

    await sql`
      INSERT INTO applications (job_id, student_id, cv_link, status)
      VALUES (${job_id}, ${student_id}, ${cv_link}, 'pending')
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
