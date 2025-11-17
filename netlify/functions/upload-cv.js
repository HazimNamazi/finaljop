import { neon } from "@neondatabase/serverless";
import Busboy from "busboy";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const busboy = Busboy({ headers: event.headers });
  let student_id = null;
  let job_id = null;
  let fileBuffer = null;
  let fileName = null;

  return await new Promise((resolve, reject) => {
    busboy.on("field", (fieldname, value) => {
      if (fieldname === "student_id") student_id = value;
      if (fieldname === "job_id") job_id = value;
    });

    busboy.on("file", (name, file, info) => {
      fileName = info.filename;
      const chunks = [];

      file.on("data", (data) => {
        chunks.push(data);
      });

      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    busboy.on("finish", async () => {
      try {
        if (!student_id || !job_id || !fileBuffer) {
          return resolve({
            statusCode: 400,
            body: JSON.stringify({ message: "Missing fields" }),
          });
        }

        const sql = neon(process.env.NETLIFY_DATABASE_URL);

        const query = await sql`
          INSERT INTO applications (student_id, job_id, cv_file, cv_name)
          VALUES (${student_id}, ${job_id}, ${fileBuffer}, ${fileName})
          RETURNING id;
        `;

        resolve({
          statusCode: 200,
          body: JSON.stringify({ success: true, id: query[0].id }),
        });
      } catch (error) {
        console.error("Upload error:", error);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ message: "Server error" }),
        });
      }
    });

    busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    busboy.end();
  });
};
