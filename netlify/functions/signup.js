import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import 'dotenv/config';

export async function handler(event) {
  try {
    // الاتصال بقاعدة البيانات
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    // قراءة البيانات من الواجهة
    const { 
      username, 
      full_name, 
      email, 
      password, 
      role, 
      user_type, 
      job_title, 
      phone,
      department        // ← تمت إضافته
    } = JSON.parse(event.body);

    // نوع المستخدم
    const type = user_type || (role === "company" ? "company" : "job_seeker");

    // التحقق من القيم المطلوبة
    if (!username || !full_name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "⚠️ جميع الحقول مطلوبة (الاسم الكامل، اسم المستخدم، البريد، كلمة المرور)."
        }),
      };
    }

    // التحقق من وجود المستخدم مسبقًا
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

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ⚡ تحديد department الصحيح حسب نوع المستخدم
    const departmentValue = type === "company" ? null : (department || null);

    // إدخال المستخدم الجديد
    await sql`
      INSERT INTO users 
      (username, full_name, job_title, phone, email, password, user_type, role, status, department)
      VALUES (
        ${username}, 
        ${full_name}, 
        ${type === "company" ? job_title : null}, 
        ${phone || null}, 
        ${email},
        ${hashedPassword}, 
        ${type}, 
        ${role || "member"}, 
        'active',
        ${departmentValue}       -- ← تم إضافة القسم
      );
    `;

    // رد النجاح
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
          job_title: type === "company" ? job_title : null,
          department: departmentValue
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
