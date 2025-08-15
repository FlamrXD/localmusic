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