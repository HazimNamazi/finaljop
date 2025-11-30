import { v2 as cloudinary } from "cloudinary";

export async function handler() {
  try {

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      secure: true
    });

    const testUrl = cloudinary.url("sample.jpg");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Cloudinary is working!",
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        urlExample: testUrl
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
