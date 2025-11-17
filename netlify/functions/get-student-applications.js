// netlify/functions/get-student-applications.js
import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { student_id } = event.queryStringParameters || {};

    if (!student_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يجب إرسال رقم الطالب (student_id)." }),
      };
    }

    const apps = await sql`
      SELECT 
        a.id,
        a.status,
        a.created_at,
        j.job_title,
        j.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.student_id = ${student_id}
      ORDER BY a.created_at DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(apps),
    };
  } catch (error) {
    console.error("❌ Error loading student applications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "❌ فشل في تحميل الطلبات.", error: error.message }),
    };
  }
}
