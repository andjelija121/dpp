"use strict";

/*
  ///////////////////////////////
    NAV
  ///////////////////////////////
*/

var triggerTabList = [].slice.call(document.querySelectorAll("#pills-home"));
triggerTabList.forEach(function (triggerEl) {
  var tabTrigger = new bootstrap.Tab(triggerEl);

  triggerEl.addEventListener("click", function (event) {
    event.preventDefault();
    tabTrigger.show();
  });
});

/*
  ///////////////////////////////
    TASKS
  ///////////////////////////////
*/

function extractDayFromDate(dateString) {
  const parts = dateString.split("-");
  let day = parts[2];

  // Ako je prva cifra dana nula, uklonite je
  if (day.startsWith("0")) {
    day = day.substring(1);
  }

  return day;
}

let assgDates = [];

function extractMonthFromDate(dateString) {
  const parts = dateString.split("-");
  const monthNumber = parseInt(parts[1], 10);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[monthNumber - 1];
}
const addAssgButton = document.querySelector(".add-assg-btn");
const form = document.querySelector(".form");

class App {
  constructor() {
    this.assignments = [];
    this.assignment = {};
    this._getLocalStorage();
    this.cardHTML = "";
    addAssgButton.addEventListener("click", this.newAssignment.bind(this));
  }

  newAssignment() {
    form.classList.remove("hidden");

    const addTaskButton = document.querySelector(".task-btn-sm");

    addTaskButton.addEventListener("click", this.addTaskRow.bind(this));

    form.addEventListener("submit", this._addAssignment.bind(this));
  }

  _hideForm() {
    document.querySelector(".assg-name").value = document.querySelector(
      ".assg-date"
    ).value = "";
    document.querySelector(".assg-color").value = "#rrggbb";

    // form.style.display = 'none';
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _addAssignment(event) {
    event.preventDefault();
    this.cardHTML = "";

    const name = document.querySelector(".assg-name").value;
    const dateee = document.querySelector(".assg-date").value;
    const color = document.querySelector(".assg-color").value;
    console.log(dateee, typeof dateee);
    const dayDate = extractDayFromDate(dateee);
    const monthDate = extractMonthFromDate(dateee);

    if (!document.querySelectorAll(".tasks-assg")) {
      alert("moras da imas barem jedan tesk");
    } else {
    }
    const tasks = document.querySelectorAll(".tasks-assg");
    const taskValues = Array.from(tasks).map((task) => task.value);
    this.assignment = {
      name: name,
      dateDay: dayDate,
      dateMonth: monthDate,
      color: color,
      tasks: taskValues,
    };
    this.assignments.push(this.assignment);

    this._renderAssignment(this.assignment);

    this._setLocalStorage();

    this._hideForm();
  }

  _renderAssignment(as) {
    let tasksHTML = "";
    as.tasks.forEach((task) => {
      tasksHTML += `
        <div>${task}</div>
      `;
    });

    this.cardHTML = `
      <div class="event" style="background-color: ${as.color}">
        <div class="event-date">
          <p class="event-day">${as.dateDay}</p>
          <p class="event-month">${as.dateMonth.substring(0, 3)}</p>
        </div>
        <div class="event-text">
        <p class="event-name">${as.name}</p>
        <div class="tasks-list-e">
          <p class="tasks-list-h">Task list:</p>
          ${tasksHTML}
        </div>
        </div>
      </div>
    `;
    form.insertAdjacentHTML("afterend", this.cardHTML);
  }

  addTaskRow(e) {
    e.preventDefault();
    const form = document.querySelector(".form");

    let html = `
      <div class="form__row">
        <label class="form__label">Task</label>
        <input type='text' class="form__input tasks-assg" placeholder="" />
      </div>
    `;
    const formDiv = document.querySelector(".form-div");
    formDiv.insertAdjacentHTML("beforeend", html);
  }

  _setLocalStorage() {
    localStorage.setItem("assignments", JSON.stringify(this.assignments));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("assignments"));

    if (!data) return;

    this.assignments = data;

    this.assignments.forEach((work) => {
      this._renderAssignment(work);
    });
  }
}

const app = new App();

const tasksList = document.querySelector(".tasks-list");
const addTask = document.querySelector(".add-task-btn");
const deleteBtn = document.querySelector(".delete-task-btn");
const unfinishedTasks = [];

// Function to save data to localStorage
function saveDataToLocalStorage() {
  const tasks = [...document.querySelectorAll(".tasks-item")];
  const data = tasks.map((task) => ({
    text: task.querySelector(".tasks-text").value,
    rating: task.querySelector(".rate-tasks").value,
    isChecked: task.querySelector(".check-box").checked,
  }));
  localStorage.setItem("dailyTasks", JSON.stringify(data));
}

// Event listener for adding new tasks
addTask.addEventListener("click", () => {
  let html = `
    <li class="tasks-item">
      <input class="check-box" type="checkbox" />
      <input class="tasks-text" type="text" />
      <select class="rate-tasks">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
        <option value="e">E</option>
      </select>
    </li>
  `;
  tasksList.insertAdjacentHTML("afterbegin", html);
  saveDataToLocalStorage(); // Call the function to save data to localStorage
});

// Event listener for deleting all tasks
deleteBtn.addEventListener("click", () => {
  tasksList.innerHTML = ""; // Clear the tasks list
  localStorage.removeItem("dailyTasks"); // Remove data from localStorage
  unfinishedTasks.length = 0; // Clear the array of unfinished tasks
});

// Event listener for changes in tasks
tasksList.addEventListener("change", (event) => {
  if (
    event.target.classList.contains("check-box") ||
    event.target.classList.contains("tasks-text") ||
    event.target.classList.contains("rate-tasks")
  ) {
    saveDataToLocalStorage(); // Call the function to save data to localStorage
  }
});

// Load data from localStorage when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("dailyTasks"));
  if (data) {
    data.forEach((task) => {
      let html = `
        <li class="tasks-item">
          <input class="check-box" type="checkbox" ${
            task.isChecked ? "checked" : ""
          } />
          <input class="tasks-text" type="text" value="${task.text}" />
          <select class="rate-tasks">
            <option value="a" ${
              task.rating === "a" ? "selected" : ""
            }>A</option>
            <option value="b" ${
              task.rating === "b" ? "selected" : ""
            }>B</option>
            <option value="c" ${
              task.rating === "c" ? "selected" : ""
            }>C</option>
            <option value="d" ${
              task.rating === "d" ? "selected" : ""
            }>D</option>
            <option value="e" ${
              task.rating === "e" ? "selected" : ""
            }>E</option>
          </select>
        </li>
      `;
      tasksList.insertAdjacentHTML("afterbegin", html);
      if (!task.isChecked) {
        unfinishedTasks.push(task.text);
      }
    });
  }
});

/*
  ///////////////////////////////
    CALENDAR
  ///////////////////////////////
*/

console.log(app.assignments);

const kalendarskiNiz = app.assignments.map((item) => ({
  dateDay: item.dateDay,
  dateMonth: item.dateMonth,
  color: item.color,
}));

console.log("kalendarski niz", kalendarskiNiz);

const date = new Date();

const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      const eventForDay = kalendarskiNiz.find(
        (event) =>
          event.dateDay == i && event.dateMonth === months[date.getMonth()]
      );
      if (eventForDay) {
        days += `<div class="event-day1" data-number="${i}" data-color="${eventForDay.color}">${i}<div class="dot2" style="background-color: ${eventForDay.color}"></div></div>`;
      } else {
        days += `<div>${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  monthDays.innerHTML = days;
};
renderCalendar();

document.addEventListener("click", function (event) {
  if (event.target.closest(".prev")) {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  } else if (event.target.closest(".next")) {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  }
});

const eventDays = document.querySelectorAll(".event-day1");
eventDays.forEach((day) => {
  const color = day.dataset.color;
  day.querySelector(".dot2").style.backgroundColor = color;
});

/*
  ///////////////////////////////
    HABITS
  ///////////////////////////////
*/
let datum = new Date(); // Postavljamo trenutni datum

const getFirstDayOfWeek = () => {
  const dayOfWeek = datum.getDay();
  const diff = datum.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  return new Date(datum.setDate(diff));
};

const renderCalendarh = () => {
  const monthDays = document.querySelector(".hdays");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const firstDayOfWeek = getFirstDayOfWeek();
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  let title = "";
  if (firstDayOfWeek.getMonth() === lastDayOfWeek.getMonth()) {
    title = `${
      months[firstDayOfWeek.getMonth()]
    } ${firstDayOfWeek.getDate()} - ${lastDayOfWeek.getDate()}`;
  } else {
    title = `${
      months[firstDayOfWeek.getMonth()]
    } ${firstDayOfWeek.getDate()} - ${
      months[lastDayOfWeek.getMonth()]
    } ${lastDayOfWeek.getDate()}`;
  }

  document.querySelector(".hdate h1").textContent = title;
  document.querySelector(".hdate p").textContent = new Date().toDateString();

  let days = "";

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(firstDayOfWeek);
    currentDay.setDate(firstDayOfWeek.getDate() + i);

    if (
      currentDay.getMonth() !== firstDayOfWeek.getMonth() &&
      currentDay.getDate() < 10
    ) {
      days += `<div class="inactive">${currentDay.getDate()}</div>`;
    } else if (currentDay.getDate() === new Date().getDate()) {
      days += `<div class="todayh">${currentDay.getDate()}</div>`;
    } else {
      days += `<div>${currentDay.getDate()}</div>`;
    }
  }
  monthDays.innerHTML = days;
};

document.querySelector(".hprev").addEventListener("click", () => {
  datum.setDate(datum.getDate() - 7);
  renderCalendarh();
});

document.querySelector(".hnext").addEventListener("click", () => {
  datum.setDate(datum.getDate() + 7);
  renderCalendarh();
});

// Pozivamo funkciju renderCalendarh() na početku
renderCalendarh();

const addButton = document.querySelector(".habits-add");
const cal = document.querySelector(".hcalendar");

function saveHabitsToLocalStorage() {
  const habits = [...document.querySelectorAll(".habits-box")];
  const data = habits.map((habitBox) => ({
    name: habitBox.querySelector(".habits-name").value,
    checkboxes: [...habitBox.querySelectorAll("input[type=checkbox]")].map(
      (checkbox) => checkbox.checked
    ),
  }));
  localStorage.setItem("habits", JSON.stringify(data));
}

addButton.addEventListener("click", function (e) {
  let markup = `
  <div class="habits-box">
  <input
  type="text"
  class="habits-name"
  placeholder="Name habit"
/>
<input type="checkbox" />
<input type="checkbox" />
<input type="checkbox" /> 
<input type="checkbox" />
<input type="checkbox" />
<input type="checkbox" />
<input type="checkbox" />
</div>
`;
  cal.insertAdjacentHTML("beforeend", markup);
  saveHabitsToLocalStorage();
});

cal.addEventListener("change", (event) => {
  if (
    event.target.classList.contains("habits-name") ||
    event.target.type === "checkbox"
  ) {
    saveHabitsToLocalStorage();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("habits"));
  if (data) {
    data.forEach((habit) => {
      let html = `
        <div class="habits-box">
          <input type="text" class="habits-name" value="${
            habit.name
          }" placeholder="Name habit">
          <input type="checkbox" ${habit.checkboxes[0] ? "checked" : ""}>
          <input type="checkbox" ${habit.checkboxes[1] ? "checked" : ""}>
          <input type="checkbox" ${habit.checkboxes[2] ? "checked" : ""}> 
          <input type="checkbox" ${habit.checkboxes[3] ? "checked" : ""}>
          <input type="checkbox" ${habit.checkboxes[4] ? "checked" : ""}>
          <input type="checkbox" ${habit.checkboxes[5] ? "checked" : ""}>
          <input type="checkbox" ${habit.checkboxes[6] ? "checked" : ""}>
        </div>
      `;
      cal.insertAdjacentHTML("beforeend", html);
    });
  }
});

document.querySelector(".habits-delete").addEventListener("click", () => {
  const habitsBoxes = document.querySelectorAll(".habits-box");
  habitsBoxes.forEach((box) => box.remove()); // Remove all habit boxes from the DOM

  localStorage.removeItem("habits"); // Remove the 'habits' key from localStorage
});

/*
******************************************************************
TIMER
******************************************************************
*/

(function () {
  const fehBody = document.body;
  const workDurationI = document.querySelector(".work-duration");
  const restDurationI = document.querySelector(".rest-duration");
  const timerTime = document.querySelector(".feh-timer-time");
  const circleProgress = document.querySelector(".circle-progress");

  let workDuration = parseInt(workDurationI.value) * 60;
  let restDuration = parseInt(restDurationI.value) * 60;
  let remainingTime = workDuration;
  let isPaused = true;
  let isWorking = true;
  let isIntervalValid;

  window.addEventListener("load", () => {
    fehBody.classList.add("page-loaded");
  });

  const startBtn = document.querySelector(".play-btn");

  startBtn.addEventListener("click", () => {
    isPaused = false;

    fehBody.classList.add("timer-running");

    if (isWorking) {
      fehBody.classList.remove("timer-paused");
    } else {
      fehBody.classList.add("rest-mode");
      fehBody.classList.remove("timer-paused");
    }

    if (!isIntervalValid) {
      isIntervalValid = setInterval(updateTimer, 1000);
    }
  });

  const pauseBtn = document.querySelector(".pause-btn");

  pauseBtn.addEventListener("click", () => {
    isPaused = true;

    fehBody.classList.remove("timer-running");
    fehBody.classList.add("timer-paused");
  });

  const btnCloseSettings = document.getElementById("feh-close-settings");
  const btnToggleSettings = document.getElementById("feh-toggle-settings");

  function setBodySettings() {
    fehBody.classList.contains("settings-active")
      ? fehBody.classList.remove("settings-active")
      : fehBody.classList.add("settings-active");
  }

  function toggleSettings() {
    if (event.type === "click") {
      setBodySettings();
    } else if (event.type === "keydown" && event.keyCode === 27) {
      fehBody.classList.remove("settings-active");
    }
  }

  btnToggleSettings.addEventListener("click", toggleSettings);
  btnCloseSettings.addEventListener("click", toggleSettings);
  document.addEventListener("keydown", toggleSettings);

  workDurationI.addEventListener("change", () => {
    workDuration = parseInt(workDurationI.value) * 60;
    if (isWorking) {
      remainingTime = workDuration;
      updateProgress();
    }
  });

  restDurationI.addEventListener("change", () => {
    restDuration = parseInt(restDurationI.value) * 60;
    if (isWorking) {
      remainingTime = restDuration;
      updateProgress();
    }
  });

  function updateTimer() {
    if (!isPaused) {
      remainingTime--;
      if (remainingTime <= 0) {
        isWorking = !isWorking;
        remainingTime = isWorking ? workDuration : restDuration;

        if (!isWorking) {
          fehBody.classList.add("rest-mode");
          fehBody.classList.remove("timer-running");
        } else {
          fehBody.classList.remove("rest-mode");
          fehBody.classList.remove("timer-running");
        }

        isPaused = false;
        fehBody.classList.remove("timer-work-active");
      }

      updateProgress();
    }
  }

  function updateProgress() {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const totalDuration = isWorking ? workDuration : restDuration;
    const dashOffset = (circumference * remainingTime) / totalDuration;

    circleProgress.style.strokeDashoffset = dashOffset;
    timerTime.textContent = formatTime(remainingTime);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  updateProgress();
})();

const timerUnTask = Object.keys(unfinishedTasks).map(
  (key) => unfinishedTasks[key]
);
unfinishedTasks.forEach((text) => {
  console.log("toBoze");
  console.log(text);
});

const selectElement = document.querySelector(".timer-tasks");
unfinishedTasks.forEach((text) => {
  const option = document.createElement("option");
  option.value = text;
  option.textContent = text;
  selectElement.appendChild(option);
});

import "core-js/stable";
import "regenerator-runtime/runtime";
