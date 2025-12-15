import { neon } from "@neondatabase/serverless";

export async function handler() {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const messages = await sql`
      SELECT * FROM contact_messages
      ORDER BY created_at DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(messages)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
}
