import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const student_id = event.queryStringParameters.student_id;

    if (!student_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "student_id is required" })
      };
    }

    const applications = await sql`
      SELECT 
        applications.id,
        applications.status,
        applications.cv_url,
        applications.file_name,
        applications.applied_at,
        applications.interview_date,
        jobs.job_title,
        jobs.company_name,
        jobs.location,
        jobs.salary_range
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.student_id = ${student_id}
      ORDER BY applications.applied_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ applications })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
