import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const job_id = event.queryStringParameters.id;

    if (!job_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "job_id is required" })
      };
    }

    // حذف الوظيفة
    await sql`DELETE FROM jobs WHERE id = ${job_id}`;

    // حذف الطلبات المرتبطة بالوظيفة
    await sql`DELETE FROM applications WHERE job_id = ${job_id}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Job deleted successfully" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
}
