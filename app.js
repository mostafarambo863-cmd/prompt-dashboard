import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://wohyuqiqvvrdhqgxovyt.supabase.co";
const SUPABASE_KEY = "PUT_YOUR_ANON_KEY_HERE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ======================
STATE
====================== */
let prompts = [];
let categories = [];
let notifications = [];
let currentEditIndex = null;
let isDarkMode = false;

/* ======================
LOAD DATA FROM SUPABASE
====================== */

async function loadData() {
    const { data: p } = await supabase.from("prompts").select("*").order("created_at", { ascending: false });
    const { data: c } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
    const { data: n } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });

    prompts = p || [];
    categories = c?.map(i => i.name) || [];
    notifications = n || [];

    render();
}

/* ======================
TOAST
====================== */
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2500);
}

/* ======================
UPLOAD IMAGE TO SUPABASE
====================== */
async function uploadImage(file) {
    if (!file) return "";

    const fileName = Date.now() + "-" + file.name;

    const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

    if (error) {
        console.log(error);
        return "";
    }

    const { data: publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

    return publicUrl.publicUrl;
}

/* ======================
ADD PROMPT
====================== */
async function addPrompt() {
    const title = document.getElementById("title").value;

    const file = document.getElementById("imageUpload").files[0];
    const imageUrl = file ? await uploadImage(file) : document.getElementById("image").value;

    const promptData = {
        title,
        image: imageUrl,
        category: document.getElementById("category").value,
        prompt: document.getElementById("prompt").value,
        description: document.getElementById("desc").value,
        platform: document.getElementById("platform").value,
        video_link: document.getElementById("videoLink").value,
        show_home: document.getElementById("showHome").checked,
        created_at: new Date()
    };

    if (currentEditIndex !== null) {
        const id = prompts[currentEditIndex].id;
        await supabase.from("prompts").update(promptData).eq("id", id);
        showToast("تم التعديل");
    } else {
        await supabase.from("prompts").insert([promptData]);
        showToast("تم الإضافة");
    }

    currentEditIndex = null;
    clearForm();
    loadData();
}

/* ======================
DELETE
====================== */
async function deletePrompt(id) {
    await supabase.from("prompts").delete().eq("id", id);
    showToast("تم الحذف");
    loadData();
}

/* ======================
RENDER
====================== */
function render() {
    const home = document.getElementById("homeGrid");
    const list = document.getElementById("list");

    home.innerHTML = "";
    list.innerHTML = "";

    prompts.forEach(p => {
        const card = `
        <div class="card">
            ${p.image ? `<img src="${p.image}">` : ""}
            <div class="card-content">
                <h3>${p.title}</h3>
                <p>${p.category}</p>

                <button onclick="deletePrompt('${p.id}')">حذف</button>
            </div>
        </div>`;
        list.innerHTML += card;

        if (p.show_home) home.innerHTML += card;
    });
}

/* ======================
CATEGORY
====================== */
async function addCategory() {
    const name = document.getElementById("catName").value;

    await supabase.from("categories").insert([{ name }]);

    showToast("تم إضافة القسم");
    loadData();
}

/* ======================
NOTIFICATION
====================== */
async function addNotification() {
    const title = document.getElementById("notifTitle").value;
    const description = document.getElementById("notifDesc").value;

    await supabase.from("notifications").insert([{ title, description }]);

    showToast("تم الإضافة");
    loadData();
}

/* ======================
UTIL
====================== */
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("image").value = "";
    document.getElementById("prompt").value = "";
    document.getElementById("desc").value = "";
}

/* ======================
INIT
====================== */
window.onload = () => {
    loadData();
};
