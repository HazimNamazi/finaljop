import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const id = event.queryStringParameters.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing workshop ID" })
      };
    }

    await sql`DELETE FROM workshops WHERE id = ${id}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Workshop deleted" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
}
