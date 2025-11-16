document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔹 قراءة القيم من الحقول
  const username = document.getElementById("username").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const user_type = document.querySelector('input[name="userType"]:checked').value;

  // ✅ تأكد من أن القيم ليست فارغة
  if (!username || !full_name || !email || !password) {
    alert("⚠️ يرجى تعبئة جميع الحقول.");
    return;
  }

  const data = {
    username,
    full_name,
    email,
    password,
    user_type, // "job_seeker" أو "company"
    role: user_type
  };

  console.log("🚀 البيانات المرسلة:", data);

  try {
    const res = await fetch("/.netlify/functions/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log("📦 رد السيرفر:", result);

    if (res.status === 200) {
      alert(result.message);

      // ✅ توجيه حسب نوع الحساب
      if (user_type === "company") {
        window.location.href = "../pages/company-dashboard.html";
      } else {
        window.location.href = "../pages/student-dashboard.html";
      }
    } else {
      alert(result.message || "⚠️ حدث خطأ أثناء إنشاء الحساب.");
    }

  } catch (err) {
    console.error("❌ خطأ أثناء الإرسال:", err);
    alert("⚠️ تعذر الاتصال بالسيرفر.");
  }
});
