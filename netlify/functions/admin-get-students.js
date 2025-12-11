import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const students = await sql`
      SELECT id, full_name, email, phone, department
      FROM users
      WHERE user_type = 'job_seeker'
      ORDER BY id DESC;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(students)
    };

  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
}
