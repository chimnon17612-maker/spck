

async function openGame(gameId) {
    console.log('Open Detail: ', gameId);
    const results = await fetch(`https://www.freetogame.com/api/game?id=${gameId}`);
    const game = await results.json();
    console.log('game = ', JSON.stringify(game))
    const detailContainer = document.getElementById('game-details');

    detailContainer.innerHTML = `
        <div class="detail-header">
            <img src="${game.thumbnail}" style="border-radius:10px width:120px">
            <div>
                <h2>${game.title}</h2>
                <span class="tag">${game.genre}</span>
            </div>
        </div>
        <div class="info-grid">
            <p><strong>Thể loại:</strong> ${game.genre}</p>
            <p><strong>Ngày phát hành:</strong> ${game.release_date}</p>
        </div>
        <hr style="border: 0.1px solid #444; margin: 20px 0;">
        <h3>Mô tả game</h3>
        <p style="line-height: 1.6; color: #ccc;">${game.description}</p>
        <button style="background: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">Tải Ngay</button>
    `;

    document.getElementById('gameModal').style.display = "block";
}

function closeModal() {
    document.getElementById('gameModal').style.display = "none";
}

window.onclick = function(event) {
    const modal1 = document.getElementById('gameModal');
    const modal2 = document.getElementById('game-modal');

    if (modal1) modal1.style.display = "none";
    if (modal2) modal2.style.display = "none";
}
