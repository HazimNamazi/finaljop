import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export async function handler(event) {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يرجى إدخال البريد الإلكتروني وكلمة المرور." }),
      };
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "⚠️ البريد الإلكتروني غير موجود." }),
      };
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "❌ كلمة المرور غير صحيحة." }),
      };
    }

    // 🔥 نرجّع فقط الاسم + القسم + نوع المستخدم
    const safeUser = {
      id: user.id,                  // ← أهم سطر
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      department: user.department
    };
    

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم تسجيل الدخول بنجاح!",
        user: safeUser
      }),
    };

  } catch (error) {
    console.error("⚠️ خطأ أثناء تسجيل الدخول:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ حدث خطأ في الخادم.",
        error: error.message,
      }),
    };
  }
}
