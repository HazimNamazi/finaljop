import { neon } from "@neondatabase/serverless";
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { student_id, job_id, fileName, fileContent } = body;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // رفع الملف إلى Cloudinary
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: JSON.stringify({
          file: `data:application/pdf;base64,${fileContent}`,
          upload_preset: preset
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadData.secure_url) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: uploadData.error })
      };
    }

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    await sql`
      INSERT INTO applications (student_id, job_id, file_name, cv_url)
      VALUES (${student_id}, ${job_id}, ${fileName}, ${uploadData.secure_url})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        cv_url: uploadData.secure_url
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
}
