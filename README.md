# 🎮 MazeStepper Multiplayer

A turn-based multiplayer on-chain maze game built for **Linera Conway testnet**.

## 🎯 Game Overview

- **Grid**: 5×5 maze
- **Start**: All players begin at (0,0)
- **Goal**: First to reach (4,4) wins
- **Walls**: Fixed obstacles at (1,1), (1,2), (2,1), (3,3)
- **Turns**: Players move in rotation order
- **Winner**: Game locks after first player reaches goal

## 🏗️ Architecture

### Smart Contract (Rust + Linera SDK)
- **State**: Players, positions, turn counter, winner
- **Operations**: Join, Move(Direction)
- **Query**: GameState
- **Constraints**: Conway WASM compatible (no async, no cross-chain)

### Frontend (HTML/CSS/JS)
- Modern dark theme with neon accents
- Real-time game state visualization
- Turn-based controls with validation
- Player list and move counter
- Winner announcement

## 📁 Project Structure

```
mazestepper-multiplayer/
├── Cargo.toml              # Rust dependencies & WASM config
├── src/
│   └── lib.rs              # Smart contract logic
├── ui/
│   ├── index.html          # Game interface
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic
├── DEPLOYMENT.md           # Step-by-step deployment guide
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Build Contract
```bash
cargo build --release --target wasm32-unknown-unknown
```

### 2. Deploy to Conway
```bash
linera publish-bytecode target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm
linera create-application <BYTECODE_ID>
```

### 3. Play Game
```bash
# Player joins
linera service --application-id <APP_ID> --operation '{"Join": null}'

# Player moves
linera service --application-id <APP_ID> --operation '{"Move": "Right"}'

# Query state
linera query-application <APP_ID> --query '{"GameState": null}'
```

### 4. Launch UI
```bash
cd ui
python3 -m http.server 8000
# Open http://localhost:8000
```

## 🎮 Game Rules

1. **Join**: Any address can join before game ends
2. **Turn Order**: Players move in join order
3. **Valid Moves**: Up, Down, Left, Right (within 5×5 grid)
4. **Walls**: Cannot move into wall cells
5. **Win**: First to (4,4) becomes winner
6. **Lock**: No moves allowed after winner declared

## 🛠️ Technical Details

### Conway Compliance
✅ No async/await
✅ No cross-chain messaging
✅ No randomness
✅ No timers
✅ No floating point
✅ Minimal allocations
✅ Only linera-sdk + serde

### WASM Optimization
- `opt-level = "s"` (size optimization)
- `lto = true` (link-time optimization)
- `panic = "abort"` (no unwinding)
- `codegen-units = 1` (better optimization)

## 📖 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Complete deployment steps
- Multi-player testing scenarios
- UI configuration
- Troubleshooting guide
- Production integration options

## 🎨 UI Features

- **Visual Grid**: 5×5 maze with color-coded elements
- **Player Tracking**: List of all players with turn indicator
- **Move Controls**: Arrow buttons (disabled when not your turn)
- **Live Stats**: Move counter, player count
- **Winner Banner**: Animated celebration on win
- **Responsive**: Works on desktop and tablet

## 🔧 Development

### Prerequisites
- Rust 1.70+
- Linera CLI
- wasm32-unknown-unknown target
- Conway testnet wallet

### Local Testing
```bash
# Build
cargo build --release --target wasm32-unknown-unknown

# Check WASM size
ls -lh target/wasm32-unknown-unknown/release/*.wasm

# Run UI locally
cd ui && python3 -m http.server 8000
```

## 📝 License

MIT License - Built for Linera Conway testnet hackathon

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 🎯 Success Checklist

- [x] Conway-compatible WASM contract
- [x] Turn-based multiplayer logic
- [x] Wall collision detection
- [x] Win condition handling
- [x] Professional UI with animations
- [x] Complete deployment guide
- [x] CLI integration examples
- [x] Multi-player testing scenarios

---

**Built with ❤️ for Linera Conway Testnet**
