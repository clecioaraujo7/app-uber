// === RECORDS ===
function saveRecord() {
    if (!activeProfile) {
        alert('Selecione um perfil primeiro!');
        return;
    }

    const record = {
        date:     document.getElementById('record-date').value,
        gross:    parseFloat(document.getElementById('record-gross').value)    || 0,
        expenses: parseFloat(document.getElementById('record-expenses').value) || 0,
        km:       parseFloat(document.getElementById('record-km').value)       || 0,
        rides:    parseInt(document.getElementById('record-rides').value)      || 0,
        hours:    parseFloat(document.getElementById('record-hours').value)    || 0,
    };

    profiles[activeProfile].records.unshift(record);
    saveData();
    updateDashboard();
    hideRegisterModal();
    resetRecordForm();
}

function deleteRecordByData(dateStr) {
    if (!activeProfile || !confirm('Deletar este registro?')) return;
    profiles[activeProfile].records = profiles[activeProfile].records.filter(r => r.date !== dateStr);
    saveData();
    updateDashboard();
}

function resetRecordForm() {
    document.querySelectorAll('#register-modal input').forEach(input => {
        input.value = input.id === 'record-date' ? getTodayStr() : '';
    });
}
