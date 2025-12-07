const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    const { id, status, interview_date, message } = body;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "Missing application ID" }) };
    }

    await sql`
      UPDATE applications 
      SET 
        status = COALESCE(${status}, status),
        interview_date = COALESCE(${interview_date}, interview_date),
        message_from_company = COALESCE(${message}, message_from_company)
      WHERE id = ${id};
    `;

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };

  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success:false, message: err.message }) 
    };
  }
};
