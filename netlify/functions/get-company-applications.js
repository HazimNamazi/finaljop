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

    const apps = await sql`
      SELECT 
        applications.id,
        applications.status,
        applications.cv_url,        -- ✔ العمود الصحيح
        applications.file_name,     -- ✔ اسم الملف
        applications.interview_date,
        applications.applied_at,
        students.full_name AS applicant_name,
        students.email,
        jobs.job_title
      FROM applications
      JOIN students ON students.id = applications.student_id
      JOIN jobs ON jobs.id = applications.job_id
      WHERE jobs.company_id = ${company_id}
      ORDER BY applications.applied_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(apps)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
