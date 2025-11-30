import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import 'dotenv/config';

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const {
      username,
      full_name,
      email,
      password,
      phone,
      job_title,
      user_type
    } = JSON.parse(event.body);

    // 👈 فقط طالب أو شركة
    const type = user_type === "company" ? "company" : "job_seeker";

    if (!username || !full_name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "⚠️ جميع الحقول مطلوبة." }),
      };
    }

    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email} OR username = ${username};
    `;

    if (existingUser.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "⚠️ البريد الإلكتروني أو اسم المستخدم مستخدم مسبقًا."
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users 
        (username, full_name, job_title, phone, email, password, user_type, role, status)
      VALUES 
        (${username}, ${full_name}, ${job_title || null}, ${phone || null},
         ${email}, ${hashedPassword}, ${type}, ${type}, 'active');
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم إنشاء الحساب بنجاح!",
        user: {
          username,
          email,
          full_name,
          user_type: type,
          role: type,
          phone
        },
      }),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "⚠️ حدث خطأ أثناء إنشاء الحساب.",
        error: err.message
      }),
    };
  }
}
