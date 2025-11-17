import { neon } from "@neondatabase/serverless";
import multiparty from "multiparty";
import fs from "fs";

export const handler = async (event) => {
  try {
    const form = new multiparty.Form();

    const result = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const job_id = fields.job_id[0];
    const student_id = fields.student_id[0];

    const file = files.cv[0];
    const fileData = fs.readFileSync(file.path);
    const fileBase64 = fileData.toString("base64");

    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    await sql`
      INSERT INTO applications (job_id, student_id, cv_file)
      VALUES (${job_id}, ${student_id}, ${fileBase64})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error })
    };
  }
};
