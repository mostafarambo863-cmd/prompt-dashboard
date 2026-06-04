let prompts = [];
let cats = [];

let editIndex = null;

/* NAV */
function show(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
render();
}

/* FORM */
function toggleForm(){
document.getElementById("form").classList.toggle("hidden");
}

/* ADD or UPDATE */
function add(){

let data = {
title:title.value,
image:image.value,
prompt:prompt.value
};

if(editIndex !== null){
prompts[editIndex] = data;
editIndex = null;
}else{
prompts.push(data);
}

clear();
render();
}

/* EDIT */
function edit(i){
let p = prompts[i];

title.value = p.title;
image.value = p.image;
prompt.value = p.prompt;

editIndex = i;

document.getElementById("form").classList.remove("hidden");
}

/* DELETE */
function del(i){
prompts.splice(i,1);
render();
}

/* RENDER */
function render(){

/* HOME */
homeGrid.innerHTML="";
prompts.forEach(p=>{
homeGrid.innerHTML+=`
<div class="card">
<img src="${p.image}" style="width:100%;border-radius:10px">
<h3>${p.title}</h3>
</div>`;
});

/* LIST */
list.innerHTML="";
prompts.forEach((p,i)=>{
list.innerHTML+=`
<div class="card">
<h3>${p.title}</h3>
<p>${p.prompt}</p>

<div style="margin-top:10px;display:flex;gap:8px;">
<button onclick="edit(${i})">تعديل</button>
<button onclick="del(${i})">حذف</button>
</div>

</div>`;
});

/* CATEGORIES */
catList.innerHTML="";
cats.forEach((c,i)=>{
catList.innerHTML+=`
<div class="card">
${c}
<button onclick="delCat(${i})">حذف</button>
</div>`;
});
}

/* CATEGORY */
function addCat(){
cats.push(cat.value);
cat.value="";
render();
}

function delCat(i){
cats.splice(i,1);
render();
}

/* CLEAR */
function clear(){
title.value="";
image.value="";
prompt.value="";
}
