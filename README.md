# 🚀 Uber Tracker - Gerenciador Financeiro para Motoristas Uber

## 📱 O que é?
App **mobile-first** completo em **um único arquivo HTML** para motoristas Uber registrarem dias de trabalho, calcular **lucro líquido** e acompanhar métricas (km, corridas, horas, média/hora). 

**Recursos:**
- ✅ Múltiplos perfis (cada motorista tem dados separados)
- ✅ Registro completo: data, faturamento, gastos, km, corridas, horas
- ✅ Dashboard com 6 cards: bruto/líquido/km/corridas/horas/média/h
- ✅ Lista registros recentes com delete (confirm)
- ✅ **100% offline** - localStorage por perfil
- ✅ Design dark moderno, responsivo, animações suaves
- ✅ Data padrão = hoje, validações, reset form

## 🎮 Como Usar
1. **Abra `index.html` no browser**
2. **Crie perfil** → \"➕ Criar Novo Perfil\" (ex: \"João\")
3. **Dashboard**:
   - Cards totais atualizam real-time
   - \"➕ Registrar Dia\" → preencha → Salva!
4. **Botão perfil** (top-right) para trocar
5. **Delete**: 🗑️ confirma antes apagar
6. **Recarregue**: Dados mantidos!

**Teste rápido:**
```
R$200 bruto, R$50 gastos → Líquido R$150
50km, 10 corridas, 4h → Média R$37.50/h
```

## ☁️ Deploy GitHub Pages (5 min)
1. Crie repo GitHub: `uber-tracker`
2. `git init && git add . && git commit -m \"Initial: Uber Tracker completo\"`
3. `git remote add origin https://github.com/SEU_USERNAME/uber-tracker.git`
4. `git push -u origin main`
5. Settings → Pages → Source: Deploy from branch `main` → `/ (root)`
6. **Live**: `https://SEU_USERNAME.github.io/uber-tracker`

## 🔧 Tech
- Vanilla HTML/CSS/JS
- localStorage persistência
- Inter font (Google)
- Mobile-first, PWA-ready
- ~500 linhas, zero deps

**Feito com ❤️ por BLACKBOXAI**

![Demo](https://via.placeholder.com/400x800/0f0f0f/ffffff?text=Uber+Tracker+Demo)

