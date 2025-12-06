import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export async function handler(event) {
  try {
    // اتصال قاعدة البيانات
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // قراءة بيانات الإدخال
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "❌ يرجى إدخال البريد الإلكتروني وكلمة المرور." }),
      };
    }

    // التحقق من وجود المستخدم
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "⚠️ البريد الإلكتروني غير موجود." }),
      };
    }

    const user = users[0];

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "❌ كلمة المرور غير صحيحة." }),
      };
    }

    // *** النقطة المهمة جداً ***
    // user_type يأتي من قاعدة البيانات وليس role
    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,  // ← هنا السحر
      status: user.status,
    };

    // نجاح تسجيل الدخول
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم تسجيل الدخول بنجاح!",
        user: safeUser,
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
