import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const { id } = event.queryStringParameters;

    if (!id) {
      return { statusCode: 400, body: "Student ID required" };
    }

    // حذف الطالب من users
    await sql`DELETE FROM users WHERE id = ${id} AND user_type = 'job_seeker';`;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Student deleted" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
}
