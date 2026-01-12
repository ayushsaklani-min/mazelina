// MazeStepper Multiplayer - Frontend

const WALLS = [[1,1], [1,2], [2,1], [3,3]];
const GOAL = [4, 4];
const GRID_SIZE = 5;

let gameState = {
    players: [],
    positions: {},
    current_turn: 0,
    total_moves: 0,
    winner: null
};

let myPlayerId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMaze();
    setupEventListeners();
    initializeGame();
});

function initializeMaze() {
    const grid = document.getElementById('maze-grid');
    grid.innerHTML = '';
    
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Mark walls
            if (isWall(x, y)) {
                cell.classList.add('wall');
                cell.textContent = '🧱';
            }
            
            // Mark goal
            if (x === GOAL[0] && y === GOAL[1]) {
                cell.classList.add('goal');
                cell.textContent = '🏁';
            }
            
            grid.appendChild(cell);
        }
    }
}

function isWall(x, y) {
    return WALLS.some(([wx, wy]) => wx === x && wy === y);
}

function setupEventListeners() {
    document.getElementById('join-btn').addEventListener('click', joinGame);
    document.getElementById('refresh-btn').addEventListener('click', refreshState);
    
    // Movement controls
    ['up', 'down', 'left', 'right'].forEach(dir => {
        document.getElementById(`btn-${dir}`).addEventListener('click', () => {
            const direction = dir.charAt(0).toUpperCase() + dir.slice(1);
            movePlayer(direction);
        });
    });
}

function initializeGame() {
    // Start with empty game
    updateUI();
}

function joinGame() {
    // Generate player ID if not exists
    if (!myPlayerId) {
        myPlayerId = `0x${Math.random().toString(16).slice(2, 66)}`;
    }
    
    // Check if already joined
    if (gameState.players.includes(myPlayerId)) {
        alert('You have already joined the game!');
        return;
    }
    
    // Add player
    gameState.players.push(myPlayerId);
    gameState.positions[myPlayerId] = [0, 0];
    
    updateUI();
    alert('✅ Successfully joined the game!');
}

function movePlayer(direction) {
    // Validate game state
    if (gameState.players.length === 0) {
        alert('❌ No players in game! Click "Join Game" first.');
        return;
    }
    
    if (gameState.winner) {
        alert('🏆 Game is over! Player ' + (gameState.players.indexOf(gameState.winner) + 1) + ' won!');
        return;
    }
    
    // Get current player
    const currentPlayerIdx = gameState.current_turn % gameState.players.length;
    const currentPlayer = gameState.players[currentPlayerIdx];
    
    // Check if it's your turn
    if (currentPlayer !== myPlayerId) {
        alert('❌ Not your turn! Wait for Player ' + (currentPlayerIdx + 1));
        return;
    }
    
    // Get current position
    const [x, y] = gameState.positions[currentPlayer];
    let [nx, ny] = [x, y];
    
    // Calculate new position
    switch(direction) {
        case 'Up': 
            if (y > 0) ny--; 
            break;
        case 'Down': 
            if (y < 4) ny++; 
            break;
        case 'Left': 
            if (x > 0) nx--; 
            break;
        case 'Right': 
            if (x < 4) nx++; 
            break;
    }
    
    // Check if moved
    if (nx === x && ny === y) {
        alert('❌ Cannot move out of bounds!');
        return;
    }
    
    // Check wall collision
    if (isWall(nx, ny)) {
        alert('❌ Cannot move into a wall!');
        return;
    }
    
    // Valid move - update position
    gameState.positions[currentPlayer] = [nx, ny];
    gameState.total_moves++;
    
    // Check win condition
    if (nx === GOAL[0] && ny === GOAL[1]) {
        gameState.winner = currentPlayer;
        updateUI();
        setTimeout(() => {
            alert('🏆 Congratulations! You won the game!');
        }, 100);
        return;
    }
    
    // Next turn
    gameState.current_turn++;
    updateUI();
}

function refreshState() {
    updateUI();
}

function updateUI() {
    // Update stats
    document.getElementById('total-moves').textContent = gameState.total_moves;
    document.getElementById('player-count').textContent = gameState.players.length;
    
    // Update player list
    updatePlayerList();
    
    // Update current turn
    updateCurrentTurn();
    
    // Update maze
    updateMaze();
    
    // Update winner
    updateWinner();
    
    // Update controls
    updateControls();
}

function updatePlayerList() {
    const list = document.getElementById('player-list');
    
    if (gameState.players.length === 0) {
        list.innerHTML = '<p class="empty-state">No players yet</p>';
        return;
    }
    
    list.innerHTML = '';
    gameState.players.forEach((player, idx) => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.style.borderLeftColor = getPlayerColor(idx);
        
        const currentPlayerIdx = gameState.current_turn % gameState.players.length;
        if (idx === currentPlayerIdx && !gameState.winner) {
            item.classList.add('active');
        }
        
        const isMe = player === myPlayerId;
        const shortAddr = player.slice(0, 8) + '...' + player.slice(-6);
        item.textContent = `P${idx + 1}: ${shortAddr}${isMe ? ' (You)' : ''}`;
        
        list.appendChild(item);
    });
}

function updateCurrentTurn() {
    const turnDiv = document.getElementById('current-turn');
    
    if (gameState.players.length === 0) {
        turnDiv.textContent = 'Waiting for players...';
        return;
    }
    
    if (gameState.winner) {
        turnDiv.textContent = 'Game Over';
        return;
    }
    
    const currentPlayerIdx = gameState.current_turn % gameState.players.length;
    const currentPlayer = gameState.players[currentPlayerIdx];
    const isMyTurn = currentPlayer === myPlayerId;
    const shortAddr = currentPlayer.slice(0, 8) + '...' + currentPlayer.slice(-6);
    
    turnDiv.textContent = `Player ${currentPlayerIdx + 1}: ${shortAddr}${isMyTurn ? ' (Your Turn!)' : ''}`;
    turnDiv.style.color = isMyTurn ? '#00f5ff' : '#fff';
}

function updateMaze() {
    // Clear all player markers
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('player', 'player-color-0', 'player-color-1', 'player-color-2', 'player-color-3');
        if (!cell.classList.contains('wall') && !cell.classList.contains('goal')) {
            cell.textContent = '';
        }
    });
    
    // Place players
    gameState.players.forEach((player, idx) => {
        const pos = gameState.positions[player];
        if (!pos) return;
        
        const [x, y] = pos;
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add('player', `player-color-${idx % 4}`);
            cell.textContent = `P${idx + 1}`;
        }
    });
}

function updateWinner() {
    const banner = document.getElementById('winner-banner');
    const text = document.getElementById('winner-text');
    
    if (gameState.winner) {
        const winnerIdx = gameState.players.indexOf(gameState.winner);
        const isMe = gameState.winner === myPlayerId;
        const shortAddr = gameState.winner.slice(0, 8) + '...' + gameState.winner.slice(-6);
        text.textContent = `Player ${winnerIdx + 1} (${shortAddr})${isMe ? ' - YOU' : ''}`;
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

function updateControls() {
    const buttons = document.querySelectorAll('.btn-control');
    const isMyTurn = checkIfMyTurn();
    const gameOver = gameState.winner !== null;
    
    buttons.forEach(btn => {
        btn.disabled = !isMyTurn || gameOver;
    });
}

function checkIfMyTurn() {
    if (gameState.players.length === 0) return false;
    if (!myPlayerId) return false;
    if (gameState.winner) return false;
    
    const currentPlayerIdx = gameState.current_turn % gameState.players.length;
    const currentPlayer = gameState.players[currentPlayerIdx];
    
    return currentPlayer === myPlayerId;
}

function getPlayerColor(idx) {
    const colors = ['#00f5ff', '#ff00ff', '#ffff00', '#ff8800'];
    return colors[idx % colors.length];
}
