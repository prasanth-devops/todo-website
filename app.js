// Simple Todo app using localStorage
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const listEl = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-completed');
const filters = document.querySelectorAll('.filters button');

let tasks = [];
let filter = 'all';

function save(){
  localStorage.setItem('todo.tasks', JSON.stringify(tasks));
}

function load(){
  const raw = localStorage.getItem('todo.tasks');
  if(raw) tasks = JSON.parse(raw);
  else tasks = [];
}

function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

function addTask(text){
  const t = { id: uid(), text: text.trim(), done: false, created: Date.now() };
  if(!t.text) return;
  tasks.unshift(t);
  save();
  render();
}

function toggleDone(id){
  const i = tasks.findIndex(t=>t.id===id);
  if(i>-1){ tasks[i].done = !tasks[i].done; save(); render(); }
}

function removeTask(id){
  tasks = tasks.filter(t=>t.id!==id);
  save(); render();
}

function editTask(id, newText){
  const t = tasks.find(t=>t.id===id);
  if(!t) return;
  t.text = newText.trim() || t.text;
  save(); render();
}

function clearCompleted(){
  tasks = tasks.filter(t=>!t.done);
  save(); render();
}

function setFilter(f){
  filter = f;
  filters.forEach(b=> b.classList.toggle('active', b.dataset.filter===f));
  render();
}

function filteredTasks(){
  if(filter==='active') return tasks.filter(t=>!t.done);
  if(filter==='completed') return tasks.filter(t=>t.done);
  return tasks;
}

function render(){
  listEl.innerHTML = '';
  const items = filteredTasks();
  if(items.length===0){
    const el = document.createElement('li');
    el.className='task-item';
    el.innerHTML = '<div class="label" style="opacity:0.7">No tasks</div>';
    listEl.appendChild(el);
    return;
  }
  items.forEach(t=>{
    const li = document.createElement('li');
    li.className = 'task-item';
    const chk = document.createElement('input');
    chk.type='checkbox';
    chk.checked = t.done;
    chk.addEventListener('change', ()=> toggleDone(t.id));
    const label = document.createElement('div');
    label.className = 'label' + (t.done ? ' completed' : '');
    label.textContent = t.text;

    // actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className='icon-btn';
    editBtn.title='Edit';
    editBtn.textContent='✏️';
    editBtn.addEventListener('click', ()=>{
      const inp = document.createElement('input');
      inp.className='edit-input';
      inp.value = t.text;
      label.innerHTML = '';
      label.appendChild(inp);
      inp.focus();
      inp.select();
      inp.addEventListener('keydown', (e)=>{
        if(e.key==='Enter'){ editTask(t.id, inp.value); }
        if(e.key==='Escape'){ render(); }
      });
    });

    const delBtn = document.createElement('button');
    delBtn.className='icon-btn';
    delBtn.title='Delete';
    delBtn.textContent='🗑️';
    delBtn.addEventListener('click', ()=> {
      if(confirm('Delete this task?')) removeTask(t.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(chk);
    li.appendChild(label);
    li.appendChild(actions);

    listEl.appendChild(li);
  });
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  addTask(input.value);
  input.value='';
});

clearBtn.addEventListener('click', ()=>{ clearCompleted(); });

filters.forEach(b=> b.addEventListener('click', ()=> setFilter(b.dataset.filter)));

window.addEventListener('storage', ()=>{ load(); render(); });

load();
render();
