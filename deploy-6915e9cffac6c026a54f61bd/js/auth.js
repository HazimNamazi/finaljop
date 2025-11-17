// ==============================================
// 🔐 نظام الجلسات الاحترافي (تسجيل الدخول والخروج)
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
    const authArea = document.getElementById("authArea");
    const user = JSON.parse(localStorage.getItem("user"));
  
    // ⚙️ تحديث واجهة شريط التنقل
    function renderAuthUI() {
      if (!authArea) return;
  
      if (user) {
        authArea.innerHTML = `
          <div class="user-menu">
            <span class="user-name">
              <i class="fas fa-user-circle"></i> ${user.name}
            </span>
            <button id="logoutBtn" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
            </button>
          </div>
        `;
        activateLogout();
      } else {
        authArea.innerHTML = `
          <a href="pages/login.html" class="btn btn-login">دخول</a>
          <a href="pages/signup.html" class="btn btn-signup">إنشاء حساب</a>
        `;
      }
    }
  
    // 🚪 تفعيل زر تسجيل الخروج
    function activateLogout() {
      const logoutBtn = document.getElementById("logoutBtn");
      if (!logoutBtn) return;
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        showToast("👋 تم تسجيل الخروج بنجاح", "success");
        setTimeout(() => location.reload(), 1200);
      });
    }
  
    // ✨ إشعارات أنيقة (Toast)
    function showToast(message, type = "info") {
      const existing = document.querySelector(".toast");
      if (existing) existing.remove();
  
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(toast);
  
      setTimeout(() => {
        toast.classList.add("show");
      }, 100);
  
      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    }
  
    // 🚫 حماية الصفحات الخاصة
    const protectedPages = ["/pages/add-job.html", "/pages/profile.html"];
    const currentPage = window.location.pathname;
    if (protectedPages.some(path => currentPage.endsWith(path)) && !user) {
      showToast("⚠️ يجب تسجيل الدخول للوصول إلى هذه الصفحة", "warning");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    }
  
    renderAuthUI();
  });
  