import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const company_id = event.queryStringParameters.company_id;

    if (!company_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "company_id is required" })
      };
    }

    const applications = await sql`
      SELECT 
        applications.id,
        applications.status,
        applications.cv_link,
        applications.created_at,
        users.full_name AS student_name,
        users.email AS student_email,
        jobs.job_title
      FROM applications
      JOIN users ON users.id = applications.student_id
      JOIN jobs ON jobs.id = applications.job_id
      WHERE jobs.company_id = ${company_id}
      ORDER BY applications.created_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, applications })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server Error" })
    };
  }
}
