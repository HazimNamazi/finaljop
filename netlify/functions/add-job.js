import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    const {
      company_id,
      job_title,
      job_description,
      job_type,
      location,
      salary_range
    } = body;

    // التحقق من الحقول
    if (!company_id || !job_title || !job_description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ Missing required fields" })
      };
    }

    // 🔥 1) الحصول على اسم الشركة من جدول users
    const company = await sql`
      SELECT full_name 
      FROM users 
      WHERE id = ${company_id}
    `;

    if (!company.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "❌ Company not found" })
      };
    }

    const company_name = company[0].full_name;

    // 🔥 2) إدراج الوظيفة مع اسم الشركة
    const result = await sql`
      INSERT INTO jobs (
        company_id, 
        company_name,
        job_title, 
        job_description, 
        job_type, 
        location, 
        salary_range
      )
      VALUES (
        ${company_id},
        ${company_name},
        ${job_title},
        ${job_description},
        ${job_type},
        ${location},
        ${salary_range}
      )
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        job: result[0]
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
}
