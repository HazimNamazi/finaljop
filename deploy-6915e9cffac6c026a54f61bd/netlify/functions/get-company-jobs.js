import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  console.log("🚀 [get-company-jobs] Function triggered");

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // ✅ قراءة company_id من الرابط (query string)
    const params = event.queryStringParameters || {};
    const company_id = params.company_id;

    console.log("🏢 Company ID received:", company_id);

    if (!company_id) {
      console.warn("⚠️ No company_id provided.");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ رقم الشركة مفقود." }),
      };
    }

    // ✅ جلب الوظائف الخاصة بالشركة
    const jobs = await sql`
      SELECT id, job_title, job_description, location, salary_range, created_at
      FROM jobs
      WHERE company_id = ${company_id}
      ORDER BY created_at DESC;
    `;

    console.log(`✅ Retrieved ${jobs.length} job(s) for company_id=${company_id}`);

    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
    };

  } catch (error) {
    console.error("❌ خطأ أثناء جلب وظائف الشركة:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ فشل في جلب الوظائف الخاصة بالشركة.",
        error: error.message,
      }),
    };
  }
}
