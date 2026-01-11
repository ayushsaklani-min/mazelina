# WSL Deployment Guide for MazeStepper Multiplayer

## Prerequisites Check

You already have:
- ✅ Linera v0.15.8 installed at `/home/saklani/.cargo/bin/linera`
- ✅ WSL Ubuntu running

## Step-by-Step Deployment

### 1. Navigate to Project in WSL

```bash
# From Windows, the project is at:
# C:\Users\sakla\OneDrive\Desktop\mazeeeelinera

# In WSL, access it via:
cd /mnt/c/Users/sakla/OneDrive/Desktop/mazeeeelinera
```

### 2. Make Scripts Executable

```bash
chmod +x deploy.sh play.sh
```

### 3. Run Deployment Script

```bash
./deploy.sh
```

This will:
- Add wasm32 target
- Build WASM contract
- Publish bytecode to Conway
- Create application instance
- Save deployment info

### 4. Get Your Wallet Address

```bash
linera wallet show
```

Copy your default owner address (starts with letters/numbers).

### 5. Join the Game

```bash
./play.sh join
```

### 6. Check Game State

```bash
./play.sh query
```

You should see:
```json
{
  "players": ["your_address"],
  "positions": {
    "your_address": [0, 0]
  },
  "current_turn": 0,
  "total_moves": 0,
  "winner": null
}
```

### 7. Make Your First Move

```bash
./play.sh move Right
```

### 8. Continue Playing

```bash
# Move around the maze
./play.sh move Down
./play.sh move Right
./play.sh move Down

# Check state anytime
./play.sh query
```

## Multiplayer Testing

### Player 2 Joins (Different Machine/Wallet)

On another machine or with a different wallet:

```bash
cd /mnt/c/Users/sakla/OneDrive/Desktop/mazeeeelinera

# Join with Player 2
linera service --application-id <APP_ID_FROM_deployment-info.txt> --operation '{"Join": null}'

# Query to see both players
linera query-application <APP_ID> --query '{"GameState": null}'
```

### Turn-Based Play

```bash
# Player 1's turn (current_turn = 0)
./play.sh move Right

# Player 2's turn (current_turn = 1)
# Player 2 runs: ./play.sh move Down

# Back to Player 1 (current_turn = 2, wraps to player 0)
./play.sh move Down
```

## Launch UI

### Option 1: Python Server (in WSL)

```bash
cd ui
python3 -m http.server 8000
```

Then open in Windows browser: `http://localhost:8000`

### Option 2: Direct File Access

Open in Windows browser:
```
file:///C:/Users/sakla/OneDrive/Desktop/mazeeeelinera/ui/index.html
```

### Configure UI

1. Get Application ID from `deployment-info.txt`
2. Get your address: `./play.sh wallet`
3. Enter both in UI config section
4. Click "Join Game" or use arrow keys to move

## Troubleshooting

### "linera: command not found"

```bash
# Add to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Or use full path
/home/saklani/.cargo/bin/linera --version
```

### "Not your turn" Error

```bash
# Check whose turn it is
./play.sh query

# Look at current_turn and players array
# If current_turn = 0, it's players[0]'s turn
# If current_turn = 1, it's players[1]'s turn
```

### "Invalid move: wall collision"

Walls are at: (1,1), (1,2), (2,1), (3,3)

```bash
# Check your position first
./play.sh query

# Plan route avoiding walls
# Example safe path from (0,0) to (4,4):
# Right -> Down -> Right -> Right -> Down -> Right -> Down -> Down
```

### Build Errors

```bash
# Ensure Rust is installed
rustc --version

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Clean and rebuild
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

## Quick Reference

```bash
# Deploy
./deploy.sh

# Play
./play.sh join
./play.sh move Right
./play.sh move Down
./play.sh move Left
./play.sh move Up
./play.sh query
./play.sh wallet
./play.sh info

# Manual commands
linera wallet show
linera query-application <APP_ID> --query '{"GameState": null}'
linera service --application-id <APP_ID> --operation '{"Join": null}'
linera service --application-id <APP_ID> --operation '{"Move": "Right"}'
```

## Winning Path Example

From (0,0) to (4,4) avoiding walls:

```bash
./play.sh move Right   # (1,0)
./play.sh move Right   # (2,0)
./play.sh move Down    # (2,1) - wall at (2,1)! Try different path

# Better path:
./play.sh move Down    # (0,1)
./play.sh move Down    # (0,2)
./play.sh move Right   # (1,2) - wall! Try again

# Optimal path:
./play.sh move Right   # (1,0)
./play.sh move Down    # (1,1) - wall! 

# Working path:
./play.sh move Down    # (0,1)
./play.sh move Right   # (1,1) - wall!

# Safe path (avoiding all walls):
# Start: (0,0)
./play.sh move Right   # (1,0)
./play.sh move Right   # (2,0)
./play.sh move Right   # (3,0)
./play.sh move Right   # (4,0)
./play.sh move Down    # (4,1)
./play.sh move Down    # (4,2)
./play.sh move Down    # (4,3)
./play.sh move Down    # (4,4) - WIN! 🏆
```

## Success!

When you reach (4,4), you'll see:
```json
{
  "winner": "your_address"
}
```

Game is now locked - no more moves allowed!
