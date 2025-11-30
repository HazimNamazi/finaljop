import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    const { job_id, student_id, fileName, fileContent } = body;

    // التحقق من المدخلات
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

    // تحويل PDF إلى Base64
    const pdf_url = `data:application/pdf;base64,${fileContent}`;

    // الإدخال في قاعدة البيانات
    const result = await sql`
      INSERT INTO applications (job_id, student_id, file_name, cv_url, status, applied_at)
      VALUES (${job_id}, ${student_id}, ${fileName}, ${pdf_url}, 'جديدة', NOW())
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "CV Uploaded & Application Created",
        data: result[0]
      }),
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
