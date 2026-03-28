// === STORAGE (FIRESTORE) ===
async function loadData() {
    const uid = _auth.currentUser?.uid;
    if (!uid) return;

    const snap = await _getDoc(_fbDoc(`users/${uid}`));
    if (snap.exists()) {
        const data    = snap.data();
        profiles      = data.profiles      || {};
        activeProfile = data.activeProfile || null;
    }
}

function saveData() {
    const uid = _auth.currentUser?.uid;
    if (!uid) return;

    _setDoc(_fbDoc(`users/${uid}`), {
        profiles,
        activeProfile:  activeProfile || null,
        updatedAt:      _serverTimestamp(),
    }).catch(err => console.error('Erro ao salvar:', err));
}
