// === MODALS ===
function showRegisterModal() {
    toggleModal('modal-overlay', 'register-modal', true);
    document.getElementById('register-modal').scrollTop = 0;
}

function hideRegisterModal() {
    toggleModal('modal-overlay', 'register-modal', false);
}

function showDateModal() {
    setModalVisibility('date-filter-overlay', true);
    setModalVisibility('date-filter-modal', true);
    document.getElementById('date-from').value = dateFilter.from || '';
    document.getElementById('date-to').value   = dateFilter.to   || '';
}

function hideDateModal() {
    setModalVisibility('date-filter-overlay', false);
    setModalVisibility('date-filter-modal', false);
}

function toggleDateModal() {
    const isOpen = document.getElementById('date-filter-modal').style.display === 'block';
    isOpen ? hideDateModal() : showDateModal();
}
