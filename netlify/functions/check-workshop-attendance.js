import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const { student_id, workshop_id } = event.queryStringParameters;

    const result = await sql`
      SELECT * FROM workshop_attendance
      WHERE student_id = ${student_id}
      AND workshop_id = ${workshop_id}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ attended: result.length > 0 })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
}
