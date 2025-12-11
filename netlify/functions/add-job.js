import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body || "{}");

    const {
      company_id,
      job_title,
      job_description,
      location,
      salary_range,
      department,
      restrict_to_department,
      interview_time,
      application_deadline
    } = body;

    // التحقق من الحقول الأساسية
    if (!company_id || !job_title || !job_description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ Missing required fields" })
      };
    }

    // جلب اسم الشركة وبريدها
    const company = await sql`
      SELECT full_name, email 
      FROM users 
      WHERE id = ${company_id};
    `;

    if (!company.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "❌ Company not found" })
      };
    }

    const company_name = company[0].full_name;
    const company_email = company[0].email;

    // إدخال وظيفة جديدة بجميع الحقول
    const result = await sql`
      INSERT INTO jobs (
        company_id,
        company_name,
        company_email,
        job_title,
        job_description,
        location,
        salary_range,
        department,
        restrict_to_department,
        interview_time,
        application_deadline
      )
      VALUES (
        ${company_id},
        ${company_name},
        ${company_email},
        ${job_title},
        ${job_description},
        ${location},
        ${salary_range},
        ${department || null},
        ${restrict_to_department || false},
        ${interview_time || null},
        ${application_deadline || null}
      )
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        job: result[0],
        message: "✔ تمت إضافة الوظيفة بنجاح"
      })
    };

  } catch (err) {
    console.error("❌ ADD JOB ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
}
