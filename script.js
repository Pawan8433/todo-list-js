let tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

const input=document.getElementById("task-input")
const addBtn=document.getElementById("add-btn")
const list=document.getElementById("task-list")

const total=document.getElementById("count-total")
const done=document.getElementById("count-done")
const left=document.getElementById("count-left")

let dragIndex=null

function render(){

list.innerHTML=""

if(!tasks.length){

list.innerHTML=`<li class="empty"><span>✏️</span>Add your first task</li>`

}else{

tasks.forEach((task,i)=>{

const li=document.createElement("li")

li.className="task-item"+(task.done?" done":"")
li.draggable=true
li.dataset.index=i

li.innerHTML=`
<button class="check-btn" data-i="${i}">
${task.done?"✓":""}
</button>

<span class="task-text">${escapeHTML(task.text)}</span>

<button class="del-btn" data-i="${i}">🗑</button>
`

list.appendChild(li)

})

}

const completed=tasks.filter(t=>t.done).length

total.textContent=tasks.length
done.textContent=completed
left.textContent=tasks.length-completed

localStorage.setItem("tasks",JSON.stringify(tasks))

}

function addTask(){

const text=input.value.trim()

if(!text)return

tasks.push({text,done:false})

input.value=""

render()

}

addBtn.onclick=addTask

input.addEventListener("keydown",e=>{
if(e.key==="Enter")addTask()
})

list.addEventListener("click",e=>{

const check=e.target.closest(".check-btn")
const del=e.target.closest(".del-btn")

if(check){

const i=+check.dataset.i
tasks[i].done=!tasks[i].done
render()

}

if(del){

const i=+del.dataset.i
tasks.splice(i,1)
render()

}

})

list.addEventListener("dragstart",e=>{
const item=e.target.closest(".task-item")
if(!item)return
dragIndex=+item.dataset.index
})

list.addEventListener("dragover",e=>{
e.preventDefault()
})

list.addEventListener("drop",e=>{

const item=e.target.closest(".task-item")
if(!item)return

const dropIndex=+item.dataset.index

const dragged=tasks.splice(dragIndex,1)[0]

tasks.splice(dropIndex,0,dragged)

render()

})

function escapeHTML(str){
return str.replace(/[&<>"']/g,c=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#39;"
}[c]))
}

render()