// === UI HELPERS ===
function setScreenActive(id, active) {
    document.getElementById(id).classList.toggle('active', active);
}

function toggleModal(overlayId, modalId, show) {
    [overlayId, modalId].forEach(id => document.getElementById(id).classList.toggle('active', show));
}

function setModalVisibility(id, visible) {
    const el = document.getElementById(id);
    el.style.display = visible ? 'block' : 'none';
    el.classList.toggle('active', visible);
}

function setActiveFilterButton(activeBtnId) {
    ['btn-todos', 'btn-hoje', 'btn-semana', 'btn-mes', 'btn-calendar'].forEach(id => {
        const btn = document.getElementById(id);
        const isActive = id === activeBtnId;
        btn.style.background = isActive ? '#00d4ff' : 'transparent';
        btn.style.color       = isActive ? '#050d1a' : '#5a8ab0';
    });
}
