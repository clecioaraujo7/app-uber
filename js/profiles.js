// === PROFILES ===
function createProfile() {
    const name = prompt('Nome ou apelido do perfil:');
    if (!name?.trim()) return;

    const id = Date.now().toString();
    profiles[id] = { name: name.trim(), color: randomColor(), records: [] };
    activeProfile = id;
    saveData();
    updateProfileScreen();
    selectProfile(id);
}

function selectProfile(id) {
    activeProfile = id;
    saveData();

    const profile = profiles[id];
    const avatar  = document.getElementById('current-avatar');
    avatar.style.background = profile.color;
    avatar.textContent      = getInitials(profile.name);

    document.getElementById('current-profile-name').textContent    = profile.name;
    document.getElementById('current-profile-records').textContent =
        `${profile.records.length} registro${profile.records.length !== 1 ? 's' : ''}`;

    setScreenActive('profile-select-screen', false);
    setScreenActive('dashboard-screen', true);
    filtrar('todos');
}

function switchProfile() {
    setScreenActive('dashboard-screen', false);
    setScreenActive('profile-select-screen', true);
    updateProfileScreen();
}

function updateProfileScreen() {
    const grid = document.getElementById('profiles-grid');
    grid.innerHTML = '';

    Object.entries(profiles).forEach(([id, profile]) => {
        const count = profile.records.length;
        const div   = document.createElement('div');
        div.className = `profile-card ${activeProfile === id ? 'active' : ''}`;
        div.onclick   = () => selectProfile(id);
        div.innerHTML = `
            <div class="avatar" style="background: ${profile.color}">${getInitials(profile.name)}</div>
            <h3 style="margin: 12px 0 8px 0; font-size: 20px;">${profile.name}</h3>
            <p style="color: var(--text-secondary); font-size: 14px;">${count} registro${count !== 1 ? 's' : ''}</p>
        `;
        grid.appendChild(div);
    });
}
