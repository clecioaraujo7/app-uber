// === INIT ===
// A inicialização é gerenciada pelo auth.onAuthStateChanged em auth.js
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('record-date').value = getTodayStr();
});
