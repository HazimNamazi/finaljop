import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const { application_id, status } = JSON.parse(event.body || "{}");

    if (!application_id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "application_id and status are required"
        })
      };
    }

    await sql`
      UPDATE applications
      SET status = ${status}
      WHERE id = ${application_id};
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Status updated successfully"
      })
    };

  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server Error" })
    };
  }
}
