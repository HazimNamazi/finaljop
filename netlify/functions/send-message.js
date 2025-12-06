import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    const { application_id, message } = body;

    if (!application_id || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fields" })
      };
    }

    const result = await sql`
      UPDATE applications
      SET message_from_company = ${message},
          message_date = NOW()
      WHERE id = ${application_id}
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        application: result[0]
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
}
