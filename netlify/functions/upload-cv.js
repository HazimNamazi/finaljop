exports.handler = async (event) => {
    try {
      if (event.httpMethod !== "POST") {
        return {
          statusCode: 405,
          body: JSON.stringify({ success: false, message: "Method Not Allowed" })
        };
      }
  
      // استخراج الملف من Body
      const contentType = event.headers["content-type"] || event.headers["Content-Type"];
  
      if (!contentType.startsWith("multipart/form-data")) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: "Invalid file data" })
        };
      }
  
      const boundary = contentType.split("boundary=")[1];
      const body = Buffer.from(event.body, "base64").toString();
  
      const fileStart = body.indexOf("PDF");
      if (fileStart === -1) {
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: "Not a valid PDF file." })
        };
      }
  
      const fileBuffer = Buffer.from(body.substring(fileStart), "binary").toString("base64");
  
      // اسم فريد للملف
      const fileName = `cv_${Date.now()}.pdf`;
  
      // رفع الملف إلى Netlify Blob Storage
      const { Blobs } = await import("@netlify/blobs");
      const blobs = new Blobs({ token: process.env.NETLIFY_BLOBS_TOKEN });
  
      await blobs.set(fileName, fileBuffer, {
        metadata: { type: "application/pdf" },
        encoding: "base64"
      });
  
      const fileUrl = blobs.getPublicUrl(fileName);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "CV uploaded successfully",
          url: fileUrl
        })
      };
  
    } catch (error) {
      console.error("Upload Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Server error" })
      };
    }
  };
  