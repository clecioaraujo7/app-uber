// Uber Tracker - JavaScript
// Dados do app
let profiles = {};
let activeProfile = null;
let currentFilter = 'all';

// Cores para avatares
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

// Inicialização
function init() {
    loadData();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('record-date').value = today;
    updateProfileScreen();
    if (activeProfile) {
        selectProfile(activeProfile);
    }
}

// localStorage

function loadData() {
    const data = localStorage.getItem('uber_profiles');
    if (data) {
        profiles = JSON.parse(data);
// console.log('Registros carregados do localStorage:', profiles);
        if (activeProfile && profiles[activeProfile]) {
// console.log('Registros do perfil ativo:', profiles[activeProfile].records);
        }
    }
}


function saveData() {
    localStorage.setItem('uber_profiles', JSON.stringify(profiles));
}

// Perfis
function createProfile() {
    const name = prompt('Nome ou apelido do perfil:');
    if (!name || name.trim() === '') return;

    const id = Date.now().toString();
    const color = colors[Math.floor(Math.random() * colors.length)];
    profiles[id] = {
        name: name.trim(),
        color: color,
        records: []
    };
    activeProfile = id;
    saveData();
    updateProfileScreen();
    selectProfile(id);
}

function updateProfileScreen() {
    const grid = document.getElementById('profiles-grid');
    grid.innerHTML = '';

    Object.entries(profiles).forEach(([id, profile]) => {
        const count = profile.records.length;
        const div = document.createElement('div');
        div.className = `profile-card ${activeProfile === id ? 'active' : ''}`;
        div.onclick = () => selectProfile(id);
        div.innerHTML = `
            <div class="avatar" style="background: ${profile.color}">${getInitials(profile.name)}</div>
            <h3 style="margin: 12px 0 8px 0; font-size: 20px;">${profile.name}</h3>
            <p style="color: var(--text-secondary); font-size: 14px;">${count} registro${count !== 1 ? 's' : ''}</p>
        `;
        grid.appendChild(div);
    });
}

function selectProfile(id) {
    activeProfile = id;
    currentFilter = 'all'; 
    filtrar('todos'); 
    saveData();
    
    const profile = profiles[id];
    document.getElementById('current-avatar').style.background = profile.color;
    document.getElementById('current-avatar').textContent = getInitials(profile.name);
    document.getElementById('current-profile-name').textContent = profile.name;
    document.getElementById('current-profile-records').textContent = `${profile.records.length} registro${profile.records.length !== 1 ? 's' : ''}`;

    document.getElementById('profile-select-screen').classList.remove('active');
    document.getElementById('dashboard-screen').classList.add('active');

    updateDashboard();
}

function switchProfile() {
    document.getElementById('dashboard-screen').classList.remove('active');
    document.getElementById('profile-select-screen').classList.add('active');
    updateProfileScreen();
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
}

// Dashboard

function updateTodayCard() {
    if (!activeProfile) return;

    const profile = profiles[activeProfile];
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = profile.records.find(r => r.date === today);

    const noTodayEl = document.getElementById('no-today');
    const todayStatsEl = document.getElementById('today-stats');

    if (todayRecord) {
        noTodayEl.style.display = 'none';
        todayStatsEl.style.display = 'block';
        
        document.getElementById('today-gross').textContent = formatCurrency(parseFloat(todayRecord.gross || 0));
        document.getElementById('today-km').textContent = `${parseFloat(todayRecord.km || 0).toFixed(0)} km`;
        document.getElementById('today-rides').textContent = parseInt(todayRecord.rides || 0);
        document.getElementById('today-hours').textContent = `${parseFloat(todayRecord.hours || 0).toFixed(1)}h`;
        document.getElementById('today-net').textContent = formatCurrency(parseFloat(todayRecord.gross || 0) - parseFloat(todayRecord.expenses || 0));
    } else {
        todayStatsEl.style.display = 'none';
        noTodayEl.style.display = 'block';
    }
}

function updateCharts() {
    if (!activeProfile) return;

    const profile = profiles[activeProfile];
    const records = profile.records.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Gráfico linha 30 dias
    updateLineChart(records);
    // Gráfico barras semanas
    updateBarChart(records);
}

function updateLineChart(records) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thirtyDaysData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayRecord = records.find(r => r.date === dateStr);
        thirtyDaysData.push(dayRecord ? parseFloat(dayRecord.gross || 0) : 0);
    }

    if (window.lineChartInstance) {
        window.lineChartInstance.destroy();
    }

    window.lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 30}, (_, i) => {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                return date.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short'});
            }),
            datasets: [{
                label: 'Faturamento (R$)',
                data: thirtyDaysData,
                borderColor: '#00D4FF',
                backgroundColor: 'rgba(0,212,255,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00D4FF',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: '#1e3a5f' },
                    ticks: { color: '#5a8ab0', maxRotation: 45 }
                },
                y: {
                    grid: { color: '#1e3a5f' },
                    ticks: { 
                        color: '#5a8ab0',
                        callback: function(value) { 
                            return 'R$ ' + value.toLocaleString('pt-BR'); 
                        }
                    }
                }
            }
        }
    });
}

function updateBarChart(records) {
    const ctx = document.getElementById('barChart').getContext('2d');
    const now = new Date();
    const weeksData = [];
    const weekLabels = [];

    for (let i = 5; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i * 7 + (now.getDay() || 7)) * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        const weekRecords = records.filter(r => {
            const recordDate = new Date(r.date);
            return recordDate >= weekStart && recordDate <= weekEnd;
        });
        
        const weekGross = weekRecords.reduce((sum, r) => sum + parseFloat(r.gross || 0), 0);
        weeksData.push(weekGross);
        weekLabels.push(`Sem ${i + 1}`);
    }

    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }

    window.barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekLabels,
            datasets: [{
                label: 'Faturamento Semanal (R$)',
                data: weeksData,
                backgroundColor: '#0066FF',
                borderColor: '#00D4FF',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#5a8ab0' }
                },
                y: {
                    grid: { color: '#1e3a5f' },
                    ticks: { 
                        color: '#5a8ab0',
                        callback: function(value) { 
                            return 'R$ ' + value.toLocaleString('pt-BR'); 
                        }
                    }
                }
            }
        }
    });
}

function updateDashboard() {
    updateTodayCard();
    updateCharts();
    
    if (!activeProfile) return;

    const profile = profiles[activeProfile];
    const allRecords = profile.records;
    const records = filterRecords(allRecords, currentFilter);

    if (records.length === 0) {
        document.getElementById('stats-grid').style.display = 'none';
        const list = document.getElementById('records-list');
        list.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><h3>Nenhum registro no período</h3><p>Tente outro filtro ou adicione registros.</p></div>';
        return;
    }

    document.getElementById('stats-grid').style.display = 'grid';

    // Totais do período filtrado
    const totalGross = records.reduce((sum, r) => sum + parseFloat(r.gross || 0), 0);
    const totalExpenses = records.reduce((sum, r) => sum + parseFloat(r.expenses || 0), 0);
    const totalNet = totalGross - totalExpenses;
    const totalKm = records.reduce((sum, r) => sum + parseFloat(r.km || 0), 0);
    const totalRides = records.reduce((sum, r) => sum + parseInt(r.rides || 0), 0);
    const totalHours = records.reduce((sum, r) => sum + parseFloat(r.hours || 0), 0);

    const avgHour = totalHours > 0 ? (totalGross / totalHours).toFixed(2) : 0;


    document.getElementById('total-gross').textContent = formatCurrency(totalGross);
    document.getElementById('total-net').textContent = formatCurrency(totalNet);
    document.getElementById('total-km').textContent = `${totalKm.toFixed(0)} km`;
    document.getElementById('total-rides').textContent = totalRides;
    document.getElementById('total-hours').textContent = `${totalHours.toFixed(1)}h`;
    document.getElementById('avg-hour').textContent = `R$ ${avgHour}/h`;

    // Lista de registros filtrados
    const list = document.getElementById('records-list');
    list.innerHTML = '';

    // Ordenar por data recente
    const sorted = [...records].sort((a,b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((record, index) => {
        const net = parseFloat(record.gross) - parseFloat(record.expenses);
        const div = document.createElement('div');
        div.className = 'record-item';
        div.innerHTML = `
            <div class="record-info">
                <div class="record-date">${formatDate(record.date)}</div>
                <div class="record-stats">
                    ${record.rides} corridas • ${record.km} km • ${record.hours}h
                </div>
                <div class="record-net">Lucro: ${formatCurrency(net)}</div>
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteRecordByData('${record.date}')" title="Deletar">🗑️</button>
        `;
        list.appendChild(div);
    });
}




function filterRecords(records, filter) {
    console.log('Filtrando com:', { filter, dateFilter });
    
    const now = new Date();
    return records.filter(record => {
        const recordDate = new Date(record.date + 'T12:00:00'); // Normaliza para meio-dia
        console.log('Comparando registro:', record.date, recordDate);
        
        switch (filter) {
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return recordDate >= weekAgo;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return recordDate >= monthAgo;
            case 'custom':
                if (!dateFilter.from && !dateFilter.to) {
                    console.log('Filtro custom sem datas - mostrando todos');
                    return true;
                }
                const fromDate = dateFilter.from ? new Date(dateFilter.from + 'T00:00:00') : new Date(0);
                const toDate = dateFilter.to ? new Date(dateFilter.to + 'T23:59:59') : new Date();
                const isInRange = recordDate >= fromDate && recordDate <= toDate;
                console.log('Filtro custom resultado:', isInRange, { recordDate, fromDate, toDate });
                return isInRange;
            default:
                return true;
        }
    });
}



// Registro
function showRegisterModal() {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('register-modal').classList.add('active');
}

function hideRegisterModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('register-modal').classList.remove('active');
}


function saveRecord() {
    const record = {
        date: document.getElementById('record-date').value,
        gross: parseFloat(document.getElementById('record-gross').value) || 0,
        expenses: parseFloat(document.getElementById('record-expenses').value) || 0,
        km: parseFloat(document.getElementById('record-km').value) || 0,
        rides: parseInt(document.getElementById('record-rides').value) || 0,
        hours: parseFloat(document.getElementById('record-hours').value) || 0
    };

// console.log('Salvando registro:', record);
    
    if (!activeProfile) {
        alert('Selecione um perfil primeiro!');
        return;
    }

    profiles[activeProfile].records.unshift(record); 
// console.log('Total de registros:', profiles[activeProfile].records.length);
// console.log('Perfil ativo:', profiles[activeProfile]);
    
    saveData();
    updateDashboard();
    hideRegisterModal();
    // Reset form values
    const formInputs = document.querySelectorAll('#register-modal input');
    formInputs.forEach(input => input.value = input.id === 'record-date' ? new Date().toISOString().split('T')[0] : '');
}


// setFilter depreciada - novos botões usam filtrar()


function deleteRecordByData(dateStr) {
    if (confirm('Deletar este registro?')) {
        if (activeProfile) {
            profiles[activeProfile].records = profiles[activeProfile].records.filter(r => r.date !== dateStr);
            saveData();
            updateDashboard();
        }
    }
}

function clearForm() {
    // Form clear handled in saveRecord
}

// Utils
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Função filtrar para novos botões

function filtrar(tipo) {
  document.getElementById('btn-todos').style.background = tipo === 'todos' ? '#00d4ff' : 'transparent';
  document.getElementById('btn-todos').style.color = tipo === 'todos' ? '#050d1a' : '#5a8ab0';
  document.getElementById('btn-semana').style.background = tipo === 'semana' ? '#00d4ff' : 'transparent';
  document.getElementById('btn-semana').style.color = tipo === 'semana' ? '#050d1a' : '#5a8ab0';
  document.getElementById('btn-mes').style.background = tipo === 'mes' ? '#00d4ff' : 'transparent';
  document.getElementById('btn-mes').style.color = tipo === 'mes' ? '#050d1a' : '#5a8ab0';
  document.getElementById('btn-calendar').style.background = 'transparent';
  document.getElementById('btn-calendar').style.color = '#5a8ab0';
  
  // Atualiza filtro global
  if (tipo === 'todos') currentFilter = 'all';
  else if (tipo === 'semana') currentFilter = 'week';
  else if (tipo === 'mes') currentFilter = 'month';
  updateDashboard();
}

// Filtro Calendário
let dateFilter = { from: null, to: null };


function toggleDateModal() {
  const modal = document.getElementById('date-filter-modal');
  const overlay = document.getElementById('date-filter-overlay');
  if (modal.style.display === 'block') {
    hideDateModal();
  } else {
    showDateModal();
  }
}



function showDateModal() {
  console.log('Abrindo modal calendário');
  document.getElementById('date-filter-overlay').style.display = 'block';
  document.getElementById('date-filter-overlay').classList.add('active');
  document.getElementById('date-filter-modal').style.display = 'block';
  document.getElementById('date-filter-modal').classList.add('active');
  document.getElementById('date-from').value = dateFilter.from || '';
  document.getElementById('date-to').value = dateFilter.to || '';
}



function hideDateModal() {
  console.log('Fechando modal calendário');
  document.getElementById('date-filter-overlay').style.display = 'none';
  document.getElementById('date-filter-overlay').classList.remove('active');
  document.getElementById('date-filter-modal').style.display = 'none';
  document.getElementById('date-filter-modal').classList.remove('active');
}



function applyDateFilter() {
  console.log('Aplicando filtro datas:', {
    from: document.getElementById('date-from').value,
    to: document.getElementById('date-to').value
  });
  
  dateFilter.from = document.getElementById('date-from').value;
  dateFilter.to = document.getElementById('date-to').value;
  
  currentFilter = 'custom';
  document.getElementById('btn-calendar').style.background = '#00d4ff';
  document.getElementById('btn-calendar').style.color = '#050d1a';
  
  updateDashboard();
  hideDateModal();
}


function clearDateFilter() {
  dateFilter.from = null;
  dateFilter.to = null;
  currentFilter = 'all';
  filtrar('todos');
}


// Event listeners
document.addEventListener('DOMContentLoaded', init);

