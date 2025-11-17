const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    await sql`
      INSERT INTO applications (job_id, student_id, cv_link, status)
      VALUES (${body.job_id}, ${body.student_id}, ${body.cv_link}, 'جديد');
    `;

    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success:false, message: err.message }) };
  }
};
