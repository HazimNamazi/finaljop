import { v2 as cloudinary } from 'cloudinary';
import { neon } from '@neondatabase/serverless';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handler(event) {
  try {
    const { job_id, student_id, fileName, fileContent } = JSON.parse(event.body);

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // رفع الملف إلى Cloudinary
    const uploadRes = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${fileContent}`,
      {
        folder: "cv_uploads",
        resource_type: "raw"
      }
    );

    // حفظ الطلب في قاعدة البيانات
    await sql`
      INSERT INTO applications (job_id, student_id, file_name, cv_url)
      VALUES (${job_id}, ${student_id}, ${fileName}, ${uploadRes.secure_url})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        cv_url: uploadRes.secure_url
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}
