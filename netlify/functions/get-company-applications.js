// netlify/functions/get-company-applications.js
import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { company_id } = event.queryStringParameters || {};

    if (!company_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يجب إرسال رقم الشركة (company_id)." }),
      };
    }

    // ✅ كل الطلبات لكل الوظائف التابعة لهذه الشركة
    const applications = await sql`
      SELECT 
        a.id,
        a.status,
        a.created_at,
        u.full_name AS applicant_name,
        u.email,
        j.job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.student_id = u.id
      WHERE j.company_id = ${company_id}
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
