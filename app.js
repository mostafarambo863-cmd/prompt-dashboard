// ====================== Prompt Hub Pro - app.js ======================

let prompts = [];
let categories = [];
let currentEditIndex = null;
let isDarkMode = false;

// Load data from localStorage
function loadData() {
    const savedPrompts = localStorage.getItem('prompts');
    const savedCategories = localStorage.getItem('categories');
    const savedTheme = localStorage.getItem('theme');

    if (savedPrompts) prompts = JSON.parse(savedPrompts);
    if (savedCategories) categories = JSON.parse(savedCategories);
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
        document.body.classList.toggle('dark', isDarkMode);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('prompts', JSON.stringify(prompts));
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Toggle Sidebar (for mobile)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Toggle Dark/Light Mode
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    const themeBtn = document.getElementById('theme-btn');
    themeBtn.textContent = isDarkMode ? '☀️' : '🌙';
}

// Show Tab
function showTab(id) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });
    
    document.getElementById(id).classList.add('active');
    document.getElementById(id).classList.remove('hidden');

    // Re-render when switching tabs
    render();
}

// Toggle Add Form
function toggleForm(editIndex = null) {
    const form = document.getElementById('form');
    form.classList.toggle('hidden');

    if (editIndex !== null) {
        currentEditIndex = editIndex;
        const p = prompts[editIndex];
        
        document.getElementById('title').value = p.title;
        document.getElementById('image').value = p.image || '';
        document.getElementById('category').value = p.category;
        document.getElementById('prompt').value = p.prompt;
        document.getElementById('desc').value = p.desc || '';
        document.getElementById('platform').value = p.platform;
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
        showToast('يرجى إدخال عنوان البرومبت', 'error');
        return;
    }

    const data = {
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
        prompts[currentEditIndex] = data;
        showToast('تم تعديل البرومبت بنجاح');
    } else {
        prompts.unshift(data); // Add to top
        showToast('تم إضافة البرومبت بنجاح');
    }

    saveData();
    clearForm();
    toggleForm();
    render();
}

// Delete Prompt with confirmation
function deletePrompt(i) {
    if (confirm('هل أنت متأكد من حذف هذا البرومبت؟')) {
        prompts.splice(i, 1);
        saveData();
        render();
        showToast('تم حذف البرومبت');
    }
}

// Copy Prompt to Clipboard
function copyPrompt(i) {
    const promptText = prompts[i].prompt;
    navigator.clipboard.writeText(promptText).then(() => {
        showToast('تم نسخ البرومبت إلى الحافظة');
    });
}

// Render Everything
function render() {
    const searchVal = document.getElementById('search').value.toLowerCase().trim();

    // Home Stats
    renderStats();

    // Home Featured Prompts
    const homeGrid = document.getElementById('homeGrid');
    homeGrid.innerHTML = '';
    
    const featured = prompts.filter(p => p.showHome);
    featured.forEach((p, idx) => {
        const originalIndex = prompts.indexOf(p);
        homeGrid.innerHTML += createCard(p, originalIndex);
    });

    // Prompts List
    const list = document.getElementById('list');
    list.innerHTML = '';

    prompts
        .filter(p => p.title.toLowerCase().includes(searchVal))
        .forEach((p, i) => {
            list.innerHTML += `
                <div class="card">
                    ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ''}
                    <div class="card-content">
                        <h3>${p.title}</h3>
                        <p class="category">${p.category} • ${p.platform}</p>
                        <p class="desc">${p.desc || 'لا يوجد وصف'}</p>
                        
                        <div class="actions">
                            <button class="btn secondary" onclick="copyPrompt(${i})">📋 نسخ</button>
                            <button class="btn primary" onclick="toggleForm(${i})">تعديل</button>
                            <button class="btn" style="background:#ef4444;color:white;" onclick="deletePrompt(${i})">حذف</button>
                        </div>
                    </div>
                </div>
            `;
        });

    // Categories
    renderCategories();
}

// Render Statistics
function renderStats() {
    const statsHTML = `
        <div class="stats-grid">
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
                <p>أقسام</p>
            </div>
        </div>
    `;
    document.getElementById('stats').innerHTML = statsHTML;
}

// Create Card for Home
function createCard(p, i) {
    return `
        <div class="card">
            ${p.image ? `<img src="${p.image}" alt="${p.title}">` : ''}
            <div class="card-content">
                <h3>${p.title}</h3>
                <p>${p.category}</p>
                <div class="actions">
                    <button onclick="copyPrompt(${i})" class="btn secondary">📋 نسخ</button>
                    <button onclick="toggleForm(${i})" class="btn primary">تعديل</button>
                </div>
            </div>
        </div>
    `;
}

// Categories Functions
function addCategory() {
    const catName = document.getElementById('catName').value.trim();
    if (!catName) return;
    
    if (!categories.includes(catName)) {
        categories.push(catName);
        saveData();
        render();
        showToast('تم إضافة القسم');
    }
    document.getElementById('catName').value = '';
}

function renderCategories() {
    const catList = document.getElementById('catList');
    catList.innerHTML = '';
    
    categories.forEach((cat, i) => {
        catList.innerHTML += `
            <div class="card">
                <h3>${cat}</h3>
                <div class="actions">
                    <button onclick="deleteCategory(${i})" class="btn" style="background:#ef4444;color:white;">حذف</button>
                </div>
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
window.onload = function() {
    loadData();
    render();
    
    // Set initial theme button
    document.getElementById('theme-btn').textContent = isDarkMode ? '☀️' : '🌙';
};
