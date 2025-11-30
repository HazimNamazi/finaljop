import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import 'dotenv/config';

export async function handler(event) {
  try {
    // ✅ الاتصال بقاعدة البيانات
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // ✅ قراءة البيانات القادمة من الواجهة الأمامية
    const { username, full_name, email, password, role, user_type, job_title, phone } = JSON.parse(event.body);

    // ✅ تحديد نوع المستخدم (افتراضي job_seeker)
    const type = user_type || (role === "company" ? "company" : "job_seeker");

    // ✅ التحقق من القيم المطلوبة
    if (!username || !full_name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "⚠️ جميع الحقول مطلوبة (الاسم الكامل، اسم المستخدم، البريد، كلمة المرور)."
        }),
      };
    }

    // ✅ التأكد من عدم وجود المستخدم مسبقًا
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

    // ✅ تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ إدخال المستخدم الجديد في قاعدة البيانات
    await sql`
      INSERT INTO users (username, full_name, job_title, phone, email, password, user_type, role, status)
      VALUES (${username}, ${full_name}, ${job_title || null}, ${phone || null}, ${email},
              ${hashedPassword}, ${type}, ${role || "member"}, 'active');
    `;

    // ✅ إرسال رد النجاح
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ تم إنشاء الحساب بنجاح!",
        user: {
          username,
          full_name,
          email,
          user_type: type,
          role: role || "member",
          status: "active",
          phone,
          job_title
        },
      }),
    };

  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء الحساب:", error.message, error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "⚠️ حدث خطأ أثناء إنشاء الحساب.",
        error: error.message,
      }),
    };
  }
}
if (res.status === 200) {
  showAlert(result.message, true);

  // 👇 حفظ بيانات المستخدم قبل التحويل
  localStorage.setItem("user", JSON.stringify(result.user));

  setTimeout(() => {
    if (result.user.user_type === "company") {
      window.location.href = "/pages/company-dashboard.html";
    } else {
      window.location.href = "/pages/jobs.html";
    }
  }, 1200);
}
