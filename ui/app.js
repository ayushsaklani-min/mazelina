// MazeStepper Multiplayer - Premium Frontend

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
    initializeParticles();
    initializeMaze();
    setupEventListeners();
    initializeGame();
    addEntranceAnimations();
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
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'ArrowUp': 'Up',
            'ArrowDown': 'Down',
            'ArrowLeft': 'Left',
            'ArrowRight': 'Right',
            'w': 'Up',
            'W': 'Up',
            's': 'Down',
            'S': 'Down',
            'a': 'Left',
            'A': 'Left',
            'd': 'Right',
            'D': 'Right'
        };
        
        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            movePlayer(direction);
            // Visual feedback
            const btnId = `btn-${direction.toLowerCase()}`;
            const btn = document.getElementById(btnId);
            if (btn && !btn.disabled) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = '', 100);
            }
        }
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
        showNotification('You have already joined the game!', 'error');
        return;
    }
    
    // Add player
    gameState.players.push(myPlayerId);
    gameState.positions[myPlayerId] = [0, 0];
    
    updateUI();
    showNotification('Successfully joined the game!', 'success');
}

function movePlayer(direction) {
    // Validate game state
    if (gameState.players.length === 0) {
        showNotification('No players in game! Click "Join Game" first.', 'error');
        return;
    }
    
    if (gameState.winner) {
        const winnerIdx = gameState.players.indexOf(gameState.winner);
        showNotification(`Game is over! Player ${winnerIdx + 1} won!`, 'info');
        return;
    }
    
    // Get current player
    const currentPlayerIdx = gameState.current_turn % gameState.players.length;
    const currentPlayer = gameState.players[currentPlayerIdx];
    
    // Check if it's your turn
    if (currentPlayer !== myPlayerId) {
        showNotification(`Not your turn! Wait for Player ${currentPlayerIdx + 1}`, 'error');
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
        showNotification('Cannot move out of bounds!', 'error');
        return;
    }
    
    // Check wall collision
    if (isWall(nx, ny)) {
        showNotification('Cannot move into a wall!', 'error');
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
            showNotification('🏆 Congratulations! You won the game!', 'success');
        }, 100);
        return;
    }
    
    // Next turn
    gameState.current_turn++;
    updateUI();
    showNotification(`Moved ${direction}!`, 'success');
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

// Particle System
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Entrance Animations
function addEntranceAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00ff88, #00cc66)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ff0000, #cc0000)' : 
                     'linear-gradient(135deg, #00f5ff, #0088ff)'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 15px 25px;
        border-radius: 12px;
        font-weight: 700;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(400px); }
    }
`;
document.head.appendChild(style);
