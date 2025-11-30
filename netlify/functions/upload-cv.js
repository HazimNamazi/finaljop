import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const data = JSON.parse(event.body);

    const { job_id, student_id, fileName, fileContent } = data;

    if (!job_id || !student_id || !fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Missing required fields"
        })
      };
    }

    // 🔥 رفع الملف إلى cloudinary (أو تخزينه Base64 في DB — اختيارك)
    // هنا سنحفظ Base64 مباشرة داخل DB في عمود cv_url

    const fileUrl = `data:application/pdf;base64,${fileContent}`;

    // 🟢 إدخال الطلب
    const insert = await sql`
      INSERT INTO applications (student_id, job_id, cv_url, file_name)
      VALUES (${student_id}, ${job_id}, ${fileUrl}, ${fileName})
      RETURNING id;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "تم رفع الملف بنجاح",
        application_id: insert[0].id
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
}
