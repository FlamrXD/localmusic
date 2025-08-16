let playlist = [];
let currentIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Trigger hidden file input when button is clicked
document.getElementById('selectFolderBtn').addEventListener('click', () => {
    document.getElementById('folderInput').click();
});

document.getElementById('folderInput').addEventListener('change', (event) => {
    const files = Array.from(event.target.files)
        .filter(file => file.name.toLowerCase().endsWith('.mp3'));

    if (files.length === 0) return;

    playlist = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
    }));

    shuffleArray(playlist);

    const playlistEl = document.getElementById('playlist');
    playlistEl.innerHTML = '';

    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.name;
        li.addEventListener('click', () => playTrack(index));
        playlistEl.appendChild(li);
    });

    currentIndex = 0;
    playTrack(currentIndex);
});

function playTrack(index) {
    currentIndex = index;
    const audio = document.getElementById('audioPlayer');
    audio.src = playlist[index].url;
    audio.play();
}

document.getElementById('audioPlayer').addEventListener('ended', () => {
    currentIndex++;
    if (currentIndex >= playlist.length) {
        currentIndex = 0; // loop back to start
    }
    playTrack(currentIndex);
});
const changeBtn = document.getElementById('changeBtn');
const fileInput = document.getElementById('fileInput');

// Apply saved background on page load
const savedBg = localStorage.getItem('bgImage');
if (savedBg) {
    document.body.style.backgroundImage = `url('${savedBg}')`;
    adjustColors(savedBg);
}

changeBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        const reader = new FileReader();
        reader.onload = e => {
            const imgData = e.target.result;
            document.body.style.backgroundImage = `url('${imgData}')`;
            localStorage.setItem('bgImage', imgData); // save
            adjustColors(imgData); // adjust text/button colors
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});

// Function to compute average color and set text/button colors
function adjustColors(imgSrc) {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.src = imgSrc;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4 * 10) { // sample every 10th pixel
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Determine brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const textColor = brightness < 128 ? 'white' : 'black';
        const btnBg = brightness < 128 ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

        // Apply to body, h1, and all buttons
        document.body.style.color = textColor;
        document.querySelectorAll('h1').forEach(h => h.style.color = textColor);
        document.querySelectorAll('button').forEach(btn => {
            btn.style.backgroundColor = btnBg;
            btn.style.color = textColor;
        });
    };
}


const folderInput = document.getElementById('folderInput');
const customBtn = document.querySelector('.custom-file-btn');

folderInput.addEventListener('change', () => {
    if (folderInput.files.length > 0) {
        customBtn.textContent = folderInput.files.length + " file(s) selected";
    } else {
        customBtn.textContent = "Choose Files";
    }
});
const popup = document.getElementById('settingsPopup');
const header = document.getElementById('settingsHeader');
const openBtn = document.getElementById('openSettings');
const closeBtn = document.getElementById('closeSettings');

openBtn.addEventListener('click', () => popup.style.display = 'block');
closeBtn.addEventListener('click', () => popup.style.display = 'none');

let offsetX = 0, offsetY = 0, isDown = false;

header.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
});

document.addEventListener('mouseup', () => isDown = false);

document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // keep it inside viewport
    const maxX = window.innerWidth - popup.offsetWidth;
    const maxY = window.innerHeight - popup.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
});
