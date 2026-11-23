(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const pad = number => String(number).padStart(2, "0");
  const formatClock = (date, zone) => new Intl.DateTimeFormat("id-ID", {
    timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(date);
  const formatDate = (date, zone) => new Intl.DateTimeFormat("id-ID", {
    timeZone: zone, weekday: "short", day: "numeric", month: "short", year: "numeric"
  }).format(date);

  const localClock = $("#local-clock");
  const localDate = $("#local-date");
  const worldCards = $$(".world-clock-card");
  const updateClocks = () => {
    const now = new Date();
    if (localClock) localClock.textContent = formatClock(now, Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta");
    if (localDate) localDate.textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(now);
    worldCards.forEach(card => {
      const zone = card.dataset.zone;
      const time = card.querySelector(".world-time");
      const date = card.querySelector(".world-date");
      try {
        if (time) time.textContent = formatClock(now, zone);
        if (date) date.textContent = formatDate(now, zone);
      } catch (error) {
        if (time) time.textContent = "--:--:--";
        if (date) date.textContent = "Zona waktu tidak tersedia";
      }
    });
  };
  updateClocks();
  setInterval(updateClocks, 1000);

  // Session visit timer: duration since the first page in this tab during this session.
  const visitOutput = $("#visit-duration");
  const resetVisit = $("#reset-visit");
  const sessionKey = "atlasBumiSessionStart";
  const ensureSession = () => {
    if (!sessionStorage.getItem(sessionKey)) sessionStorage.setItem(sessionKey, String(Date.now()));
    return Number(sessionStorage.getItem(sessionKey)) || Date.now();
  };
  let visitStart = ensureSession();
  const renderDuration = milliseconds => {
    const total = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };
  const updateVisit = () => {
    if (visitOutput) visitOutput.textContent = renderDuration(Date.now() - visitStart);
  };
  updateVisit();
  setInterval(updateVisit, 1000);
  if (resetVisit) resetVisit.addEventListener("click", () => {
    visitStart = Date.now();
    sessionStorage.setItem(sessionKey, String(visitStart));
    updateVisit();
  });

  // Countdown timer based on a target timestamp, so it recovers from minor interval delays.
  const minutesInput = $("#timer-minutes");
  const secondsInput = $("#timer-seconds");
  const countdownDisplay = $("#countdown-display");
  const startButton = $("#timer-start");
  const pauseButton = $("#timer-pause");
  const resetButton = $("#timer-reset");
  const status = $("#timer-status");
  const message = $("#timer-message");
  const progressBar = $("#timer-progress-bar");
  const secretButton = $("#secret-toggle");
  let initialSeconds = Math.max(0, Number(minutesInput?.value || 25) * 60 + Number(secondsInput?.value || 0));
  let remainingMs = initialSeconds * 1000;
  let targetTime = 0;
  let timerState = "ready";
  let hiddenDigits = false;
  let timerInterval = null;

  const setMessage = text => { if (message) message.textContent = text; };
  const readDuration = () => {
    const minutes = Math.min(999, Math.max(0, Number(minutesInput?.value || 0)));
    const seconds = Math.min(59, Math.max(0, Number(secondsInput?.value || 0)));
    return Math.floor(minutes) * 60 + Math.floor(seconds);
  };
  const displayRemaining = () => {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (countdownDisplay) countdownDisplay.textContent = hiddenDigits ? "••:••" : `${pad(minutes)}:${pad(seconds)}`;
    if (status) status.textContent = timerState === "running" ? "BERJALAN" : timerState === "paused" ? "DIJEDA" : timerState === "done" ? "SELESAI" : "SIAP";
    if (progressBar) {
      const percent = initialSeconds > 0 ? Math.max(0, Math.min(100, (remainingMs / (initialSeconds * 1000)) * 100)) : 0;
      progressBar.style.width = `${percent}%`;
    }
    if (startButton) startButton.textContent = timerState === "paused" ? "Lanjutkan" : timerState === "running" ? "Berjalan…" : "Mulai timer";
    if (startButton) startButton.disabled = timerState === "running" || timerState === "done";
    if (pauseButton) pauseButton.disabled = timerState !== "running";
  };
  const stopTimerTick = () => {
    if (timerInterval !== null) clearInterval(timerInterval);
    timerInterval = null;
  };
  const tickTimer = () => {
    remainingMs = Math.max(0, targetTime - Date.now());
    if (remainingMs <= 0) {
      remainingMs = 0;
      timerState = "done";
      stopTimerTick();
      setMessage("Waktu selesai. Kamu bisa mengatur durasi baru.");
    }
    displayRemaining();
  };
  const resetTimer = (useInputs = true) => {
    stopTimerTick();
    if (useInputs) initialSeconds = readDuration();
    remainingMs = initialSeconds * 1000;
    timerState = "ready";
    displayRemaining();
    setMessage(initialSeconds > 0 ? "Timer siap digunakan." : "Masukkan durasi lebih dari 0 detik.");
  };
  if (startButton) startButton.addEventListener("click", () => {
    if (timerState === "running" || timerState === "done") return;
    if (timerState !== "paused") {
      initialSeconds = readDuration();
      remainingMs = initialSeconds * 1000;
    }
    if (remainingMs <= 0) {
      setMessage("Masukkan durasi lebih dari 0 detik terlebih dahulu.");
      displayRemaining();
      return;
    }
    targetTime = Date.now() + remainingMs;
    timerState = "running";
    setMessage("Timer sedang berjalan.");
    stopTimerTick();
    timerInterval = setInterval(tickTimer, 100);
    displayRemaining();
  });
  if (pauseButton) pauseButton.addEventListener("click", () => {
    if (timerState !== "running") return;
    remainingMs = Math.max(0, targetTime - Date.now());
    timerState = "paused";
    stopTimerTick();
    setMessage("Timer dijeda. Tekan Lanjutkan untuk meneruskan.");
    displayRemaining();
  });
  if (resetButton) resetButton.addEventListener("click", () => resetTimer(true));
  [minutesInput, secondsInput].filter(Boolean).forEach(input => input.addEventListener("change", () => {
    if (timerState !== "running") resetTimer(true);
  }));
  if (secretButton) secretButton.addEventListener("click", () => {
    hiddenDigits = !hiddenDigits;
    secretButton.textContent = hiddenDigits ? "Tampilkan angka" : "Sembunyikan angka";
    secretButton.setAttribute("aria-pressed", String(hiddenDigits));
    displayRemaining();
  });
  displayRemaining();

  // Stopwatch uses elapsed time + start timestamp; laps are local to this page.
  const stopwatchDisplay = $("#stopwatch-display");
  const stopwatchStart = $("#stopwatch-start");
  const stopwatchLap = $("#stopwatch-lap");
  const stopwatchReset = $("#stopwatch-reset");
  const lapList = $("#lap-list");
  let stopwatchRunning = false;
  let stopwatchStartTime = 0;
  let stopwatchElapsed = 0;
  let stopwatchInterval = null;
  let lapNumber = 0;
  const stopwatchValue = () => stopwatchElapsed + (stopwatchRunning ? Date.now() - stopwatchStartTime : 0);
  const formatStopwatch = ms => {
    const centiseconds = Math.floor(ms / 10);
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const hundredths = centiseconds % 100;
    return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
  };
  const updateStopwatch = () => {
    if (stopwatchDisplay) stopwatchDisplay.textContent = formatStopwatch(stopwatchValue());
    if (stopwatchStart) stopwatchStart.textContent = stopwatchRunning ? "Jeda" : stopwatchElapsed > 0 ? "Lanjutkan" : "Mulai";
  };
  if (stopwatchStart) stopwatchStart.addEventListener("click", () => {
    if (stopwatchRunning) {
      stopwatchElapsed += Date.now() - stopwatchStartTime;
      stopwatchRunning = false;
      clearInterval(stopwatchInterval);
      stopwatchInterval = null;
    } else {
      stopwatchStartTime = Date.now();
      stopwatchRunning = true;
      stopwatchInterval = setInterval(updateStopwatch, 30);
    }
    updateStopwatch();
  });
  if (stopwatchLap) stopwatchLap.addEventListener("click", () => {
    if (!stopwatchRunning && stopwatchElapsed === 0) return;
    lapNumber++;
    const li = document.createElement("li");
    li.innerHTML = `<span>Putaran ${lapNumber}</span><b>${formatStopwatch(stopwatchValue())}</b>`;
    if (lapList) lapList.prepend(li);
  });
  if (stopwatchReset) stopwatchReset.addEventListener("click", () => {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchElapsed = 0;
    lapNumber = 0;
    if (lapList) lapList.replaceChildren();
    updateStopwatch();
  });
  updateStopwatch();
})();