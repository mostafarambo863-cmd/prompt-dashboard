let prompts = [];
let categories = [];

function showTab(id){
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById(id).classList.add('active');
render();
}

/* TOGGLE FORM */
function toggleForm(){
document.getElementById("form").classList.toggle("hidden");
}

/* ADD PROMPT */
function addPrompt(){

let data = {
title:title.value,
image:image.value,
category:category.value,
prompt:prompt.value,
desc:desc.value,
platform:platform.value,
video:videoLink.value,
showHome:showHome.checked
};

prompts.push(data);

clearForm();
render();
}

/* SEARCH + RENDER */
function render(){

let searchVal = document.getElementById("search")?.value || "";

/* HOME */
let home = document.getElementById("homeGrid");
if(home){
home.innerHTML = "";

prompts.filter(p=>p.showHome).forEach(p=>{
home.innerHTML += card(p);
});
}

/* LIST */
let list = document.getElementById("list");
if(list){
list.innerHTML = "";

prompts
.filter(p=>p.title.includes(searchVal))
.forEach((p,i)=>{
list.innerHTML += `
<div class="card">
<h3>${p.title}</h3>
<p>${p.category}</p>

<button onclick="deletePrompt(${i})">حذف</button>
</div>`;
});
}

/* CATEGORIES */
let catList = document.getElementById("catList");
if(catList){
catList.innerHTML = "";

categories.forEach((c,i)=>{
catList.innerHTML += `
<div class="card">
${c}
<button onclick="deleteCat(${i})">حذف</button>
</div>`;
});
}
}

/* CARD */
function card(p){
return `
<div class="card">
<img src="${p.image}" style="width:100%;border-radius:10px">
<h4>${p.title}</h4>
<p>${p.category}</p>
</div>`;
}

/* DELETE */
function deletePrompt(i){
prompts.splice(i,1);
render();
}

/* CATEGORIES */
function addCategory(){
categories.push(catName.value);
catName.value="";
render();
}

function deleteCat(i){
categories.splice(i,1);
render();
}

function clearForm(){
title.value="";
image.value="";
prompt.value="";
desc.value="";
videoLink.value="";
showHome.checked=false;
document.getElementById("form").classList.add("hidden");
}

render();
