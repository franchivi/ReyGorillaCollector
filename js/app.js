// ReygorillaCollector - Application Logic
// Handles state, rendering, event listeners, localStorage CRUD, and Web Audio sound effects.

let audioCtx = null;

const state = {
  games: [],
  filters: {
    search: '',
    generation: '',
    consoleId: '',
    status: '',
    condition: ''
  },
  sortBy: 'title-asc',
  view: 'grid', // 'grid' or 'list'
  soundEnabled: true,
  crtMode: true,
  editingGameId: null
};

// Initialize the Application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  // Unblock AudioContext on first click
  document.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  });
});

function initApp() {
  // 1. Load configuration settings
  const storedCrt = localStorage.getItem('rg_crt_mode');
  state.crtMode = storedCrt !== null ? storedCrt === 'true' : true;
  if (state.crtMode) {
    document.body.classList.add('crt-mode');
  } else {
    document.body.classList.remove('crt-mode');
  }

  const storedSound = localStorage.getItem('rg_sound_enabled');
  state.soundEnabled = storedSound !== null ? storedSound === 'true' : true;
  updateSoundToggleButton();

  const storedView = localStorage.getItem('rg_view_mode');
  state.view = storedView !== null ? storedView : 'grid';
  updateViewToggleButton();

  // 2. Load Games Database (or populate with initial games)
  const storedGames = localStorage.getItem('rg_games_collection');
  if (storedGames) {
    state.games = JSON.parse(storedGames);
  } else {
    state.games = [...INITIAL_GAMES];
    localStorage.setItem('rg_games_collection', JSON.stringify(state.games));
  }

  // 3. Populate select lists in filter and wizard
  populateConsoleDropdowns();

  // 4. Set up all Event Listeners
  setupEventListeners();

  // 5. Initial Render
  renderDashboard();
  renderCatalog();
}

// Retro Synthesizer Sounds (Web Audio API)
function playSound(type) {
  if (!state.soundEnabled) return;
  
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.07); // D3
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    } 
    else if (type === 'save') {
      // Ascending retro sound
      osc.type = 'square';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.setValueAtTime(329.63, now + 0.06); // E4
      osc.frequency.setValueAtTime(392.00, now + 0.12); // G4
      osc.frequency.setValueAtTime(523.25, now + 0.18); // C5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } 
    else if (type === 'delete') {
      // Descending retro slide
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(392.00, now); // G4
      osc.frequency.exponentialRampToValueAtTime(98.00, now + 0.25); // G2
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } 
    else if (type === 'toggle') {
      // High double blip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.00, now); // A5
      osc.frequency.setValueAtTime(987.77, now + 0.06); // B5
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    console.warn("Web Audio Context not loaded yet: ", e);
  }
}

// Populate Console selections in form and filter
function populateConsoleDropdowns() {
  const filterConsoleSelect = document.getElementById('filter-console');
  const formConsoleSelect = document.getElementById('game-console');
  
  if (!filterConsoleSelect || !formConsoleSelect) return;

  // Clear existing items
  filterConsoleSelect.innerHTML = '<option value="">Todas las consolas</option>';
  formConsoleSelect.innerHTML = '<option value="" disabled selected>Selecciona una consola...</option>';

  // Group by generation for the form dropdown
  Object.keys(CONSOLE_GENERATIONS).forEach(genId => {
    const gen = CONSOLE_GENERATIONS[genId];
    const optGroupFilter = document.createElement('optgroup');
    optGroupFilter.label = `${gen.name} - ${gen.period}`;
    
    const optGroupForm = document.createElement('optgroup');
    optGroupForm.label = `${gen.name} - ${gen.period}`;

    const consolesInGen = CONSOLES_DATABASE.filter(c => c.generation === genId);
    
    consolesInGen.forEach(c => {
      const optFilter = document.createElement('option');
      optFilter.value = c.id;
      optFilter.textContent = `${c.name} (${c.year})`;
      optGroupFilter.appendChild(optFilter);

      const optForm = document.createElement('option');
      optForm.value = c.id;
      optForm.textContent = `${c.name} (${c.year})`;
      optGroupForm.appendChild(optForm);
    });

    filterConsoleSelect.appendChild(optGroupFilter);
    formConsoleSelect.appendChild(optGroupForm);
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // CRT Toggle
  document.getElementById('toggle-crt').addEventListener('click', () => {
    state.crtMode = !state.crtMode;
    localStorage.setItem('rg_crt_mode', state.crtMode);
    document.body.classList.toggle('crt-mode', state.crtMode);
    playSound('toggle');
  });

  // Sound Toggle
  document.getElementById('toggle-sound').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('rg_sound_enabled', state.soundEnabled);
    updateSoundToggleButton();
    playSound('toggle');
  });

  // View View Mode Toggles
  document.getElementById('view-grid').addEventListener('click', () => {
    if (state.view !== 'grid') {
      state.view = 'grid';
      localStorage.setItem('rg_view_mode', 'grid');
      updateViewToggleButton();
      renderCatalog();
      playSound('click');
    }
  });
  
  document.getElementById('view-list').addEventListener('click', () => {
    if (state.view !== 'list') {
      state.view = 'list';
      localStorage.setItem('rg_view_mode', 'list');
      updateViewToggleButton();
      renderCatalog();
      playSound('click');
    }
  });

  // Filters Event Listeners
  document.getElementById('search-game').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderCatalog();
  });

  document.getElementById('filter-generation').addEventListener('change', (e) => {
    state.filters.generation = e.target.value;
    renderCatalog();
    playSound('click');
  });

  document.getElementById('filter-console').addEventListener('change', (e) => {
    state.filters.consoleId = e.target.value;
    renderCatalog();
    playSound('click');
  });

  document.getElementById('filter-status').addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    renderCatalog();
    playSound('click');
  });

  document.getElementById('filter-condition').addEventListener('change', (e) => {
    state.filters.condition = e.target.value;
    renderCatalog();
    playSound('click');
  });

  // Sorting
  document.getElementById('sort-by').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderCatalog();
    playSound('click');
  });

  // Modals Toggles & Actions
  document.getElementById('btn-add-game').addEventListener('click', () => {
    openAddEditModal();
  });

  document.getElementById('btn-close-form').addEventListener('click', () => {
    closeModal('modal-form');
    playSound('click');
  });

  document.getElementById('btn-close-detail').addEventListener('click', () => {
    closeModal('modal-detail');
    playSound('click');
  });

  // Star Rating Selection
  const starOptions = document.querySelectorAll('#stars-container .star-option');
  starOptions.forEach(star => {
    star.addEventListener('click', () => {
      const ratingValue = parseInt(star.getAttribute('data-value'));
      document.getElementById('game-rating').value = ratingValue;
      updateStarsUI(ratingValue);
      playSound('click');
    });
  });

  // Save Game Form Submission
  document.getElementById('game-form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveGame();
  });

  // Backup & Import buttons
  document.getElementById('btn-backup').addEventListener('click', () => {
    exportCollection();
    playSound('save');
  });

  document.getElementById('btn-import-trigger').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', (e) => {
    importCollection(e);
  });

  // Mobile filter toggle
  const toggleFiltersBtn = document.getElementById('btn-toggle-filters');
  if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.filters-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('mobile-active');
        playSound('click');
      }
    });
  }
}

// Helper to update toggle status visually
function updateSoundToggleButton() {
  const btn = document.getElementById('toggle-sound');
  if (state.soundEnabled) {
    btn.innerHTML = '🔊 Sonido';
    btn.classList.add('btn-retro-primary');
  } else {
    btn.innerHTML = '🔇 Silencio';
    btn.classList.remove('btn-retro-primary');
  }
}

function updateViewToggleButton() {
  document.getElementById('view-grid').classList.toggle('active', state.view === 'grid');
  document.getElementById('view-list').classList.toggle('active', state.view === 'list');
}

// Render Dashboard stats
function renderDashboard() {
  const totalGames = state.games.length;
  const ownedGames = state.games.filter(g => g.status === 'owned' || g.status === 'completed' || g.status === 'playing').length;
  const wishlistGames = state.games.filter(g => g.status === 'wishlist').length;
  const completedGames = state.games.filter(g => g.status === 'completed').length;
  const completionRate = totalGames > 0 ? Math.round((completedGames / (totalGames - wishlistGames || 1)) * 100) : 0;
  
  // Total Estimated Investment
  const totalInvestment = state.games
    .filter(g => g.status !== 'wishlist' && g.price)
    .reduce((sum, g) => sum + parseFloat(g.price || 0), 0);

  document.getElementById('stat-total').textContent = totalGames;
  document.getElementById('stat-owned').textContent = ownedGames;
  document.getElementById('stat-wishlist').textContent = wishlistGames;
  document.getElementById('stat-completed').textContent = `${completionRate}%`;

  // Render dynamic CSS/HTML Bar Chart for generations
  const chartContainer = document.getElementById('chart-generations');
  if (chartContainer) {
    chartContainer.innerHTML = '';
    
    // Count per generation
    const genCounts = {};
    Object.keys(CONSOLE_GENERATIONS).forEach(gId => genCounts[gId] = 0);
    
    state.games.forEach(g => {
      if (genCounts[g.generation] !== undefined) {
        genCounts[g.generation]++;
      }
    });

    const maxCount = Math.max(...Object.values(genCounts), 1);

    Object.keys(CONSOLE_GENERATIONS).forEach(gId => {
      const gen = CONSOLE_GENERATIONS[gId];
      const count = genCounts[gId];
      const percentage = (count / maxCount) * 100;

      const barItem = document.createElement('div');
      barItem.className = 'chart-bar-item';
      barItem.innerHTML = `
        <div class="chart-bar-labels">
          <span class="chart-bar-name">
            <span class="chart-bar-dot" style="background-color: ${gen.color}; box-shadow: 0 0 8px ${gen.color}"></span>
            ${gen.name}
          </span>
          <span class="chart-bar-count">${count} juegos</span>
        </div>
        <div class="chart-bar-bg">
          <div class="chart-bar-fill" style="width: 0%; background-color: ${gen.color}"></div>
        </div>
      `;
      chartContainer.appendChild(barItem);

      // Trigger width animation in next frame
      setTimeout(() => {
        const fill = barItem.querySelector('.chart-bar-fill');
        if (fill) fill.style.width = `${percentage}%`;
      }, 50);
    });
  }

  // Render Console distribution lists
  const distList = document.getElementById('distribution-list');
  if (distList) {
    distList.innerHTML = '';
    
    // Count per console
    const consoleCounts = {};
    CONSOLES_DATABASE.forEach(c => consoleCounts[c.id] = 0);
    
    state.games.forEach(g => {
      if (consoleCounts[g.consoleId] !== undefined) {
        consoleCounts[g.consoleId]++;
      }
    });

    // Sort active consoles (having > 0 games) or show top ones
    const sortedActiveConsoles = CONSOLES_DATABASE
      .map(c => ({ ...c, count: consoleCounts[c.id] }))
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count);

    if (sortedActiveConsoles.length === 0) {
      distList.innerHTML = '<div style="color: #6b7280; font-size: 0.9rem; text-align: center; padding-top: 2rem;">No hay consolas registradas.</div>';
    } else {
      sortedActiveConsoles.forEach(c => {
        const gen = CONSOLE_GENERATIONS[c.generation];
        const item = document.createElement('div');
        item.className = 'dist-item';
        item.innerHTML = `
          <div class="dist-name">
            <span class="status-dot" style="background-color: ${gen.color}"></span>
            ${c.name}
          </div>
          <div class="dist-count">${c.count}</div>
        `;
        distList.appendChild(item);
      });
    }
  }
}

// Filter and Sort Games Catalog
function getFilteredAndSortedGames() {
  return state.games.filter(game => {
    // 1. Text Search
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(q);
      const console = CONSOLES_DATABASE.find(c => c.id === game.consoleId);
      const matchConsole = console ? console.name.toLowerCase().includes(q) : false;
      const matchNotes = game.notes ? game.notes.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchConsole && !matchNotes) return false;
    }

    // 2. Generation Filter
    if (state.filters.generation && game.generation !== state.filters.generation) return false;

    // 3. Console Filter
    if (state.filters.consoleId && game.consoleId !== state.filters.consoleId) return false;

    // 4. Status Filter
    if (state.filters.status && game.status !== state.filters.status) return false;

    // 5. Condition Filter
    if (state.filters.condition && game.condition !== state.filters.condition) return false;

    return true;
  }).sort((a, b) => {
    switch (state.sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-desc':
        return new Date(b.dateAdded || '1970-01-01') - new Date(a.dateAdded || '1970-01-01');
      case 'date-asc':
        return new Date(a.dateAdded || '1970-01-01') - new Date(b.dateAdded || '1970-01-01');
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });
}

// Render Games Catalog (Grid or List view)
function renderCatalog() {
  const activeGames = getFilteredAndSortedGames();
  const catalogWrapper = document.getElementById('catalog-wrapper');
  
  // Update count badge
  document.getElementById('catalog-count').textContent = activeGames.length;

  if (!catalogWrapper) return;

  if (activeGames.length === 0) {
    catalogWrapper.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👾</div>
        <div class="empty-title">Sin resultados</div>
        <div class="empty-text">No se encontraron videojuegos en la colección que coincidan con los filtros seleccionados. Intenta cambiar los filtros o agrega un juego nuevo.</div>
        <button class="btn-retro btn-retro-primary" onclick="openAddEditModal()">+ Agregar Videojuego</button>
      </div>
    `;
    return;
  }

  if (state.view === 'grid') {
    catalogWrapper.innerHTML = `<div class="game-grid"></div>`;
    const grid = catalogWrapper.querySelector('.game-grid');
    
    activeGames.forEach(game => {
      const consoleMeta = CONSOLES_DATABASE.find(c => c.id === game.consoleId) || { name: 'Unknown', media: 'Cartridge', gradient: 'linear-gradient(135deg, #374151, #111827)' };
      const genMeta = CONSOLE_GENERATIONS[game.generation] || { color: '#ffffff' };
      
      const isDisc = ['CD-ROM', 'DVD-ROM', 'MiniDVD', 'GD-ROM'].includes(consoleMeta.media);
      let cardHTML = '';

      const ratingStars = Array(5).fill(0).map((_, i) => i < game.rating ? '★' : '☆').join('');

      let conditionStyleClass = 'cond-loose-style';
      if (game.condition === 'Boxed') conditionStyleClass = 'cond-boxed-style';
      if (game.condition === 'CIB') conditionStyleClass = 'cond-cib-style';
      if (game.condition === 'Sealed') conditionStyleClass = 'cond-sealed-style';

      let statusColor = 'var(--status-owned)';
      let statusName = 'En Propiedad';
      if (game.status === 'wishlist') { statusColor = 'var(--status-wishlist)'; statusName = 'Lista de Deseos'; }
      if (game.status === 'completed') { statusColor = 'var(--status-completed)'; statusName = 'Completado'; }
      if (game.status === 'playing') { statusColor = 'var(--status-playing)'; statusName = 'Jugando'; }

      // Custom cartridge vs disc jewel case styles
      if (isDisc) {
        cardHTML = `
          <div class="game-card card-disc" onclick="openDetailModal('${game.id}')">
            <div class="disc-glare"></div>
            <div class="disc-peeking-media"></div>
            <div class="disc-spine">
              <span class="disc-spine-text">${consoleMeta.name.toUpperCase()}</span>
            </div>
            <div class="disc-cover-container">
              <div class="disc-cover" style="background-image: ${consoleMeta.gradient}">
                <div class="disc-cover-overlay"></div>
                <div style="z-index: 2; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span class="card-brand">CD-ROM FORMAT</span>
                  <span class="card-console-badge" style="background-color: ${genMeta.color}">${consoleMeta.name}</span>
                </div>
                
                <div class="card-info">
                  <h3 class="card-title">${game.title}</h3>
                  <div class="card-metadata-row">
                    <span class="card-region">${game.region}</span>
                    <span class="card-condition ${conditionStyleClass}">${game.condition}</span>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="card-stars">${ratingStars}</div>
                  <div class="card-status-dot" style="color: ${statusColor}">
                    <span class="status-dot" style="background-color: ${statusColor}"></span>
                    ${statusName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        cardHTML = `
          <div class="game-card card-cartridge" onclick="openDetailModal('${game.id}')">
            <div class="cartridge-ridges">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div class="cartridge-label-container">
              <div class="cartridge-label" style="background-image: ${consoleMeta.gradient}">
                <div class="cartridge-label-overlay"></div>
                <div style="z-index: 2; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span class="card-brand">RETRO CARTRIDGE</span>
                  <span class="card-console-badge" style="background-color: ${genMeta.color}">${consoleMeta.name}</span>
                </div>
                
                <div class="card-info">
                  <h3 class="card-title">${game.title}</h3>
                  <div class="card-metadata-row">
                    <span class="card-region">${game.region}</span>
                    <span class="card-condition ${conditionStyleClass}">${game.condition}</span>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="card-stars">${ratingStars}</div>
                  <div class="card-status-dot" style="color: ${statusColor}">
                    <span class="status-dot" style="background-color: ${statusColor}"></span>
                    ${statusName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      grid.insertAdjacentHTML('beforeend', cardHTML);
    });

  } else {
    // Render list/table view
    let tableHTML = `
      <div class="table-responsive" style="width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: var(--border-radius); border: 1px solid var(--border-color);">
        <table class="game-list-table" style="border: none; margin-bottom: 0;">
          <thead>
            <tr>
              <th>Videojuego</th>
              <th>Consola</th>
              <th>Generación</th>
              <th>Región</th>
              <th>Estado</th>
              <th>Estado Físico</th>
              <th>Valoración</th>
            </tr>
          </thead>
          <tbody>
    `;

    activeGames.forEach(game => {
      const consoleMeta = CONSOLES_DATABASE.find(c => c.id === game.consoleId) || { name: 'Unknown' };
      const genMeta = CONSOLE_GENERATIONS[game.generation] || { name: 'Unknown', color: '#fff' };
      const ratingStars = Array(5).fill(0).map((_, i) => i < game.rating ? '★' : '☆').join('');

      let conditionStyleClass = 'cond-loose-style';
      if (game.condition === 'Boxed') conditionStyleClass = 'cond-boxed-style';
      if (game.condition === 'CIB') conditionStyleClass = 'cond-cib-style';
      if (game.condition === 'Sealed') conditionStyleClass = 'cond-sealed-style';

      let statusColor = 'var(--status-owned)';
      let statusName = 'En Propiedad';
      if (game.status === 'wishlist') { statusColor = 'var(--status-wishlist)'; statusName = 'Lista de Deseos'; }
      if (game.status === 'completed') { statusColor = 'var(--status-completed)'; statusName = 'Completado'; }
      if (game.status === 'playing') { statusColor = 'var(--status-playing)'; statusName = 'Jugando'; }

      tableHTML += `
        <tr onclick="openDetailModal('${game.id}')">
          <td class="list-title">${game.title}</td>
          <td><span class="list-console" style="border: 1px solid ${genMeta.color}; color: ${genMeta.color}">${consoleMeta.name}</span></td>
          <td style="color: ${genMeta.color}; font-weight: 500;">${genMeta.name}</td>
          <td><span class="card-region">${game.region}</span></td>
          <td style="color: ${statusColor}; font-weight: 600;">
            <span class="status-dot" style="background-color: ${statusColor}; display:inline-block; margin-right: 6px;"></span>
            ${statusName}
          </td>
          <td><span class="card-condition ${conditionStyleClass}">${game.condition}</span></td>
          <td style="color: var(--accent-gold); font-size: 1rem;">${ratingStars}</td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </div>
    `;
    catalogWrapper.innerHTML = tableHTML;
  }
}

// Modal management helpers
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Open Detail Modal
function openDetailModal(gameId) {
  const game = state.games.find(g => g.id === gameId);
  if (!game) return;

  const consoleMeta = CONSOLES_DATABASE.find(c => c.id === game.consoleId) || { name: 'Unknown' };
  const genMeta = CONSOLE_GENERATIONS[game.generation] || { name: 'Unknown', color: '#fff' };
  const ratingStars = Array(5).fill(0).map((_, i) => i < game.rating ? '★' : '☆').join('');

  let statusName = 'En Propiedad';
  let statusColor = 'var(--status-owned)';
  if (game.status === 'wishlist') { statusColor = 'var(--status-wishlist)'; statusName = 'Lista de Deseos'; }
  if (game.status === 'completed') { statusColor = 'var(--status-completed)'; statusName = 'Completado'; }
  if (game.status === 'playing') { statusColor = 'var(--status-playing)'; statusName = 'Jugando'; }

  document.getElementById('detail-title').textContent = game.title;
  
  const consoleBadge = document.getElementById('detail-console');
  consoleBadge.textContent = consoleMeta.name;
  consoleBadge.style.backgroundColor = genMeta.color;

  document.getElementById('detail-generation').textContent = `${genMeta.name} (${genMeta.period})`;
  document.getElementById('detail-region').textContent = game.region;
  document.getElementById('detail-format').textContent = game.format || 'Físico';
  
  const condBadge = document.getElementById('detail-condition');
  condBadge.textContent = game.condition;
  condBadge.className = 'detail-value card-condition';
  condBadge.style.display = 'inline-block';
  condBadge.style.width = 'fit-content';
  
  // Reset condition classes
  condBadge.classList.remove('cond-loose-style', 'cond-boxed-style', 'cond-cib-style', 'cond-sealed-style');
  if (game.condition === 'Loose') condBadge.classList.add('cond-loose-style');
  if (game.condition === 'Boxed') condBadge.classList.add('cond-boxed-style');
  if (game.condition === 'CIB') condBadge.classList.add('cond-cib-style');
  if (game.condition === 'Sealed') condBadge.classList.add('cond-sealed-style');

  const statusVal = document.getElementById('detail-status');
  statusVal.textContent = statusName;
  statusVal.style.color = statusColor;

  document.getElementById('detail-price').textContent = game.price ? `${game.price} €` : 'N/D';
  document.getElementById('detail-rating').textContent = ratingStars;
  document.getElementById('detail-date').textContent = game.dateAdded || 'N/D';
  
  const notesContainer = document.getElementById('detail-notes-container');
  if (game.notes) {
    notesContainer.style.display = 'block';
    document.getElementById('detail-notes').textContent = game.notes;
  } else {
    notesContainer.style.display = 'none';
  }

  // Setup buttons inside detail
  const editBtn = document.getElementById('btn-edit-detail');
  const deleteBtn = document.getElementById('btn-delete-detail');

  // Remove existing listeners
  const newEditBtn = editBtn.cloneNode(true);
  const newDeleteBtn = deleteBtn.cloneNode(true);
  editBtn.parentNode.replaceChild(newEditBtn, editBtn);
  deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

  newEditBtn.addEventListener('click', () => {
    closeModal('modal-detail');
    openAddEditModal(gameId);
  });

  newDeleteBtn.addEventListener('click', () => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${game.title}" de tu colección?`)) {
      deleteGame(gameId);
    }
  });

  openModal('modal-detail');
  playSound('click');
}

// Open Add / Edit Modal Form
function openAddEditModal(gameId = null) {
  const form = document.getElementById('game-form');
  form.reset();

  const titleNode = document.getElementById('form-modal-title');
  state.editingGameId = gameId;

  if (gameId) {
    titleNode.textContent = 'Editar Videojuego';
    const game = state.games.find(g => g.id === gameId);
    if (game) {
      document.getElementById('game-title').value = game.title;
      document.getElementById('game-console').value = game.consoleId;
      document.getElementById('game-region').value = game.region;
      document.getElementById('game-format').value = game.format || 'Cartucho';
      document.getElementById('game-condition').value = game.condition;
      document.getElementById('game-status').value = game.status;
      document.getElementById('game-price').value = game.price || '';
      document.getElementById('game-notes').value = game.notes || '';
      document.getElementById('game-rating').value = game.rating || 5;
      updateStarsUI(game.rating || 5);
    }
  } else {
    titleNode.textContent = 'Agregar Videojuego';
    document.getElementById('game-rating').value = 5;
    updateStarsUI(5);
  }

  openModal('modal-form');
  playSound('click');
}

function updateStarsUI(rating) {
  const stars = document.querySelectorAll('#stars-container .star-option');
  stars.forEach(star => {
    const val = parseInt(star.getAttribute('data-value'));
    if (val <= rating) {
      star.classList.add('selected');
      star.textContent = '★';
    } else {
      star.classList.remove('selected');
      star.textContent = '☆';
    }
  });
}

// Save game handler (Create or Update)
function saveGame() {
  const title = document.getElementById('game-title').value.trim();
  const consoleId = document.getElementById('game-console').value;
  const region = document.getElementById('game-region').value;
  const format = document.getElementById('game-format').value;
  const condition = document.getElementById('game-condition').value;
  const status = document.getElementById('game-status').value;
  const price = parseFloat(document.getElementById('game-price').value) || null;
  const notes = document.getElementById('game-notes').value.trim();
  const rating = parseInt(document.getElementById('game-rating').value) || 5;

  if (!title || !consoleId) {
    alert('Por favor, introduce el título y selecciona la consola.');
    return;
  }

  const consoleMeta = CONSOLES_DATABASE.find(c => c.id === consoleId);
  const generation = consoleMeta ? consoleMeta.generation : 'gen1_2';

  if (state.editingGameId) {
    // Update existing game
    const gameIndex = state.games.findIndex(g => g.id === state.editingGameId);
    if (gameIndex !== -1) {
      state.games[gameIndex] = {
        ...state.games[gameIndex],
        title,
        consoleId,
        generation,
        region,
        format,
        condition,
        status,
        price,
        notes,
        rating
      };
    }
  } else {
    // Create new game
    const newGame = {
      id: 'game_' + Date.now(),
      title,
      consoleId,
      generation,
      region,
      format,
      condition,
      status,
      price,
      notes,
      rating,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    state.games.push(newGame);
  }

  // Save to local storage
  localStorage.setItem('rg_games_collection', JSON.stringify(state.games));
  
  closeModal('modal-form');
  playSound('save');
  
  // Re-render
  renderDashboard();
  renderCatalog();
}

// Delete game handler
function deleteGame(gameId) {
  state.games = state.games.filter(g => g.id !== gameId);
  localStorage.setItem('rg_games_collection', JSON.stringify(state.games));
  
  closeModal('modal-detail');
  playSound('delete');
  
  renderDashboard();
  renderCatalog();
}

// Export database as JSON file
function exportCollection() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.games, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `reygorilla_collection_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import database from JSON file
function importCollection(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedGames = JSON.parse(e.target.result);
      if (Array.isArray(importedGames)) {
        // Simple validation of fields
        const valid = importedGames.every(g => g.title && g.consoleId && g.generation);
        if (valid) {
          state.games = importedGames;
          localStorage.setItem('rg_games_collection', JSON.stringify(state.games));
          playSound('save');
          alert('¡Colección importada con éxito!');
          renderDashboard();
          renderCatalog();
        } else {
          alert('El archivo no tiene el formato de colección válido.');
        }
      } else {
        alert('El archivo no contiene un array de videojuegos válido.');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON: ' + err.message);
    }
  };
  reader.readAsText(file);
  // Reset file input
  event.target.value = '';
}
