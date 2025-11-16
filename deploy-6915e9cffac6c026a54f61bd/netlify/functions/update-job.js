import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { id, job_title, job_description, location, salary_range } = JSON.parse(event.body);

    if (!id) return { statusCode: 400, body: JSON.stringify({ message: "❌ لا يوجد معرّف للوظيفة." }) };

    await sql`
      UPDATE jobs 
      SET job_title = ${job_title},
          job_description = ${job_description},
          location = ${location},
          salary_range = ${salary_range},
          updated_at = NOW()
      WHERE id = ${id};
    `;

    return { statusCode: 200, body: JSON.stringify({ message: "✅ تم تعديل الوظيفة بنجاح!" }) };
  } catch (err) {
    console.error("❌ خطأ أثناء تعديل الوظيفة:", err);
    return { statusCode: 500, body: JSON.stringify({ message: "❌ فشل تعديل الوظيفة.", error: err.message }) };
  }
}
