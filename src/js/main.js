import '../css/main.css';

const tasks = []; /* aca almaceno cada una de las tareas */
let time = 0;
let timer =
  null; /* setinterval nos va a permitiru ejecutar un pedazo de codigo cada determinado tiempo se necesita asociar a una variable */
let timerBreak = null; /* este es para el break, para los 5 min de descanso */
let current =
  null; /* este lo va a inicializar en 0 porque va a decir cual es la tarea que se esta ejecutando en el momento */

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

const music = new Audio('./src/sound/sfx-cartoons.mp3');
const popSound = new Audio('./src/sound/sfx-pop.mp3');
const popSound2 = new Audio('./src/sound/sfx-pop2.mp3');

renderTime();
renderTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (itTask !== "") {
    createTask(itTask.value); /* esto crea la tarea impresa */
    itTask.value = ""; /* esto borra el deja limpio el input */
    renderTasks();
    popSound.play();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100)
      .toString(36)
      .slice(
        3
      ) /* Math.random es una funcion que va a generar un numero aleatorio entre 0 y 1, ejemplo: 0.3, 0.5, 0.75, se multiplica por 100 para tener un numero con decimal, luego se transforma a string con toString() con base en 36, el metodo slice() corta tres caracteres iniciales extraños */,
    title: value,
    completed: false,
  };

  tasks.unshift(newTask);
}

/* esta funcion va a permitir 1º: tomar todos los elementos de las tareas (tasks), 2º generar un html que al final va a inyectar en un contenedor */
function renderTasks(params) {
  const html = tasks.map((task) => {
    return `
            <div class='task'>
                <div class='completed'>${
                  task.completed
                    ? `<span class='done'>Done</span>`
                    : `<button class='start-button' data-id='${task.id}'>Start</button>`
                }</div>
                <div class='title'>${task.title}</div>
            </div>
        `;
  }); /* el objetivo de usar el metodo map() es que podemos iterar por cada uno de los elementos del array, y para cada iteracion va a hacerle una operacion especial, al final va a regrasar un array nuevo con cada una de las operaciones a cada elemento */

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button");

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!timer) {
        const id = button.getAttribute("data-id");
        startButtonHandler(id);
        button.textContent = "In Progress...";
      }
    });
  });
}

function startButtonHandler(id) {
  popSound2.play();
  time = 25 * 60; /* 25min por 60seg cada uno */
  current = id; /* va a guardar el id de la actividad actual */
  const taskIndex = tasks.findIndex((task) => task.id === id);
  taskName.textContent = tasks[taskIndex].title;
  renderTime();
  timer = setInterval(() => {
    timeHandler(id);
  }, 1000);
}

function timeHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    music.play();
    clearInterval(timer);
    markCompleted(id);
    timer = null;
    renderTasks();
    startBreak();
  }
}

function startBreak() {
  time = 5 * 60;
  taskName.textContent = "Break";
  renderTime();
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timerBreak);
    current = null;
    timerBreak = null;
    taskName.textContent = '';
    renderTasks();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60);
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completed = true;
}
