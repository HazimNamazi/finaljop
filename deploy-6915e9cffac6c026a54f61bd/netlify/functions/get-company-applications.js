import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // ✅ نستقبل jobId من الواجهة (وليس company_id)
    const { jobId } = event.queryStringParameters;

    if (!jobId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يجب إرسال رقم الوظيفة (jobId)." }),
      };
    }

    // ✅ نجلب كل الطلبات لهذه الوظيفة المحددة فقط
    const applications = await sql`
      SELECT 
        a.id AS application_id,
        a.status,
        a.created_at,
        u.full_name AS applicant_name,
        u.email AS applicant_email
      FROM applications a
      JOIN users u ON a.student_id = u.id
      WHERE a.job_id = ${jobId}
      ORDER BY a.created_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(applications),
    };

  } catch (error) {
    console.error("❌ خطأ أثناء جلب الطلبات:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ فشل في تحميل الطلبات.",
        error: error.message,
      }),
    };
  }
}
