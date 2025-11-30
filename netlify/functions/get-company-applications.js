import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const company_id = event.queryStringParameters.company_id;

    if (!company_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "company_id is required" })
      };
    }

    const result = await sql`
      SELECT 
        applications.id,
        applications.status,
        applications.cv_url,
        applications.file_name,
        applications.applied_at,
        users.full_name AS applicant_name,
        users.email AS email,
        jobs.job_title
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN users ON applications.student_id = users.id   -- 🔥 التعديل هنا
      WHERE jobs.company_id = ${company_id}
      ORDER BY applications.applied_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
