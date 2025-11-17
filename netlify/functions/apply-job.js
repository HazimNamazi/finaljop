import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST method allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { job_id, student_id, cv_url } = data;

    // تحقق من البيانات المطلوبة
    if (!job_id || !student_id || !cv_url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // إدخال الطلب
    const result = await sql`
      INSERT INTO applications (job_id, student_id, cv_url, status)
      VALUES (${job_id}, ${student_id}, ${cv_url}, 'جديد')
      RETURNING id, created_at, status;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "تم إرسال طلبك بنجاح!",
        application: result[0],
      }),
    };

  } catch (error) {
    console.error("❌ Error saving application:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to submit application" }),
    };
  }
}
