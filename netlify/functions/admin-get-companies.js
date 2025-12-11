import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const companies = await sql`
      SELECT id, full_name, email, phone, created_at
      FROM users
      WHERE user_type = 'company'
      ORDER BY id DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(companies)
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}
