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

    // 1️⃣ جلب company_id من الوظيفة
    const jobInfo = await sql`
      SELECT company_id FROM jobs WHERE id = ${job_id}
    `;

    if (!jobInfo.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Job not found" })
      };
    }

    const company_id = jobInfo[0].company_id;

    // 2️⃣ تحويل ملف PDF إلى Base64 URL
    const pdf_url = `data:application/pdf;base64,${fileContent}`;

    // 3️⃣ إدخال الطلب في جدول applications
    const result = await sql`
      INSERT INTO applications (job_id, student_id, company_id, file_name, cv_url, status)
      VALUES (${job_id}, ${student_id}, ${company_id}, ${fileName}, ${pdf_url}, 'new')
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
