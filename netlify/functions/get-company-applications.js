const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const company_id = event.queryStringParameters.company_id;

    const rows = await sql`
      SELECT applications.id, applications.status, applications.cv_link, applications.interview_date,
             jobs.job_title, jobs.salary_range, jobs.location,
             users.full_name AS applicant_name, users.email
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      JOIN users ON applications.student_id = users.id
      WHERE jobs.company_id = ${company_id}
      ORDER BY applications.id DESC;
    `;

    return { statusCode: 200, body: JSON.stringify(rows) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
