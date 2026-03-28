// === CHARTS ===
function updateCharts(filteredRecords) {
    if (!activeProfile) return;
    updateLineChart(filteredRecords);
    updateBarChart(filteredRecords);
}

function destroyChart(instanceKey) {
    if (window[instanceKey]) {
        window[instanceKey].destroy();
        window[instanceKey] = null;
    }
}

function buildYScale() {
    return {
        grid:  { color: CHART_COLORS.grid },
        ticks: {
            color:    CHART_COLORS.text,
            callback: value => 'R$ ' + value.toLocaleString('pt-BR'),
        },
    };
}

function updateLineChart(filteredRecords) {
    const now    = new Date();
    const labels = [];
    const data   = [];

    for (let i = 29; i >= 0; i--) {
        const date    = new Date(now - i * MS_PER_DAY);
        const dateStr = toLocalDateStr(date);
        const record  = filteredRecords.find(r => r.date === dateStr);
        labels.push(date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }));
        data.push(record ? parseFloat(record.gross || 0) : 0);
    }

    document.querySelector('.chart-card h3').textContent = `📈 ${getFilterTitle()}`;

    destroyChart('lineChartInstance');
    window.lineChartInstance = new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label:                'Faturamento (R$)',
                data,
                borderColor:          CHART_COLORS.primary,
                backgroundColor:      'rgba(0,212,255,0.1)',
                tension:              0.4,
                fill:                 true,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor:     '#ffffff',
                pointBorderWidth:     2,
                pointRadius:          4,
                pointHoverRadius:     6,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid:  { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.text, maxRotation: 45 },
                },
                y: buildYScale(),
            },
        },
    });
}

function updateBarChart(filteredRecords) {
    const now    = new Date();
    const labels = [];
    const data   = [];

    for (let i = 5; i >= 0; i--) {
        const weekStart = new Date(now - (i * 7 + (now.getDay() || 7)) * MS_PER_DAY);
        const weekEnd   = new Date(weekStart.getTime() + 6 * MS_PER_DAY);

        const weekGross = filteredRecords
            .filter(r => { const d = new Date(r.date + 'T12:00:00'); return d >= weekStart && d <= weekEnd; })
            .reduce((sum, r) => sum + parseFloat(r.gross || 0), 0);

        labels.push(`Sem ${6 - i}`);
        data.push(weekGross);
    }

    document.querySelector('.chart-card:nth-child(2) h3').textContent = `📊 ${getFilterTitle()}`;

    destroyChart('barChartInstance');
    window.barChartInstance = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label:           'Faturamento Semanal (R$)',
                data,
                backgroundColor: CHART_COLORS.secondary,
                borderColor:     CHART_COLORS.primary,
                borderWidth:     2,
                borderRadius:    8,
                borderSkipped:   false,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid:  { display: false },
                    ticks: { color: CHART_COLORS.text },
                },
                y: buildYScale(),
            },
        },
    });
}
