// ============ المتغيرات العامة ============
const users = JSON.parse(localStorage.getItem('users')) || [];

const doctors = {
  1: {
      name: "د. محمد رمضان",
      image: "img/1.jpg",
      subjects: ["Java"],
      schedule: [
          { subject: "Java", day: "السبت", time: "1:50 ص - 1:00 م", hall: "B401", group: "1" },
          { subject: "Java", day: "الخميس", time: "11:40 م - 10:50 م", hall: "B401", group: "2" }
      ]
  },
  2: {
    name: "د. رشا السطوحي",
    image: "img/1.jpg",
    subjects: ["Web Programming"],
    schedule: [
        { subject: "Web Programming", day: "الأحد", time: "1:50 م - 1:00 م", hall: "A105", group: "1" },
        { subject: "Web Programming", day: "الثلاثاء", time: "1:50 م - 1:00 م", hall: "A105", group: "2" }
    ]
},
3: {
    name: "د. ايات طه",
    image: "img/1.jpg",
    subjects: ["Database"],
    schedule: [
        { subject: "Database", day: "الاربعاء", time: "9:50 ص - 9:00 ص", hall: "B302", group: "2" },
        { subject: "Database", day: "الاربعاء", time: "10:40 ص - 9:50 ص", hall: "B302", group: "1" }
    ]
},
4: {
    name: "د. ايمان منير",
    image: "img/1.jpg",
    subjects: ["Data Structure"],
    schedule: [
        { subject: "Database", day: "الاربعاء", time: "2:40 م - 1:00 م", hall: "C202", group: "2 & A" }
    ]
},
5: {
    name: "د. رحاب",
    image: "img/1.jpg",
    subjects: ["CCNA"],
    schedule: [
        { subject: "Database", day: "السبت", time: "12:30 ص - 10:50 ص", hall: "C204", group: "2 & 1" }
    ]
}

};

// ============ وظائف إدارة كلمة المرور ============
function togglePasswordVisibility(icon) {
    const targetId = icon.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    
    if (!passwordInput) {
        console.error('عنصر إدخال كلمة المرور غير موجود');
        return;
    }
    
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    icon.classList.toggle('fa-eye-slash');
    icon.classList.toggle('fa-eye');
}

function setupPasswordToggle() {
    document.querySelectorAll('.password-wrapper i').forEach(icon => {
        icon.addEventListener('click', () => togglePasswordVisibility(icon));
    });
}

// ============ وظائف إدارة المستخدمين ============
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function registerUser(name, email, password) {
    if (users.some(user => user.email === email)) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل!');
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
}

function loginUser(email, password) {
    return users.find(user => user.email === email && user.password === password);
}

// ============ معالجة النماذج ============
function handleSignup(e) {
    e.preventDefault();
    
    try {
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('#signupPassword').value;
        const confirmPassword = this.querySelector('#confirmPassword')?.value;
        
        if (!name || !email || !password) {
            throw new Error('الرجاء ملء جميع الحقول المطلوبة!');
        }
        
        if (!validateEmail(email)) {
            throw new Error('البريد الإلكتروني غير صالح!');
        }
        
        if (confirmPassword && password !== confirmPassword) {
            throw new Error('كلمتا المرور غير متطابقتين!');
        }
        
        if (!validatePassword(password)) {
            throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل!');
        }
        
        registerUser(name, email, password);
        alert('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول');
        this.reset();
        switchToLoginForm();
    } catch (error) {
        alert(error.message);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    try {
        const email = this.querySelector('input[type="email"]').value.trim();
        const password = this.querySelector('#signinPassword').value;
        
        if (!email || !password) {
            throw new Error('الرجاء إدخال البريد الإلكتروني وكلمة المرور!');
        }
        
        const user = loginUser(email, password);
        
        if (!user) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة!');
        }
        
        alert(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح`);
        window.location.href = 'profile.html';
    } catch (error) {
        alert(error.message);
    }
}

// ============ وظائف إدارة الأطباء ============
function loadDoctorData() {
    if (!window.location.pathname.includes('doc.html')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    
    if (!doctors[doctorId]) {
        alert('دكتور غير موجود!');
        window.location.href = 'home.html';
        return;
    }
    
    const doctor = doctors[doctorId];
    
    // عرض بيانات الدكتور
    document.getElementById('doctorName').textContent = doctor.name;
    
    // عرض أيقونة الدكتور
    const doctorIcon = document.getElementById('doctorIcon');
    if (doctorIcon) {
        doctorIcon.innerHTML = `<i class="bi bi-person-circle"></i>`;
    }
    
    // عرض المواد
    renderSubjectsList(doctor.subjects);
    
    // عرض الجدول الزمني
    renderScheduleTable(doctor.schedule);
}

function renderSubjectsList(subjects) {
    const subjectsList = document.getElementById('subjectsList');
    if (!subjectsList) return;
    
    subjectsList.innerHTML = subjects.map(subject => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="subject-name">${subject}</span>
            
        </li>
    `).join('');
}

function renderScheduleTable(schedule) {
    const scheduleBody = document.getElementById('scheduleBody');
    if (!scheduleBody) return;
    
    scheduleBody.innerHTML = schedule.map(lecture => `
        <tr>
            <td class="subject-cell">${lecture.subject}</td>
            <td class="day-cell">${lecture.day}</td>
            <td class="time-cell">${lecture.time}</td>
            <td class="hall-cell">${lecture.hall}</td>
            <td class="group-cell">${lecture.group}</td>
        </tr>
    `).join('');
}
// ============ وظائف تبديل النماذج ============
function switchToLoginForm() {
    document.getElementById('container')?.classList.remove("active");
}

function switchToRegisterForm() {
    document.getElementById('container')?.classList.add("active");
}

function setupFormSwitchers() {
    document.getElementById('login')?.addEventListener('click', switchToLoginForm);
    document.getElementById('register')?.addEventListener('click', switchToRegisterForm);
}

// ============ وظيفة تسجيل الخروج ============
function logout() {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
        localStorage.removeItem('currentUser'); // إذا كنت تخزن بيانات تسجيل الدخول
        alert("تم تسجيل الخروج بنجاح!");
        window.location.href = 'index.html';
    }
    return false; // لمنع السلوك الافتراضي لأي عنصر
}

// جعل الدالة متاحة عالمياً بطرق متعددة للتأكد
window.logout = logout;
document.logout = logout;
// ============ تهيئة الصفحة ============
function initializePage() {
    setupPasswordToggle();
    setupFormSwitchers();
    
    document.querySelector('.sign-up form')?.addEventListener('submit', handleSignup);
    document.querySelector('.sign-in form')?.addEventListener('submit', handleLogin);
    document.getElementById('searchForm')?.addEventListener('submit', searchDoctors);
    
    loadDoctorData();
}

// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializePage);
window.logout = logout;

