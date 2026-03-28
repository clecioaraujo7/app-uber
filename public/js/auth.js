// === AUTH ===
function signInWithGoogle() {
    const provider = new _GoogleAuthProvider();
    _signInWithPopup(provider).catch(() => {
        alert('Erro ao fazer login. Verifique sua conexão e tente novamente.');
    });
}

function doSignOut() {
    if (!confirm('Sair da conta?')) return;
    _signOut().then(() => {
        profiles      = {};
        activeProfile = null;
    });
}

// Chamado pelo firebase-config.js (módulo) após auth ser inicializado
async function handleAuthStateChange(user) {
    if (user) {
        const loading = document.getElementById('loading-screen');
        loading.style.display = 'flex';

        setScreenActive('login-screen',          false);
        setScreenActive('profile-select-screen', false);
        setScreenActive('dashboard-screen',      false);

        await loadData();

        loading.style.display = 'none';
        document.getElementById('record-date').value = getTodayStr();

        const nameEl = document.getElementById('user-display-name');
        if (nameEl) nameEl.textContent = user.displayName || user.email;

        updateProfileScreen();

        if (activeProfile && profiles[activeProfile]) {
            selectProfile(activeProfile);
        } else {
            activeProfile = null;
            setScreenActive('profile-select-screen', true);
        }
    } else {
        profiles      = {};
        activeProfile = null;
        setScreenActive('dashboard-screen',      false);
        setScreenActive('profile-select-screen', false);
        setScreenActive('login-screen',          true);
    }
}
