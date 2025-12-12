import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const { id } = event.queryStringParameters;

    if (!id) {
      return { statusCode: 400, body: "Company ID required" };
    }

    // أولاً نحذف وظائف الشركة
    await sql`DELETE FROM jobs WHERE company_id = ${id};`;

    // ثم نحذف الشركة نفسها
    await sql`DELETE FROM users WHERE id = ${id} AND user_type = 'company';`;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Company deleted" })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
}
