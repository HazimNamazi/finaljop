const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    await sql`
      UPDATE applications 
      SET status=${body.status}, interview_date=${body.interview_date || null}
      WHERE id=${body.id};
    `;

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message: err.message }) };
  }
};
