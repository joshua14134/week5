const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const moodSelect = document.getElementById('moodSelect');
const nowPlaying = document.getElementById('nowPlaying');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');

const moodTracks = {
  calm: "calm.mp3",
  happy: "happy.mp3",
  dark: "dark.mp3"
};

let audio = new Audio();
let audioContext, analyser, source, dataArray, bufferLength;

playBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  playMusic(mood);
});

pauseBtn.addEventListener("click", () => {
  audio.pause();
  nowPlaying.textContent = `⏸️ Paused: ${capitalize(moodSelect.value)}`;
});

function playMusic(mood) {
  const songName = capitalize(mood);
  audio.src = moodTracks[mood];
  audio.play().then(() => {
    nowPlaying.textContent = `🎵 Now Playing: ${songName}`;
    if (!audioContext) setupVisualizer();
  }).catch(() => {
    alert("Please click on the page to enable audio playback.");
  });
}

function setupVisualizer() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 64;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  draw();
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${barHeight + 100},50,150)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
