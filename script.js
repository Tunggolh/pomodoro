const timeMinutes = document.querySelector("#pomodoro-minutes");
const timeSeconds = document.querySelector("#pomodoro-seconds");
const heading = document.querySelector("#pomodoro-heading");
const btnSkip = document.querySelector("#btnSkip");
const btnStart = document.querySelector("#btnStart");
const btnReset = document.querySelector("#btnReset");
const btnPomodoro = document.querySelector("#btnPomodoro");
const btnShortBreak = document.querySelector("#btnShortBreak");
const btnLongBreak = document.querySelector("#btnLongBreak");
const btnTypes = document.querySelectorAll(".pomodoro-types button");
const checkContainer = document.querySelector(".pomodoro-checks");

const pomodoroDuration = 1499;
const shortBreakDuration = 299;
const longBreakDuration = 899;

let currentDuration = pomodoroDuration;
let btnActive = btnPomodoro;
let breakCount = 0;
let isTimerRunning = false;
let timeIntervalId;
let isBreak = false;
let isPause = false;
let rotateDeg = 0;

const startTimer = function (duration) {
  isTimerRunning = true;
  let minutes, seconds;
  btnSkip.parentElement.classList.remove("hidden");

  timeIntervalId = setInterval(function () {
    if (isPause) {
      currentDuration = duration;
      return;
    }

    console.log("RUNNING");
    minutes = parseInt(duration / 60);
    seconds = parseInt(duration % 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timeMinutes.textContent = minutes;
    timeSeconds.textContent = seconds;

    duration--;

    if (duration < 0) {
      nextTimer();
    }
  }, 1000);
};

const displayActiveTimer = function (activeBtn) {
  btnActive = activeBtn;
  btnTypes.forEach((btn) => btn.classList.remove("active"));
  activeBtn.classList.add("active");

  if (btnActive === btnPomodoro) {
    currentDuration = pomodoroDuration;
    updateTimerDisplay("25");
  }

  if (btnActive === btnShortBreak) {
    currentDuration = shortBreakDuration;
    updateTimerDisplay("05");
  }

  if (btnActive == btnLongBreak) {
    currentDuration = longBreakDuration;
    updateTimerDisplay("15");
  }

  btnSkip.parentElement.classList.add("hidden");
};

const resetTimer = function () {
  clearInterval(timeIntervalId);
  isBreak = false;
  displayActiveTimer(btnPomodoro);
  if (checkContainer.hasChildNodes()) {
    while (checkContainer.firstChild) {
      checkContainer.removeChild(checkContainer.lastChild);
    }
  }
  btnStart.textContent = "START";
  breakCount = 0;
  isTimerRunning = false;
  btnSkip.parentElement.classList.add("hidden");
};

const breakTimer = function () {
  clearInterval(timeIntervalId);
  isBreak = true;
  if (breakCount > 3) displayActiveTimer(btnLongBreak);
  else displayActiveTimer(btnShortBreak);
  breakCount = breakCount > 3 ? 0 : breakCount;
};

const nextTimer = function () {
  isTimerRunning = false;
  if (btnActive === btnPomodoro) {
    breakCount++;
    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check", "fa-2xl");
    checkContainer.appendChild(checkIcon);

    setTimeout(() => {
      checkIcon.classList.add("show");
    }, 100);
  }

  if (breakCount === 0) {
    if (checkContainer.hasChildNodes()) {
      while (checkContainer.firstChild) {
        checkContainer.removeChild(checkContainer.lastChild);
      }
    }
  }

  if (isBreak) {
    isBreak = false;
    clearInterval(timeIntervalId);
    currentDuration = pomodoroDuration;
    displayActiveTimer(btnPomodoro);
  } else {
    breakTimer();
  }

  btnStart.textContent = "START";
};

const updateTimerDisplay = function (minutes) {
  timeMinutes.textContent = minutes;
  timeSeconds.textContent = "00";
};

const addEnlargeAndShrinkIconEvent = function (btn) {
  btn.addEventListener("mouseover", () => {
    btn.classList.remove("fa-xl");
    btn.classList.add("fa-2xl");
  });

  btn.addEventListener("mouseout", () => {
    btn.classList.remove("fa-2xl");
    btn.classList.add("fa-xl");
  });
};

const showAlertMessage = function () {
  return confirm(
    "Timer is currently running, are you sure you want to switch?"
  );
};

const addMouseEvents = function (btn) {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (btnActive === btn) return;

    if (!isTimerRunning) displayActiveTimer(btn);

    if (isTimerRunning && showAlertMessage()) {
      clearInterval(timeIntervalId);
      displayActiveTimer(btn);
      btnStart.textContent = "START";
      isTimerRunning = false;
    }
  });

  btn.addEventListener("mouseover", () => {
    const isActive = btn.classList.contains("active");
    if (isActive) return;
    btn.classList.add("active");
  });

  btn.addEventListener("mouseout", () => {
    const isActive = btn.classList.contains("active");
    if (btn !== btnActive && isActive) btn.classList.remove("active");
  });
};

btnStart.addEventListener("click", (e) => {
  e.preventDefault();
  if (btnStart.textContent.trim() === "START") {
    btnStart.textContent = "PAUSE";
    isPause = false;
    clearInterval(timeIntervalId);
    startTimer(currentDuration);
  } else {
    btnStart.textContent = "START";
    isPause = true;
    isTimerRunning = false;
  }
});

btnSkip.addEventListener("click", nextTimer);

addMouseEvents(btnPomodoro);
addMouseEvents(btnShortBreak);
addMouseEvents(btnLongBreak);

addEnlargeAndShrinkIconEvent(btnSkip);
addEnlargeAndShrinkIconEvent(btnReset);

btnStart.addEventListener("mouseover", () =>
  btnStart.classList.remove("active")
);

btnStart.addEventListener("mouseout", () => btnStart.classList.add("active"));

btnReset.addEventListener("click", () => {
  document.querySelector(
    ".btn-rotate"
  ).style.transform = `rotate(${(rotateDeg += 180)}deg)`;
  resetTimer();
});
