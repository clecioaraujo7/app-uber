// === FILTERS ===
function filterRecords(records, filter) {
    const now   = new Date();
    const today = getTodayStr();

    return records.filter(record => {
        const recordDate = new Date(record.date + 'T12:00:00');
        switch (filter) {
            case 'today': return record.date === today;
            case 'week':  return recordDate >= new Date(now - 7  * MS_PER_DAY);
            case 'month': return recordDate >= new Date(now - 30 * MS_PER_DAY);
            case 'custom': {
                const from = dateFilter.from ? new Date(dateFilter.from + 'T00:00:00') : new Date(0);
                const to   = dateFilter.to   ? new Date(dateFilter.to   + 'T23:59:59') : new Date();
                return recordDate >= from && recordDate <= to;
            }
            default: return true;
        }
    });
}

function getFilterTitle() {
    switch (currentFilter) {
        case 'today':  return 'Faturamento — hoje';
        case 'week':   return 'Faturamento — últimos 7 dias';
        case 'month':  return `Faturamento — ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        case 'custom': {
            if (dateFilter.from && dateFilter.to)
                return `Faturamento — ${formatDate(dateFilter.from)} a ${formatDate(dateFilter.to)}`;
            return 'Faturamento — período selecionado';
        }
        default: return 'Faturamento — todos os registros';
    }
}

function filtrar(tipo) {
    setActiveFilterButton(`btn-${tipo}`);
    currentFilter = FILTER_MAP[tipo] ?? 'all';
    updateDashboard();
}

function applyDateFilter() {
    dateFilter.from = document.getElementById('date-from').value;
    dateFilter.to   = document.getElementById('date-to').value;
    currentFilter   = 'custom';
    setActiveFilterButton('btn-calendar');
    updateDashboard();
    hideDateModal();
}

function clearDateFilter() {
    dateFilter = { from: null, to: null };
    filtrar('todos');
}
