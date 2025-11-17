// js/lang.js

let currentLang = "ar";

const translations = {
  ar: {
    // Navbar
    nav_logo: "بوابة الوظائف",
    nav_jobs: "الوظائف",
    nav_profile: "الملف الشخصي",
    nav_login_btn: "تسجيل الدخول",
    nav_signup_btn: "إنشاء حساب",
    nav_logout_btn: "تسجيل الخروج",

    // Login page
    login_title: "تسجيل الدخول",
    login_subtitle: "مرحبًا بعودتك! سجّل دخولك للوصول إلى حسابك",
    login_email_placeholder: "البريد الإلكتروني",
    login_password_placeholder: "كلمة المرور",
    login_submit: "تسجيل الدخول",
    login_no_account: "ليس لديك حساب؟",
    login_go_signup: "إنشاء حساب جديد",

    // Signup page
    signup_title: "إنشاء حساب",
    signup_subtitle: "إنشئ حسابًا جديدًا كطالب أو شركة",
    signup_full_name_placeholder: "الاسم الكامل",
    signup_email_placeholder: "البريد الإلكتروني",
    signup_password_placeholder: "كلمة المرور",
    signup_confirm_password_placeholder: "تأكيد كلمة المرور",
    signup_role_label: "نوع الحساب",
    signup_role_student: "طالب / باحث عن عمل",
    signup_role_company: "شركة",
    signup_submit: "إنشاء الحساب",
    signup_have_account: "لديك حساب مسبقًا؟",
    signup_go_login: "تسجيل الدخول",

    // Jobs page
    jobs_title: "الوظائف المتاحة",
    jobs_loading: "⏳ جارٍ تحميل الوظائف...",
    jobs_empty: "🚫 لا توجد وظائف متاحة حاليًا",
    jobs_apply_btn: "📩 التقديم على الوظيفة",

    // Profile page
    profile_title: "الملف الشخصي",
    profile_full_name: "الاسم الكامل:",
    profile_email: "البريد الإلكتروني:",
    profile_user_type: "نوع المستخدم:",
    profile_status: "الحالة:",
    profile_back_to_jobs: "⬅️ العودة للوظائف",
    profile_logout: "تسجيل الخروج",

    // Company dashboard
    company_dashboard_title: "لوحة تحكم الشركات",
    company_dashboard_welcome_prefix: "مرحبًا، ",
    company_add_job_btn: "➕ إضافة وظيفة جديدة",
    company_add_job_title: "إضافة وظيفة جديدة",
    company_job_title_placeholder: "المسمى الوظيفي",
    company_job_desc_placeholder: "الوصف الوظيفي",
    company_job_location_placeholder: "الموقع",
    company_job_salary_placeholder: "الراتب",
    company_job_submit_btn: "📢 نشر الوظيفة",
    company_jobs_list_title: "📋 الوظائف المنشورة",
    company_jobs_empty: "🚫 لا توجد وظائف منشورة بعد.",
    company_apps_title: "📨 الطلبات المقدمة",
    company_apps_filter_label: "تصفية الطلبات:",
    company_apps_filter_all: "كل الطلبات",
    company_apps_filter_new: "الجديدة فقط",
    company_apps_filter_accepted: "المقبولة",
    company_apps_filter_rejected: "المرفوضة",

    // Apply page
    apply_title: "التقديم على الوظيفة",
    apply_full_name_label: "الاسم الكامل",
    apply_email_label: "البريد الإلكتروني",
    apply_phone_label: "رقم الجوال",
    apply_resume_url_label: "رابط السيرة الذاتية (Drive أو LinkedIn)",
    apply_cover_letter_label: "رسالة التغطية (اختياري)",
    apply_submit_btn: "📨 إرسال الطلب",

    // Generic
    lang_btn_ar: "عربي",
    lang_btn_en: "EN"
  },

  en: {
    // Navbar
    nav_logo: "Jobs Portal",
    nav_jobs: "Jobs",
    nav_profile: "Profile",
    nav_login_btn: "Login",
    nav_signup_btn: "Sign Up",
    nav_logout_btn: "Logout",

    // Login page
    login_title: "Login",
    login_subtitle: "Welcome back! Login to access your account",
    login_email_placeholder: "Email",
    login_password_placeholder: "Password",
    login_submit: "Login",
    login_no_account: "Don’t have an account?",
    login_go_signup: "Create a new account",

    // Signup page
    signup_title: "Create Account",
    signup_subtitle: "Create a new account as a student or a company",
    signup_full_name_placeholder: "Full name",
    signup_email_placeholder: "Email",
    signup_password_placeholder: "Password",
    signup_confirm_password_placeholder: "Confirm password",
    signup_role_label: "Account type",
    signup_role_student: "Student / Job Seeker",
    signup_role_company: "Company",
    signup_submit: "Sign Up",
    signup_have_account: "Already have an account?",
    signup_go_login: "Login",

    // Jobs page
    jobs_title: "Available Jobs",
    jobs_loading: "⏳ Loading jobs...",
    jobs_empty: "🚫 No jobs available at the moment",
    jobs_apply_btn: "📩 Apply for this job",

    // Profile page
    profile_title: "Profile",
    profile_full_name: "Full name:",
    profile_email: "Email:",
    profile_user_type: "User type:",
    profile_status: "Status:",
    profile_back_to_jobs: "⬅️ Back to jobs",
    profile_logout: "Logout",

    // Company dashboard
    company_dashboard_title: "Company Dashboard",
    company_dashboard_welcome_prefix: "Welcome, ",
    company_add_job_btn: "➕ Add new job",
    company_add_job_title: "Add new job",
    company_job_title_placeholder: "Job title",
    company_job_desc_placeholder: "Job description",
    company_job_location_placeholder: "Location",
    company_job_salary_placeholder: "Salary",
    company_job_submit_btn: "📢 Publish job",
    company_jobs_list_title: "📋 Posted jobs",
    company_jobs_empty: "🚫 No jobs posted yet.",
    company_apps_title: "📨 Applications",
    company_apps_filter_label: "Filter applications:",
    company_apps_filter_all: "All",
    company_apps_filter_new: "New",
    company_apps_filter_accepted: "Accepted",
    company_apps_filter_rejected: "Rejected",

    // Apply page
    apply_title: "Apply for the Job",
    apply_full_name_label: "Full name",
    apply_email_label: "Email",
    apply_phone_label: "Phone number",
    apply_resume_url_label: "CV URL (Drive or LinkedIn)",
    apply_cover_letter_label: "Cover letter (optional)",
    apply_submit_btn: "📨 Submit application",

    // Generic
    lang_btn_ar: "عربي",
    lang_btn_en: "EN"
  }
};

function setDirection(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.remove("rtl", "ltr");
  document.body.classList.add(lang === "ar" ? "rtl" : "ltr");
}

function applyTranslations(lang) {
  currentLang = lang;
  const t = translations[lang] || translations.ar;

  // النصوص العادية
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.innerHTML = t[key];
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.placeholder = t[key];
  });

  // زر اللغة
  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.textContent = lang === "ar" ? t.lang_btn_en : t.lang_btn_ar;
  }
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  setDirection(lang);
  applyTranslations(lang);
}

function initUserMenu() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navUserName = document.getElementById("navUserName");
  const navUserText = document.getElementById("navUserText");
  const loginBtn = document.getElementById("loginNavBtn");
  const signupBtn = document.getElementById("signupNavBtn");
  const logoutBtn = document.getElementById("logoutNavBtn");

  if (user && navUserName && navUserText && logoutBtn) {
    navUserName.style.display = "flex";
    navUserText.textContent = user.full_name || user.email || "";
    logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
  } else {
    if (navUserName) navUserName.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
  }
}

function handleLogout() {
  localStorage.removeItem("user");
  alert(currentLang === "ar" ? "تم تسجيل الخروج بنجاح 👋" : "Logged out successfully 👋");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("lang") || "ar";
  setLanguage(saved);
  initUserMenu();

  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = currentLang === "ar" ? "en" : "ar";
      setLanguage(next);
    });
  }

  const logoutBtn = document.getElementById("logoutNavBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});
