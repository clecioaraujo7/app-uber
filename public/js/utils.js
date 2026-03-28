// === UTILS ===
const toLocalDateStr = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const getTodayStr    = () => toLocalDateStr(new Date());

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString + 'T12:00:00').toLocaleDateString('pt-BR');
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function randomColor() {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function calcStats(records) {
    return records.reduce((acc, r) => ({
        gross:    acc.gross    + parseFloat(r.gross    || 0),
        expenses: acc.expenses + parseFloat(r.expenses || 0),
        km:       acc.km       + parseFloat(r.km       || 0),
        rides:    acc.rides    + parseInt(r.rides       || 0),
        hours:    acc.hours    + parseFloat(r.hours    || 0),
    }), { gross: 0, expenses: 0, km: 0, rides: 0, hours: 0 });
}
