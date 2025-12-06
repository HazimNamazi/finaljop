import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // نحصل على workshop_id من رابط الطلب
    const { workshop_id } = event.queryStringParameters;

    if (!workshop_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "workshop_id مطلوب" })
      };
    }

    // جلب الطلاب المسجلين
    const rows = await sql`
      SELECT 
        wa.id,
        wa.student_id,
        wa.attended,
        wa.attendance_time,
        u.full_name,
        u.email
      FROM workshop_attendance wa
      JOIN users u ON wa.student_id = u.id
      WHERE wa.workshop_id = ${workshop_id}
      ORDER BY wa.attendance_time ASC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
}
