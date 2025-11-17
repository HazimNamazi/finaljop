const { neon } = require("@neondatabase/serverless");

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const company_id = event.queryStringParameters.company_id;

    const rows = await sql`
      SELECT * FROM jobs WHERE company_id = ${company_id} ORDER BY id DESC;
    `;

    return { statusCode: 200, body: JSON.stringify(rows) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};
