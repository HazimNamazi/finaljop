import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { id, status } = JSON.parse(event.body);

    if (!id || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يجب إرسال رقم الطلب والحالة الجديدة." }),
      };
    }

    await sql`
      UPDATE applications
      SET status = ${status}
      WHERE id = ${id};
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `✅ تم تحديث حالة الطلب إلى '${status}'` }),
    };
  } catch (error) {
    console.error("❌ خطأ أثناء تحديث حالة الطلب:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "❌ فشل في تحديث حالة الطلب.", error: error.message }),
    };
  }
}
