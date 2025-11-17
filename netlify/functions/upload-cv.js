const { v4: uuid } = require("uuid");

exports.handler = async (event) => {
  try {
    const boundary = event.headers["content-type"].split("boundary=")[1];
    const body = event.body;

    const fileBase64 = body.split("base64,")[1];
    const buffer = Buffer.from(fileBase64, "base64");

    const filename = `${uuid()}.pdf`;
    const fileUrl = `https://finaljop.netlify.app/uploads/${filename}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ url: fileUrl })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
