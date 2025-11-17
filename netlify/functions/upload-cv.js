import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false
  }
};

export async function handler(event) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(event, async (err, fields, files) => {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ success: false, message: "Upload failed" })
        });
      }

      const file = files.cv;
      const uploadDir = "/tmp/uploads";

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const filePath = path.join(uploadDir, file.originalFilename);
      fs.renameSync(file.filepath, filePath);

      const fileURL = `https://finaljop.netlify.app/uploads/${file.originalFilename}`;

      resolve({
        statusCode: 200,
        body: JSON.stringify({ success: true, url: fileURL })
      });
    });
  });
}
