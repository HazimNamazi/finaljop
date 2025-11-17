# 🗄️ هيكل قاعدة البيانات - Job Portal

دليل شامل لهيكل قاعدة البيانات المستخدمة في بوابة الوظائف.

---

## 📊 الجداول الرئيسية

### 1. جدول المستخدمين (users)

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(255),
    user_type ENUM('job_seeker', 'company', 'admin') DEFAULT 'job_seeker',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. جدول الشركات (companies)

```sql
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    logo VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(100),
    employee_count INT,
    founded_year INT,
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. جدول الوظائف (jobs)

```sql
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    job_type ENUM('full_time', 'part_time', 'contract', 'freelance') DEFAULT 'full_time',
    salary_min INT,
    salary_max INT,
    experience_level ENUM('entry', 'junior', 'mid', 'senior') DEFAULT 'junior',
    required_skills JSON,
    deadline DATE,
    views INT DEFAULT 0,
    status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

### 4. جدول الملفات الشخصية (job_seeker_profiles)

```sql
CREATE TABLE job_seeker_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    resume_url VARCHAR(255),
    profile_picture VARCHAR(255),
    location VARCHAR(100),
    experience_years INT,
    current_position VARCHAR(100),
    education_level VARCHAR(50),
    university VARCHAR(100),
    skills JSON,
    languages JSON,
    certifications JSON,
    portfolio_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. جدول الطلبات (applications)

```sql
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'reviewed', 'rejected', 'accepted') DEFAULT 'pending',
    cover_letter TEXT,
    rating INT,
    review_notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id)
);
```

### 6. جدول الوظائف المحفوظة (saved_jobs)

```sql
CREATE TABLE saved_jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved (user_id, job_id)
);
```

### 7. جدول الفئات (categories)

```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    slug VARCHAR(100) UNIQUE,
    job_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. جدول المدن (cities)

```sql
CREATE TABLE cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100),
    job_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. جدول الرسائل (messages)

```sql
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 10. جدول التقييمات (reviews)

```sql
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (company_id, user_id)
);
```

---

## 🔑 المفاتيح والعلاقات

### العلاقات الرئيسية:

1. **المستخدمون ↔ الشركات**: علاقة 1-to-1
2. **المستخدمون ↔ الملفات الشخصية**: علاقة 1-to-1
3. **الشركات ↔ الوظائف**: علاقة 1-to-Many
4. **الوظائف ↔ الطلبات**: علاقة 1-to-Many
5. **المستخدمون ↔ الطلبات**: علاقة 1-to-Many
6. **المستخدمون ↔ الوظائف المحفوظة**: علاقة Many-to-Many

---

## 🔍 الفهارس (Indexes)

```sql
-- لتحسين الأداء في البحث
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_status ON jobs(status);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
```

---

## 📝 أمثلة على الاستعلامات

### البحث عن الوظائف
```sql
SELECT * FROM jobs 
WHERE category = 'technology' 
  AND location = 'Riyadh' 
  AND salary_max >= 8000
  AND status = 'active'
ORDER BY created_at DESC;
```

### الحصول على الطلبات للوظيفة
```sql
SELECT u.full_name, u.email, a.status, a.applied_at
FROM applications a
JOIN users u ON a.user_id = u.id
WHERE a.job_id = 1
ORDER BY a.applied_at DESC;
```

### الوظائف المحفوظة للمستخدم
```sql
SELECT j.* FROM jobs j
JOIN saved_jobs s ON j.id = s.job_id
WHERE s.user_id = 5
ORDER BY j.created_at DESC;
```

### تقييمات الشركة
```sql
SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
FROM reviews
WHERE company_id = 10;
```

---

## 🛡️ إجراءات الأمان

### 1. التشفير
```sql
-- تشفير كلمات المرور (استخدم bcrypt في الكود)
UPDATE users SET password = SHA2(password, 256) WHERE password IS NOT NULL;
```

### 2. الأذونات
```sql
-- إنشاء حساب قاعدة بيانات آمن
CREATE USER 'job_portal_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON job_portal.* TO 'job_portal_user'@'localhost';
```

### 3. النسخ الاحتياطية
```bash
# نسخ احتياطية يومية
mysqldump -u root -p job_portal > backup_$(date +%Y%m%d).sql
```

---

## 📈 نصائح التحسين

1. **التفكيك**: فكّك الجداول بشكل صحيح (Normalization)
2. **الفهارسة**: استخدم الفهارس للأعمدة المستخدمة كثيراً في البحث
3. **المعاملات**: استخدم المعاملات (Transactions) للعمليات الحساسة
4. **التخزين المؤقت**: استخدم caching للبيانات المتكررة

---

## 🔄 ترتيب الإنشاء الموصى به

1. `users` - الجدول الأساسي
2. `categories` و `cities` - جداول المراجع
3. `companies` - يعتمد على users
4. `job_seeker_profiles` - يعتمد على users
5. `jobs` - يعتمد على companies و categories
6. `applications` - يعتمد على jobs و users
7. `saved_jobs` - يعتمد على jobs و users
8. `messages` - يعتمد على users
9. `reviews` - يعتمد على companies و users

---

*تم الإنشاء بـ ❤️ لبوابة الوظائف*
