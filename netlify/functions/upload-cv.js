import { neon } from "@neondatabase/serverless";
import { Blobs } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const formData = JSON.parse(event.body || "{}");

    const { job_id, student_id, fileName, fileContent } = formData;

    if (!fileName || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing file." }),
      };
    }

    // 1) تخزين الملف داخل Netlify Blobs
    const blobs = new Blobs({ siteID: process.env.NETLIFY_SITE_ID });
    const fileBuffer = Buffer.from(fileContent, "base64");

    // حفظ الملف
    const blobResponse = await blobs.set(`cv/${Date.now()}-${fileName}`, fileBuffer, {
      contentType: "application/pdf",
    });

    // السيرفر يرجع رابط الملف المباشر
    const cv_link = blobResponse.url;

    // 2) حفظ الطلب في قاعدة البيانات
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const result = await sql`
      INSERT INTO applications (job_id, student_id, cv_link, status)
      VALUES (${job_id}, ${student_id}, ${cv_link}, 'جديد')
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "تم رفع الملف وحفظ الطلب بنجاح",
        cv_link,
        application: result[0],
      }),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Server Error" }),
    };
  }
};
