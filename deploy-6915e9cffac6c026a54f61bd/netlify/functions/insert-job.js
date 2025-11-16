import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const data = JSON.parse(event.body);

    // استقبال بيانات الوظيفة من الواجهة
    const { company_id, job_title, company_name, job_description, job_type, location, salary_range } = data;

    // التحقق من أن كل الحقول المطلوبة موجودة
    if (!company_id || !job_title || !company_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ جميع الحقول المطلوبة يجب تعبئتها." }),
      };
    }

    // تنفيذ الاستعلام لإضافة الوظيفة
    const result = await sql`
      INSERT INTO jobs (company_id, job_title, company_name, job_description, job_type, location, salary_range)
      VALUES (${company_id}, ${job_title}, ${company_name}, ${job_description}, ${job_type}, ${location}, ${salary_range})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم إضافة الوظيفة بنجاح!",
        job: result[0],
      }),
    };
  } catch (error) {
    console.error("❌ Database insert failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "❌ فشل في إضافة الوظيفة.", error: error.message }),
    };
  }
}
