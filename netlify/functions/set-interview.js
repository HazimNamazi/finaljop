import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    const { application_id, interview_date } = body;

    if (!application_id || !interview_date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fields" }),
      };
    }

    const result = await sql`
      UPDATE applications
      SET status = 'مقبول', interview_date = ${interview_date}
      WHERE id = ${application_id}
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result[0],
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}
