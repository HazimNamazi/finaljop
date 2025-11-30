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
          message: "Missing required fields"
        })
      };
    }

    // رابط السيرة الذاتية Base64
    const pdf_url = `data:application/pdf;base64,${fileContent}`;

    // ⭐ إنشاء طلب الوظيفة + تخزين الرابط
    const result = await sql`
      INSERT INTO applications (job_id, student_id, cv_link, status)
      VALUES (${job_id}, ${student_id}, ${pdf_url}, 'قيد المراجعة')
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Application submitted",
        application: result
      }),
    };

  } catch (err) {
    console.error("❌ upload-cv error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
