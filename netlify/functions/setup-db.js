import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // ✅ إنشاء جدول المستخدمين (Users)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) DEFAULT 'job_seeker',  -- company | job_seeker
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ✅ إنشاء جدول الوظائف (Jobs)
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        salary VARCHAR(100),
        company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ✅ إنشاء جدول الطلبات (Applications)
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'جديد',  -- جديد | مقبول | مرفوض
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم إعداد قاعدة البيانات بنجاح (Users + Jobs + Applications).",
      }),
    };
  } catch (error) {
    console.error("❌ فشل إعداد قاعدة البيانات:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "⚠️ خطأ في إنشاء الجداول.", error: error.message }),
    };
  }
}
