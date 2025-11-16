import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // 📌 قراءة الفلاتر (Query Parameters)
    const { 
      page = 1, 
      limit = 10,
      search = "",
      location = "",
      job_type = "",
      company = ""
    } = event.queryStringParameters || {};

    const offset = (page - 1) * limit;

    // 🔍 بناء الاستعلام بشكل ديناميكي
    let query = `
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
      WHERE 1 = 1
    `;

    const params = [];

    if (search) {
      query += ` AND (job_title ILIKE $${params.length + 1} OR job_description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    if (location) {
      query += ` AND location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }

    if (job_type) {
      query += ` AND job_type ILIKE $${params.length + 1}`;
      params.push(`%${job_type}%`);
    }

    if (company) {
      query += ` AND company_name ILIKE $${params.length + 1}`;
      params.push(`%${company}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // 🚀 تنفيذ الاستعلام
    const result = await sql(query, params);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        page: Number(page),
        limit: Number(limit),
        count: result.length,
        jobs: result
      }),
    };

  } catch (error) {
    console.error("❌ Error loading jobs:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Internal Server Error",
        error: error.message
      }),
    };
  }
}
