import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";
import 'dotenv/config';

export async function handler(event) {
  try {

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }

    const { student_id, job_id, fileName, fileContent } = JSON.parse(event.body);

    if (!student_id || !job_id || !fileContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Missing data" }),
      };
    }

    // إعداد Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // رفع الملف إلى Cloudinary
    const uploadRes = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${fileContent}`,
      {
        folder: "cvs",
        resource_type: "raw",      // 👈 هذا ضروري لقبول ملفات PDF
        public_id: fileName.replace(/\.[^/.]+$/, "")
      }
    );

    if (!uploadRes.secure_url) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "Upload failed" })
      };
    }

    // حفظ الرابط داخل قاعدة البيانات
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    await sql`
      INSERT INTO applications (student_id, job_id, file_name, cv_url)
      VALUES (${student_id}, ${job_id}, ${fileName}, ${uploadRes.secure_url})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        cv_url: uploadRes.secure_url
      })
    };

  } catch (err) {
    console.error("❌ Upload CV Error:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
}
