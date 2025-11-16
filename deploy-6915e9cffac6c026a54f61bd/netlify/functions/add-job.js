import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  console.log("🚀 [add-job] Function triggered");

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    console.log("📦 Request body received:", body);

    const {
      job_title,
      job_description,
      location,
      salary_range,
      company_id
    } = body;

    // ✅ التحقق من الحقول المطلوبة
    if (!job_title || !job_description || !location || !salary_range || !company_id) {
      console.warn("⚠️ Missing fields:", { job_title, job_description, location, salary_range, company_id });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ جميع الحقول مطلوبة." }),
      };
    }

    // ✅ جلب اسم الشركة من جدول المستخدمين
    console.log("🔍 Fetching company name for ID:", company_id);
    const company = await sql`SELECT full_name FROM users WHERE id = ${company_id}`;
    const company_name = company[0]?.full_name || "شركة غير معروفة";
    console.log("🏢 Company name found:", company_name);

    // ✅ إدخال الوظيفة
    console.log("📝 Inserting new job into database...");
    const result = await sql`
      INSERT INTO jobs (
        company_id,
        company_name,
        job_title,
        job_description,
        location,
        salary_range,
        created_at
      )
      VALUES (
        ${company_id},
        ${company_name},
        ${job_title},
        ${job_description},
        ${location},
        ${salary_range},
        NOW()
      )
      RETURNING id;
    `;

    console.log("✅ Job inserted successfully:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم نشر الوظيفة بنجاح!",
        job_id: result[0].id,
      }),
    };
  } catch (error) {
    console.error("❌ خطأ أثناء إضافة الوظيفة:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ فشل في إضافة الوظيفة.",
        error: error.message,
      }),
    };
  }
}
