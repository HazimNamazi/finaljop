import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const {
      page = 1,
      limit = 20
    } = event.queryStringParameters || {};

    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        id,
        job_title,
        company_id,
        company_name,
        company_email,
        job_description,
        job_type,
        location,
        salary_range,
        department,
        restrict_to_department,
        interview_time,
        application_deadline,
        created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const jobs = await sql(query);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        jobs
      })
    };

  } catch (error) {
    console.error("❌ Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Server error",
        error: error.message
      })
    };
  }
}
