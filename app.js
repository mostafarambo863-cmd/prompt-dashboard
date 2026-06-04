let prompts = [];

function showPage(id){

document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');

render();
}

function addPrompt(){

let data = {
title: title.value,
image: image.value,
category: category.value,
prompt: prompt.value,
desc: desc.value,
platform: platform.value,
video: videoLink.value,
showHome: showHome.checked
};

prompts.push(data);

render();
}

function render(){

// HOME
let home = document.getElementById('homeList');
home.innerHTML = "";

prompts.filter(p=>p.showHome).forEach(p=>{
home.innerHTML += `<div class="card">
<h3>${p.title}</h3>
<p>${p.category}</p>
</div>`;
});

// LIST
let list = document.getElementById('list');
if(list){
list.innerHTML = "";

prompts.forEach((p,i)=>{
list.innerHTML += `
<div class="card">
<h3>${p.title}</h3>
<p>${p.prompt}</p>
<button onclick="deletePrompt(${i})">حذف</button>
</div>`;
});
}

}

function deletePrompt(i){
prompts.splice(i,1);
render();
}