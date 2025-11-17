// 🧠 تحميل بيانات الشركة المسجّلة الدخول
const companyUser = JSON.parse(localStorage.getItem("user"));
if (!companyUser || companyUser.user_type !== "company") {
  alert("⚠️ يجب تسجيل الدخول كـ شركة أولاً");
  window.location.href = "login.html";
}

// ✳️ تعريف العناصر من الصفحة
const jobsSection = document.getElementById("jobsSection");
const appsSection = document.getElementById("applicationsSection");
const addJobBtn = document.getElementById("addJobBtn");
const jobModal = document.getElementById("jobModal");
const jobForm = document.getElementById("jobForm");
const jobsList = document.getElementById("jobsList");
const appsList = document.getElementById("applicationsList");

// 📌 تبديل الأقسام (وظائف / طلبات)
document.getElementById("nav-jobs").onclick = () => {
  jobsSection.style.display = "block";
  appsSection.style.display = "none";
};
document.getElementById("nav-apps").onclick = () => {
  jobsSection.style.display = "none";
  appsSection.style.display = "block";
};

// 🔹 تحميل الوظائف الخاصة بالشركة فقط
async function loadCompanyJobs() {
  try {
    // ✅ أرسل رقم الشركة كـ باراميتر
    const response = await fetch(`/.netlify/functions/get-company-jobs?companyId=${companyUser.id}`);
    const data = await response.json();

    if (!data.length) {
      jobsList.innerHTML = "<p class='empty'>لا توجد وظائف منشورة بعد.</p>";
      return;
    }

    jobsList.innerHTML = "";
    data.forEach(job => {
      const div = document.createElement("div");
      div.className = "job-card";
      div.innerHTML = `
        <h3>${job.title}</h3>
        <p>📍 ${job.location}</p>
        <p>📩 عدد المتقدمين: <strong>${job.applicants_count || 0}</strong></p>
        <small>📅 ${new Date(job.created_at).toLocaleString("ar-SA")}</small>
        <div class="actions">
          <button class="view-btn" onclick="viewApplications(${job.id})">👁️ عرض الطلبات</button>
          <button class="delete-btn" onclick="deleteJob(${job.id})">🗑️ حذف الوظيفة</button>
        </div>
      `;
      jobsList.appendChild(div);
    });
  } catch (err) {
    console.error("❌ خطأ أثناء تحميل الوظائف:", err);
    jobsList.innerHTML = "<p class='error'>حدث خطأ أثناء تحميل الوظائف.</p>";
  }
}

// 🔹 فتح نموذج إضافة وظيفة
addJobBtn.onclick = () => (jobModal.style.display = "flex");

// 🔹 إغلاق النموذج عند الضغط خارج المحتوى
jobModal.onclick = (e) => {
  if (e.target === jobModal) jobModal.style.display = "none";
};

// 🔹 إرسال نموذج إضافة وظيفة جديدة
jobForm.onsubmit = async (e) => {
  e.preventDefault();

  const newJob = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value.trim(),
    companyId: companyUser.id, // ✅ مهم جدًا لربط الوظيفة بالشركة
  };

  if (!newJob.title || !newJob.description || !newJob.location) {
    alert("❌ يرجى ملء جميع الحقول.");
    return;
  }

  try {
    const res = await fetch("/.netlify/functions/add-job", {
      method: "POST",
      body: JSON.stringify(newJob),
    });

    const result = await res.json();
    alert(result.message);
    jobModal.style.display = "none";
    jobForm.reset();
    loadCompanyJobs();
  } catch (err) {
    console.error("⚠️ خطأ في إضافة الوظيفة:", err);
  }
};

// 🔹 عرض الطلبات الخاصة بوظيفة معينة
async function viewApplications(jobId) {
  jobsSection.style.display = "none";
  appsSection.style.display = "block";

  try {
    const response = await fetch(`/.netlify/functions/get-company-applications?jobId=${jobId}`);
    const data = await response.json();

    if (!data.length) {
      appsList.innerHTML = "<p class='empty'>لا توجد طلبات لهذه الوظيفة.</p>";
      return;
    }

    appsList.innerHTML = "";
    data.forEach(app => {
      const div = document.createElement("div");
      div.className = "application-card";
      div.innerHTML = `
        <h3>${app.applicant_name}</h3>
        <p>📧 ${app.applicant_email}</p>
        <p>📄 الحالة: <strong>${app.status}</strong></p>
        <div class="actions">
          <button class="accept-btn" onclick="updateStatus(${app.id}, 'accepted')">✅ قبول</button>
          <button class="reject-btn" onclick="updateStatus(${app.id}, 'rejected')">❌ رفض</button>
        </div>
      `;
      appsList.appendChild(div);
    });
  } catch (err) {
    console.error("⚠️ خطأ أثناء تحميل الطلبات:", err);
  }
}

// 🔹 تحديث حالة الطلب (قبول / رفض)
async function updateStatus(id, status) {
  try {
    const res = await fetch("/.netlify/functions/update-application-status", {
      method: "POST",
      body: JSON.stringify({ id, status }),
    });
    const result = await res.json();
    alert(result.message);
    loadCompanyJobs(); // تحديث الوظائف بعد التغيير
  } catch (err) {
    console.error("❌ خطأ في تحديث الحالة:", err);
  }
}

// 🔹 حذف وظيفة معينة
async function deleteJob(jobId) {
  const confirmDelete = confirm("هل أنت متأكد أنك تريد حذف هذه الوظيفة؟");
  if (!confirmDelete) return;

  try {
    const res = await fetch("/.netlify/functions/delete-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    const result = await res.json();
    alert(result.message);

    if (res.ok) loadCompanyJobs(); // إعادة تحميل الوظائف بعد الحذف
  } catch (err) {
    console.error("⚠️ خطأ أثناء حذف الوظيفة:", err);
    alert("❌ حدث خطأ أثناء حذف الوظيفة.");
  }
}

// 🔹 تحميل الوظائف عند فتح الصفحة
loadCompanyJobs();
