// ====================== Prompt Hub Pro - app.js ======================

let prompts = [];
let categories = [];
let currentEditIndex = null;
let isDarkMode = false;

// Load from localStorage
function loadData() {
    if (localStorage.getItem('prompts')) {
        prompts = JSON.parse(localStorage.getItem('prompts'));
    }
    if (localStorage.getItem('categories')) {
        categories = JSON.parse(localStorage.getItem('categories'));
    }
    if (localStorage.getItem('theme')) {
        isDarkMode = localStorage.getItem('theme') === 'dark';
        document.body.classList.toggle('dark', isDarkMode);
    }
}

// Save to localStorage
function saveData() {
    localStorage.setItem('prompts', JSON.stringify(prompts));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Toast Notification
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2800);
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Toggle Dark Mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.getElementById('theme-btn').textContent = isDarkMode ? '☀️' : '🌙';
}

// Show Tab
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    render();
}

// Toggle Form (Add / Edit)
function toggleForm(editIndex = null) {
    const form = document.getElementById('form');
    form.classList.toggle('hidden');

    if (editIndex !== null) {
        currentEditIndex = editIndex;
        const p = prompts[editIndex];
        
        document.getElementById('title').value = p.title || '';
        document.getElementById('image').value = p.image || '';
        document.getElementById('category').value = p.category || 'ترند';
        document.getElementById('prompt').value = p.prompt || '';
        document.getElementById('desc').value = p.desc || '';
        document.getElementById('platform').value = p.platform || 'YouTube';
        document.getElementById('videoLink').value = p.video || '';
        document.getElementById('showHome').checked = p.showHome || false;
    } else {
        currentEditIndex = null;
        clearForm();
    }
}

// Add / Update Prompt
function addPrompt() {
    const title = document.getElementById('title').value.trim();
    if (!title) {
        showToast('يجب كتابة عنوان البرومبت', 'error');
        return;
    }

    const newPrompt = {
        title: title,
        image: document.getElementById('image').value.trim(),
        category: document.getElementById('category').value,
        prompt: document.getElementById('prompt').value.trim(),
        desc: document.getElementById('desc').value.trim(),
        platform: document.getElementById('platform').value,
        video: document.getElementById('videoLink').value.trim(),
        showHome: document.getElementById('showHome').checked,
        date: new Date().toISOString()
    };

    if (currentEditIndex !== null) {
        prompts[currentEditIndex] = newPrompt;
        showToast('تم تعديل البرومبت بنجاح');
    } else {
        prompts.unshift(newPrompt);
        showToast('تم إضافة البرومبت بنجاح');
    }

    saveData();
    clearForm();
    toggleForm();
    render();
}

// Delete Prompt
function deletePrompt(index) {
    if (confirm('هل أنت متأكد من حذف هذا البرومبت؟')) {
        prompts.splice(index, 1);
        saveData();
        render();
        showToast('تم الحذف');
    }
}

// Copy Prompt
function copyPrompt(index) {
    const text = prompts[index].prompt;
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ البرومبت ✅');
    });
}

// Render All
function render() {
    const searchValue = document.getElementById('search').value.toLowerCase().trim();

    // Stats in Home
    renderStats();

    // Home Grid (Featured)
    const homeGrid = document.getElementById('homeGrid');
    homeGrid.innerHTML = '';
    prompts.filter(p => p.showHome).forEach((p, i) => {
        homeGrid.innerHTML += createHomeCard(p, i);
    });

    // Prompts List
    const list = document.getElementById('list');
    list.innerHTML = '';

    prompts
        .filter(p => p.title.toLowerCase().includes(searchValue))
        .forEach((p, i) => {
            list.innerHTML += `
                <div class="card">
                    ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ''}
                    <div class="card-content">
                        <h3>${p.title}</h3>
                        <p class="category">${p.category} • ${p.platform}</p>
                        ${p.desc ? `<p class="desc">${p.desc}</p>` : ''}
                        <div class="actions">
                            <button class="btn secondary" onclick="copyPrompt(${i})">📋 نسخ</button>
                            <button class="btn primary" onclick="toggleForm(${i})">تعديل</button>
                            <button class="btn" style="background:#ef4444; color:white;" onclick="deletePrompt(${i})">حذف</button>
                        </div>
                    </div>
                </div>
            `;
        });

    renderCategories();
}

// Render Statistics
function renderStats() {
    const html = `
        <div class="stat-card">
            <h3>${prompts.length}</h3>
            <p>إجمالي البرومبتات</p>
        </div>
        <div class="stat-card">
            <h3>${prompts.filter(p => p.showHome).length}</h3>
            <p>في الرئيسية</p>
        </div>
        <div class="stat-card">
            <h3>${categories.length}</h3>
            <p>الأقسام</p>
        </div>
    `;
    document.getElementById('stats').innerHTML = html;
}

// Home Card
function createHomeCard(p, i) {
    return `
        <div class="card">
            ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ''}
            <div class="card-content">
                <h3>${p.title}</h3>
                <p>${p.category}</p>
                <div class="actions">
                    <button class="btn secondary" onclick="copyPrompt(${i})">📋 نسخ</button>
                    <button class="btn primary" onclick="toggleForm(${i})">تعديل</button>
                </div>
            </div>
        </div>
    `;
}

// Categories
function addCategory() {
    const name = document.getElementById('catName').value.trim();
    if (name && !categories.includes(name)) {
        categories.push(name);
        saveData();
        render();
        showToast('تم إضافة القسم');
        document.getElementById('catName').value = '';
    }
}

function renderCategories() {
    const container = document.getElementById('catList');
    container.innerHTML = '';
    categories.forEach((cat, i) => {
        container.innerHTML += `
            <div class="card">
                <h3>${cat}</h3>
                <button onclick="deleteCategory(${i})" style="background:#ef4444;color:white;padding:8px 15px;border:none;border-radius:8px;cursor:pointer;">حذف</button>
            </div>
        `;
    });
}

function deleteCategory(i) {
    if (confirm('حذف هذا القسم؟')) {
        categories.splice(i, 1);
        saveData();
        render();
    }
}

// Clear Form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('image').value = '';
    document.getElementById('prompt').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('videoLink').value = '';
    document.getElementById('showHome').checked = false;
}

// Initialize
window.onload = () => {
    loadData();
    render();
    document.getElementById('theme-btn').textContent = isDarkMode ? '☀️' : '🌙';
};
