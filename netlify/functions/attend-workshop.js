import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    const { student_id, workshop_id } = body;

    const user = await sql`SELECT user_type FROM users WHERE id = ${student_id}`;
    if (user.length === 0 || user[0].user_type !== "job_seeker") {
      return { statusCode: 403, body: JSON.stringify({ message: "Only students can attend workshops" }) };
    }

    const check = await sql`
      SELECT * FROM workshop_attendance
      WHERE student_id = ${student_id} AND workshop_id = ${workshop_id}
    `;

    if (check.length > 0) {
      return { statusCode: 400, body: JSON.stringify({ message: "Already registered" }) };
    }

    const result = await sql`
      INSERT INTO workshop_attendance (student_id, workshop_id)
      VALUES (${student_id}, ${workshop_id})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, attendance: result[0] })
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
