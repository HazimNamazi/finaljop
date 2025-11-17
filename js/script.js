// سكريبت بوابة الوظائف

// بيانات الوظائف (يمكن استبدالها ببيانات من قاعدة البيانات)
const jobs = [
    {
        id: 1,
        title: "مهندس برمجيات",
        company: "شركة التقنية المتقدمة",
        location: "الرياض",
        salary: "8,000 - 12,000",
        description: "نبحث عن مهندس برمجيات ذو خبرة في تطوير تطبيقات الويب...",
        skills: ["JavaScript", "React"],
        category: "technology"
    },
    {
        id: 2,
        title: "مدير مشاريع",
        company: "شركة التطوير العقاري",
        location: "جدة",
        salary: "10,000 - 15,000",
        description: "نبحث عن مدير مشاريع متخصص في إدارة المشاريع الكبرى...",
        skills: ["إدارة", "قيادة"],
        category: "management"
    },
    {
        id: 3,
        title: "تصميم جرافيكس",
        company: "وكالة التصميم الإبداعي",
        location: "الدمام",
        salary: "6,000 - 9,000",
        description: "نبحث عن مصمم جرافيكس مبدع مع خبرة في التصميم الديجيتال...",
        skills: ["Figma", "Adobe"],
        category: "design"
    }
];

// دالة للبحث عن الوظائف
function searchJobs(query) {
    const results = jobs.filter(job => 
        job.title.includes(query) || 
        job.company.includes(query) ||
        job.location.includes(query)
    );
    return results;
}

// دالة للتقدم للوظيفة
function applyJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        alert(`تم التقدم بنجاح للوظيفة: ${job.title}\nشركة: ${job.company}`);
        // يمكن إضافة منطق لحفظ التطبيق في قاعدة البيانات
    }
}

// دالة لتصفية الوظائف حسب الفئة
function filterJobsByCategory(category) {
    return jobs.filter(job => job.category === category);
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log("تم تحميل بوابة الوظائف بنجاح!");
    
    // إضافة مستمعي الأحداث للأزرار
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert("سيتم التقدم للوظيفة. يرجى تسجيل الدخول أولاً.");
        });
    });

    // البحث الفوري
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            console.log("البحث عن:", this.value);
        });
    }

    // النقر على بطاقات الفئات
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            alert("سيتم نقلك إلى هذه الفئة");
        });
    });
});

// دالة لتنسيق الراتب
function formatSalary(salary) {
    return `ر.س ${salary}`;
}

// دالة لحساب الوقت المنقضي
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " سنة";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " شهر";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " يوم";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " ساعة";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " دقيقة";
    return Math.floor(seconds) + " ثانية";
}

// دالة للتحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// دالة للتحقق من رقم الهاتف السعودي
function validatePhoneNumber(phone) {
    const saudiPhone = /^(\+966|0)?5[0-9]{8}$/;
    return saudiPhone.test(phone);
}

// دالة لحفظ البيانات في localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log("تم حفظ البيانات");
}

// دالة لاسترجاع البيانات من localStorage
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

// دالة لحذف البيانات من localStorage
function clearUserData() {
    localStorage.removeItem('userData');
    console.log("تم حذف البيانات");
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchJobs,
        applyJob,
        filterJobsByCategory,
        formatSalary,
        validateEmail,
        validatePhoneNumber
    };
}

