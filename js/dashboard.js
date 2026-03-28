// === DASHBOARD ===
function updateDashboard() {
    updateTodayCard();
    if (!activeProfile) return;

    const filteredRecords = filterRecords(profiles[activeProfile].records, currentFilter);
    updateStatsAndList(filteredRecords);
    updateCharts(filteredRecords);
}

function updateTodayCard() {
    if (!activeProfile) return;

    const todayRecord = profiles[activeProfile].records.find(r => r.date === getTodayStr());

    document.getElementById('no-today').style.display    = todayRecord ? 'none'  : 'block';
    document.getElementById('today-stats').style.display = todayRecord ? 'block' : 'none';

    if (!todayRecord) return;

    const gross    = parseFloat(todayRecord.gross    || 0);
    const expenses = parseFloat(todayRecord.expenses || 0);

    document.getElementById('today-gross').textContent = formatCurrency(gross);
    document.getElementById('today-km').textContent    = `${parseFloat(todayRecord.km    || 0).toFixed(0)} km`;
    document.getElementById('today-rides').textContent = parseInt(todayRecord.rides || 0);
    document.getElementById('today-hours').textContent = `${parseFloat(todayRecord.hours || 0).toFixed(1)}h`;
    document.getElementById('today-net').textContent   = formatCurrency(gross - expenses);
}

function updateStatsAndList(filteredRecords) {
    if (filteredRecords.length === 0) {
        document.getElementById('stats-grid').style.display = 'none';
        document.getElementById('records-list').innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <h3>Nenhum registro no período</h3>
                <p>Tente outro filtro ou adicione registros.</p>
            </div>`;
        return;
    }

    document.getElementById('stats-grid').style.display = 'grid';

    const { gross, expenses, km, rides, hours } = calcStats(filteredRecords);
    const net     = gross - expenses;
    const avgHour = hours > 0 ? (gross / hours).toFixed(2) : 0;

    document.getElementById('total-gross').textContent = formatCurrency(gross);
    document.getElementById('total-net').textContent   = formatCurrency(net);
    document.getElementById('total-km').textContent    = `${km.toFixed(0)} km`;
    document.getElementById('total-rides').textContent = rides;
    document.getElementById('total-hours').textContent = `${hours.toFixed(1)}h`;
    document.getElementById('avg-hour').textContent    = `R$ ${avgHour}/h`;

    const sorted = [...filteredRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    document.getElementById('records-list').innerHTML = sorted.map(record => {
        const net = parseFloat(record.gross) - parseFloat(record.expenses);
        return `
            <div class="record-item">
                <div class="record-info">
                    <div class="record-date">${formatDate(record.date)}</div>
                    <div class="record-stats">${record.rides} corridas • ${record.km} km • ${record.hours}h</div>
                    <div class="record-net">Lucro: ${formatCurrency(net)}</div>
                </div>
                <button class="btn btn-danger btn-small" onclick="deleteRecordByData('${record.date}')" title="Deletar">🗑️</button>
            </div>`;
    }).join('');
}
