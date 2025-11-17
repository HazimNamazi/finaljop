import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" })
    };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { job_id, student_id, cv_link } = JSON.parse(event.body);

    if (!job_id || !student_id || !cv_link) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing fields (job_id, student_id, cv_link required)."
        })
      };
    }

    // حفظ الطلب
    const result = await sql`
      INSERT INTO applications (job_id, student_id, cv_link, status)
      VALUES (${job_id}, ${student_id}, ${cv_link}, 'pending')
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Application submitted successfully.",
        application: result[0]
      })
    };

  } catch (error) {
    console.error("Error saving application:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Internal server error"
      })
    };
  }
}
