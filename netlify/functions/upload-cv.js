import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    const { job_id, student_id, fileName, fileContent } = body;

    // التحقق من جميع القيم المطلوبة
    if (!job_id || !student_id || !fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields",
          received: { job_id, student_id, fileName, hasFileContent: !!fileContent }
        })
      };
    }

    // تنفيذ الإدخال
    const result = await sql`
      INSERT INTO applications (job_id, student_id, file_name, file_data)
      VALUES (${job_id}, ${student_id}, ${fileName}, ${fileContent})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result })
    };

  } catch (err) {
    console.error("❌ upload-cv error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message || "Unknown server error"
      })
    };
  }
}
