import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    const { job_id, student_id, fileName, fileContent } = body;

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

    // تحويل ملف PDF إلى Base64 URL ونخزنه في cv_url
    const pdf_url = `data:application/pdf;base64,${fileContent}`;

    const result = await sql`
      INSERT INTO applications (job_id, cv_url)
      VALUES (${job_id}, ${pdf_url})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
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
