    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const hoursDisplay = document.getElementById('hoursDisplay');
    const minutesDisplay = document.getElementById('minutesDisplay');
    const secondsDisplay = document.getElementById('secondsDisplay');
    const colons = document.querySelectorAll('#display .colon');

    let totalSeconds = 0;
    let intervalId = null;
    let isPaused = false;

    // Flicker animation control for colons
    let flickerInterval = null;
    function startFlicker() {
      if (flickerInterval) return;
      flickerInterval = setInterval(() => {
        colons.forEach(colon => {
          colon.style.opacity = colon.style.opacity === '0.3' ? '1' : '0.3';
        });
      }, 600);
    }
    function stopFlicker() {
      if (flickerInterval) {
        clearInterval(flickerInterval);
        flickerInterval = null;
        colons.forEach(colon => (colon.style.opacity = '1'));
      }
    }

    function updateDisplay(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      hoursDisplay.textContent = String(h).padStart(2, '0');
      minutesDisplay.textContent = String(m).padStart(2, '0');
      secondsDisplay.textContent = String(s).padStart(2, '0');
    }

    function notify() {
      if (Notification.permission === 'granted') {
        new Notification('Temporizador', {
          body: 'O tempo acabou!',
          icon: 'https://placehold.co/128x128/png?text=Timer+Done&font=roboto+mono&color=ff0000&bg=000000',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Temporizador', {
              body: 'O tempo acabou!',
              icon: 'https://placehold.co/128x128/png?text=Timer+Done&font=roboto+mono&color=ff0000&bg=000000',
            });
          }
        });
      }
      // Play beep sound
      const beep = new Audio(
        'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA='
      );
      beep.play();
      alert('O tempo acabou!');
    }

    function startTimer() {
      if (intervalId !== null) return;

      let h = parseInt(hoursInput.value, 10);
      let m = parseInt(minutesInput.value, 10);
      let s = parseInt(secondsInput.value, 10);

      if (
        isNaN(h) ||
        isNaN(m) ||
        isNaN(s) ||
        h < 0 ||
        m < 0 ||
        s < 0 ||
        m > 59 ||
        s > 59
      ) {
        alert('Por favor, insira valores válidos para horas, minutos e segundos.');
        return;
      }

      totalSeconds = h * 3600 + m * 60 + s;

      if (totalSeconds <= 0) {
        alert('Por favor, defina um tempo maior que zero.');
        return;
      }

      hoursInput.disabled = true;
      minutesInput.disabled = true;
      secondsInput.disabled = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;

      updateDisplay(totalSeconds);
      startFlicker();

      intervalId = setInterval(() => {
        if (!isPaused) {
          totalSeconds--;
          updateDisplay(totalSeconds);
          if (totalSeconds <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            hoursInput.disabled = false;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            pauseBtn.textContent = 'Pausar';
            pauseBtn.setAttribute('aria-pressed', 'false');
            stopFlicker();
            notify();
          }
        }
      }, 1000);
    }

    function pauseTimer() {
      if (intervalId === null) return;
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? 'Retomar' : 'Pausar';
      pauseBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
      if (isPaused) {
        stopFlicker();
      } else {
        startFlicker();
      }
    }

    function resetTimer() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      totalSeconds = 0;
      isPaused = false;
      updateDisplay(0);
      hoursInput.disabled = false;
      minutesInput.disabled = false;
      secondsInput.disabled = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      pauseBtn.textContent = 'Pausar';
      pauseBtn.setAttribute('aria-pressed', 'false');
      resetBtn.disabled = false;
      hoursInput.value = 0;
      minutesInput.value = 0;
      secondsInput.value = 0;
      stopFlicker();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateDisplay(0);