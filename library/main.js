const showGrid = document.getElementById('show-grid');
const genreFilter = document.getElementById('genre-filter');
const playerModal = document.getElementById('player-modal');
const playerIframe = document.getElementById('player-iframe');
const backBtn = document.getElementById('back-btn');
const episodeList = document.getElementById('episode-list');

let allShows = [];
let currentSeries = null;
let currentEpisode = 0;

// Fetch shows from library/data.json
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    allShows = data;
    populateGenres();
    displayShows('All');
  });

function populateGenres() {
  let genres = new Set();
  allShows.forEach(show => show.genres.forEach(g => genres.add(g)));
  Array.from(genres).sort().forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreFilter.appendChild(opt);
  });
}

genreFilter.addEventListener('change', () => {
  displayShows(genreFilter.value);
});

function displayShows(filterGenre) {
  showGrid.innerHTML = '';
  const filtered = allShows.filter(show => filterGenre === 'All' || show.genres.includes(filterGenre));
  filtered.forEach(show => {
    const card = document.createElement('div');
    card.className = 'show-card';
    card.innerHTML = `
      <img src="${show.preview}" alt="${show.title}">
      <div class="title">${show.title}</div>
    `;
    card.addEventListener('click', () => openPlayer(show));
    showGrid.appendChild(card);
  });
}

function openPlayer(series) {
  currentSeries = series;
  currentEpisode = 0;
  playerModal.style.display = 'flex';
  loadEpisode();
}

function loadEpisode() {
  if(currentSeries.type === 'movie') {
    playerIframe.src = currentSeries.episodes[0];
    episodeList.style.display = 'none';
  } else {
    playerIframe.src = currentSeries.episodes[currentEpisode];
    episodeList.style.display = 'grid';
    episodeList.innerHTML = '';

    currentSeries.episodes.forEach((ep, idx) => {
      const card = document.createElement('div');
      card.className = 'episode-card';
      card.innerHTML = `
        <img src="${currentSeries.preview}" alt="${currentSeries.title} EP ${idx + 1}">
        <div class="ep-title" data-ep-number="${idx + 1}">EP ${idx + 1}</div>
      `;
      if(idx === currentEpisode) card.style.borderColor = "#fff";
      card.addEventListener('click', () => {
        currentEpisode = idx;
        loadEpisode();
      });
      episodeList.appendChild(card);
    });
  }
}

backBtn.addEventListener('click', () => {
  playerModal.style.display = 'none';
  playerIframe.src = '';
});
