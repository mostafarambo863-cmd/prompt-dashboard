let prompts=[];
let cats=[];

function show(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
render();
}

function toggleForm(){
document.getElementById("form").classList.toggle("hidden");
}

/* ADD */
function add(){
prompts.push({
title:title.value,
image:image.value,
prompt:prompt.value
});

clear();
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
<button onclick="del(${i})">حذف</button>
</div>`;
});

/* CATS */
catList.innerHTML="";
cats.forEach((c,i)=>{
catList.innerHTML+=`
<div class="card">
${c}
<button onclick="delCat(${i})">حذف</button>
</div>`;
});
}

/* DELETE */
function del(i){
prompts.splice(i,1);
render();
}

function addCat(){
cats.push(cat.value);
cat.value="";
render();
}

function delCat(i){
cats.splice(i,1);
render();
}

function clear(){
title.value="";
image.value="";
prompt.value="";
}
