import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { id } = JSON.parse(event.body);

    if (!id) return { statusCode: 400, body: JSON.stringify({ message: "❌ رقم الوظيفة مفقود." }) };

    await sql`DELETE FROM jobs WHERE id = ${id}`;
    return { statusCode: 200, body: JSON.stringify({ message: "✅ تم حذف الوظيفة بنجاح." }) };
  } catch (error) {
    console.error("❌ خطأ أثناء حذف الوظيفة:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "❌ فشل حذف الوظيفة.", error: error.message }) };
  }
}
