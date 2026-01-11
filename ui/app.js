// MazeStepper Multiplayer - Frontend
// This is a mock adapter for demonstration. In production, integrate with Linera CLI or RPC.

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

let appId = '';
let ownerAddress = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMaze();
    setupEventListeners();
    loadConfig();
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
    
    // Config inputs
    document.getElementById('app-id').addEventListener('change', saveConfig);
    document.getElementById('owner-address').addEventListener('change', saveConfig);
}

function loadConfig() {
    appId = localStorage.getItem('appId') || '';
    ownerAddress = localStorage.getItem('ownerAddress') || '';
    
    document.getElementById('app-id').value = appId;
    document.getElementById('owner-address').value = ownerAddress;
}

function saveConfig() {
    appId = document.getElementById('app-id').value;
    ownerAddress = document.getElementById('owner-address').value;
    
    localStorage.setItem('appId', appId);
    localStorage.setItem('ownerAddress', ownerAddress);
}

async function joinGame() {
    if (!appId || !ownerAddress) {
        alert('Please configure Application ID and Owner Address first!');
        return;
    }
    
    try {
        // Mock: In production, execute: linera service --operation Join
        console.log('Executing: Join operation');
        
        // Simulate CLI call
        await mockCliCall('operation', { type: 'Join' });
        
        alert('Join request sent! Refresh to see updated state.');
    } catch (error) {
        alert('Error joining game: ' + error.message);
    }
}

async function movePlayer(direction) {
    if (!appId || !ownerAddress) {
        alert('Please configure Application ID and Owner Address first!');
        return;
    }
    
    try {
        console.log(`Executing: Move ${direction}`);
        
        // Mock: In production, execute: linera service --operation Move(direction)
        await mockCliCall('operation', { type: 'Move', direction });
        
        // Auto-refresh after move
        setTimeout(refreshState, 500);
    } catch (error) {
        alert('Error moving: ' + error.message);
    }
}

async function refreshState() {
    try {
        console.log('Querying game state...');
        
        // Mock: In production, execute: linera query-application
        const state = await mockCliCall('query', { type: 'GameState' });
        
        gameState = state;
        updateUI();
    } catch (error) {
        console.error('Error refreshing state:', error);
    }
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
        
        const shortAddr = player.slice(0, 8) + '...' + player.slice(-6);
        item.textContent = `P${idx + 1}: ${shortAddr}`;
        
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
    const shortAddr = currentPlayer.slice(0, 8) + '...' + currentPlayer.slice(-6);
    
    turnDiv.textContent = `Player ${currentPlayerIdx + 1}: ${shortAddr}`;
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
        const shortAddr = gameState.winner.slice(0, 8) + '...' + gameState.winner.slice(-6);
        text.textContent = `Player ${winnerIdx + 1} (${shortAddr})`;
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
    if (!ownerAddress) return false;
    
    const currentPlayerIdx = gameState.current_turn % gameState.players.length;
    const currentPlayer = gameState.players[currentPlayerIdx];
    
    return currentPlayer === ownerAddress;
}

function getPlayerColor(idx) {
    const colors = ['#00f5ff', '#ff00ff', '#ffff00', '#ff8800'];
    return colors[idx % colors.length];
}

// Mock CLI adapter - Replace with actual Linera CLI integration
async function mockCliCall(type, params) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (type === 'query') {
        // Return mock state or fetch from actual chain
        return gameState;
    }
    
    if (type === 'operation') {
        // In production: Execute linera CLI command
        // Example: linera service --operation '{"Move": "Up"}'
        console.log('Mock operation:', params);
        return { success: true };
    }
}

// Auto-refresh every 3 seconds
setInterval(refreshState, 3000);
