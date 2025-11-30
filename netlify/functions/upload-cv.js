import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { job_id, student_id, fileName, fileContent } = JSON.parse(event.body);

    if (!fileContent) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "No file uploaded" }) };
    }

    // ⬆️ رفع الملف إلى Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const preset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
      method: "POST",
      body: JSON.stringify({
        file: `data:application/pdf;base64,${fileContent}`,
        upload_preset: preset,
        public_id: `cv_${Date.now()}`,
      }),
      headers: { "Content-Type": "application/json" }
    });

    const uploaded = await uploadRes.json();

    if (!uploaded.secure_url) {
      return { statusCode: 500, body: JSON.stringify({ success: false, message: "Cloudinary upload failed" }) };
    }

    // ⬇️ تخزين الطلب في قاعدة البيانات
    const result = await sql`
      INSERT INTO applications (job_id, student_id, cv_url, file_name)
      VALUES (${job_id}, ${student_id}, ${uploaded.secure_url}, ${fileName})
      RETURNING id;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        application_id: result[0].id,
        cv_url: uploaded.secure_url
      })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, error: err.message }) };
  }
}
