import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);

    const { admin_id, title, description, date, time, location, link } = body;

    if (!admin_id || !title || !date || !time) {
      return { statusCode: 400, body: JSON.stringify({ message: "Missing fields" }) };
    }

    const checkUser = await sql`SELECT user_type FROM users WHERE id = ${admin_id}`;
    if (checkUser.length === 0 || checkUser[0].user_type !== "admin") {
      return { statusCode: 403, body: JSON.stringify({ message: "Only admin can create workshops" }) };
    }

    const result = await sql`
      INSERT INTO workshops (admin_id, title, description, date, time, location, link)
      VALUES (${admin_id}, ${title}, ${description}, ${date}, ${time}, ${location}, ${link})
      RETURNING *;
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, workshop: result[0] })
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}
