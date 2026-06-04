let prompts = [];
let categories = [];

function showTab(id){
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById(id).classList.add('active');
render();
}

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

/* DELETE PROMPT */
function deletePrompt(i){
prompts.splice(i,1);
render();
}

/* EDIT SIMPLE */
function editPrompt(i){
let p = prompts[i];

title.value = p.title;
image.value = p.image;
category.value = p.category;
prompt.value = p.prompt;
desc.value = p.desc;
platform.value = p.platform;
videoLink.value = p.video;
showHome.checked = p.showHome;

prompts.splice(i,1);
toggleForm();
}

/* RENDER */
function render(){

let searchVal = search.value || "";

/* HOME */
let home = document.getElementById("homeGrid");
if(home){
home.innerHTML="";
prompts.filter(p=>p.showHome).forEach((p,i)=>{
home.innerHTML += card(p,i);
});
}

/* LIST */
let list = document.getElementById("list");
if(list){
list.innerHTML="";

prompts
.filter(p=>p.title.includes(searchVal))
.forEach((p,i)=>{
list.innerHTML += `
<div class="card">
<h3>${p.title}</h3>
<p>${p.category}</p>

<div class="actions">
<button class="edit" onclick="editPrompt(${i})">تعديل</button>
<button class="delete" onclick="deletePrompt(${i})">حذف</button>
</div>

</div>`;
});
}

/* CATEGORIES */
let catList = document.getElementById("catList");
if(catList){
catList.innerHTML="";
categories.forEach((c,i)=>{
catList.innerHTML += `
<div class="card">
${c}
<div class="actions">
<button class="edit" onclick="editCat(${i})">تعديل</button>
<button class="delete" onclick="deleteCat(${i})">حذف</button>
</div>
</div>`;
});
}

}

/* CARD HOME */
function card(p,i){
return `
<div class="card">
<img src="${p.image}" style="width:100%;border-radius:12px">
<h3>${p.title}</h3>
<p>${p.category}</p>

<div class="actions">
<button class="edit" onclick="editPrompt(${i})">تعديل</button>
<button class="delete" onclick="deletePrompt(${i})">حذف</button>
</div>

</div>`;
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

function editCat(i){
let newName = prompt("تعديل الاسم:", categories[i]);
if(newName){
categories[i]=newName;
render();
}
}

function clearForm(){
title.value="";
image.value="";
prompt.value="";
desc.value="";
videoLink.value="";
showHome.checked=false;
}
