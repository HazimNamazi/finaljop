import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    // الاتصال بقاعدة البيانات عبر متغير البيئة من ملف .env
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // جلب آخر 6 وظائف من الجدول
    const result = await sql`
      SELECT 
        id, 
        job_title, 
        company_name, 
        job_description, 
        job_type, 
        location, 
        salary_range, 
        created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 6;
    `;

    // التحقق من وجود بيانات
    if (!result || result.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "لم يتم العثور على وظائف." }),
      };
    }

    // إرجاع النتائج بنجاح
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "Database connection failed",
        details: error.message,
      }),
    };
  }
}
