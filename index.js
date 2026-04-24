// const API_KEY = '81516e86480c441c9676e1082c66847d';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let authMode = 'login';

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchGames();
    toggleAuthTab('login');
});

async function fetchGames() {
    try {
        const hotRes = await fetch(`https://www.freetogame.com/api/games`);
        console.log('hotRes: ', hotRes)
        
        const hotData = await hotRes.json();
        console.log('hotData: ', hotData)
        renderGames(hotData, 'game-list');
        // const topRes = await fetch(`https://www.freetogame.com/api/games`);
        // const topData = await topRes.json();
        // renderRanking(topData.results);
        // if(hotData.results && hotData.results[0]) updateHero(hotData.results[0]);
    } catch (err) { console.error(err); }
}

function updateHero(game) {
    document.getElementById('hero-title').innerText = game.name;
    document.getElementById('hero-btn').onclick = () => fetchGameDetail(game.id, 60);
    if(game.clip) document.getElementById('hero-video').src = game.clip.clips['640'];
}

function renderGames(games, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = games.map(game => {
        const price = Math.floor(game.rating * 10) + 5;
        return `
        <div class="game-card rounded-lg overflow-hidden shadow-lg" onclick="openGame(${game.id})">
            <img src="${game.thumbnail}" class="w-full h-48 object-cover">
            <div class="p-5">
                <h3 class="font-bold text-white truncate mb-4 uppercase text-sm">${game.title}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-xs bg-[#4c6b22] px-2 py-1 rounded text-[#beee11] font-bold">-${Math.floor(Math.random()*50)+10}%</span>
                    <span class="text-green-400 font-black text-lg">MUA NGAY</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderRanking(games) {
    const container = document.getElementById(ranking-list);
    container.innerHTML = games.map((game, index) => `
        <div class="flex items-center gap-4 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all" onclick="fetchGameDetail(${game.id}, 50)">
            <span class="text-3xl font-black italic text-gray-700">#${index + 1}</span>
            <img src="${game.background_image}" class="w-12 h-12 object-cover rounded shadow-md">
            <div class="overflow-hidden">
                <p class="text-[10px] font-bold text-white truncate uppercase">${game.name}</p>
                <p class="text-[10px] text-blue-400 mt-1">⭐ ${game.rating}</p>
            </div>
        </div>
    `).join('');
}

async function fetchGameDetail(id, price) {
    const res = await fetch(`https://api.rawg.io{id}?key=${API_KEY}`);
    const game = await res.json();
    document.getElementById('modal-content').innerHTML = `
        <div class="relative h-64"><img src="${game.background_image}" class="w-full h-full object-cover"></div>
        <div class="p-8">
            <h2 class="text-3xl font-black text-white mb-2 italic uppercase">${game.name}</h2>
            <p class="text-gray-400 text-xs mb-6 line-clamp-3">${game.description_raw}</p>
            <div class="grid grid-cols-2 gap-4 mb-8 text-xs text-center uppercase font-bold">
                <div class="bg-black/40 p-3 rounded border border-gray-700 text-blue-400">📥 ${game.added.toLocaleString()} Lượt tải</div>
                <div class="bg-black/40 p-3 rounded border border-gray-700 text-yellow-400">⭐ ${game.rating} / 5</div>
            </div>
            <button onclick="buyGame('${game.name}', ${price})" class="w-full btn-steam py-4 rounded-lg text-white font-black text-xl shadow-2xl uppercase tracking-widest">MUA NGAY</button>
        </div>`;
    document.getElementById('game-modal').classList.remove('hidden');
}

function showLogin() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }
function closeModal() { document.getElementById('game-modal').classList.add('hidden'); }

function toggleAuthTab(mode) {
    authMode = mode;
    const isL = mode === 'login';
    document.getElementById('tab-login').className = isL ? "flex-1 py-4 font-black text-blue-500 border-b-2 border-blue-500 bg-blue-500/10" : "flex-1 py-4 font-black text-gray-500";
    document.getElementById('tab-register').className = !isL ? "flex-1 py-4 font-black text-blue-500 border-b-2 border-blue-500 bg-blue-500/10" : "flex-1 py-4 font-black text-gray-500";
}

function handleAuth() {
    const u = document.getElementById('auth-user').value.trim();
    const p = document.getElementById('auth-pass').value.trim();
    if (!u || !p) return alert("Vui lòng điền đủ thông tin!");
    let users = JSON.parse(localStorage.getItem('pixel_users')) || [];
    if (authMode === 'register') {
        if (users.find(x => x.username === u)) return alert("Tài khoản đã tồn tại!");
        users.push({ username: u, password: p, balance: 100, library: [] });
        localStorage.setItem('pixel_users', JSON.stringify(users));
        alert("Đăng ký thành công! Bạn nhận được 100$.");
        toggleAuthTab('login');
    } else {
        const user = users.find(x => x.username === u && x.password === p);
        if (user) { 
            localStorage.setItem('currentUser', JSON.stringify(user)); 
            location.reload(); 
        } else alert("Sai thông tin đăng nhập!");
    }
}

function logout() { localStorage.removeItem('currentUser'); location.reload(); }

function updateUI() {
    if (currentUser) {
        document.getElementById('auth-section').innerHTML = `<div class="text-right leading-none"><p class="text-blue-400 font-bold text-[10px] uppercase mb-1">${currentUser.username}</p><button onclick="logout()" class="text-[9px] text-gray-500 hover:underline">Thoát</button></div>`;
        document.getElementById('wallet-area').classList.remove('hidden');
        document.getElementById('user-balance').innerText = `${currentUser.balance}$`;
    }
}

function depositMoney() {
    if (!currentUser) return;
    currentUser.balance += 50;
    saveUserData(currentUser);
    updateUI();
}

function buyGame(n, p) {
    if (!currentUser) return showLogin();
    if (currentUser.balance < p) return alert("Không đủ tiền!");
    currentUser.balance -= p;
    currentUser.library.push(n);
    saveUserData(currentUser);
    updateUI();
    alert(`Đã sở hữu: ${n}`);
    closeModal();
}

function saveUserData(u) {
    let us = JSON.parse(localStorage.getItem('pixel_users')) || [];
    const i = us.findIndex(x => x.username === u.username);
    if (i !== -1) us[i] = u;
    localStorage.setItem('pixel_users', JSON.stringify(us));
    localStorage.setItem('currentUser', JSON.stringify(u));
}

function ShowLogout(){
    window.location.href="./login.html"
}

