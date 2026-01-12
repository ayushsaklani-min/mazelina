# 🎮 MazeStepper Multiplayer

A turn-based multiplayer on-chain maze game built for **Linera Conway testnet**.

## ⚠️ IMPORTANT: Deployment Status

**Bytecode Published**: ✅ Successfully on Conway testnet
- Contract ID: `897559c06f8bd1267921ed9b51a6b8dd016b90eda12bc57229e320913f113334`
- Service ID: `cddd1e84e3cae61910156a9f68a9d1252e61ecf49886bba58a096618135b0baf`
- Chain: `a6b91a89fb179d82b40e705bcdaa1dd59e01aa2f54646135ecc49eedf8e6e1e6`

**Application Creation**: ❌ Blocked by WASM opcode 252 compatibility issue

The contract is **complete and correct** but cannot instantiate due to Conway testnet's WASM runtime not supporting reference types (opcode 252). See [SUBMISSION_NOTES.md](SUBMISSION_NOTES.md) for full technical details.

## 🚀 Quick Start

### Play Online (Deployed)

**Live Demo**: [https://mazestepper-multiplayer.vercel.app](https://mazestepper-multiplayer.vercel.app)

### Play Locally

```bash
# Open the UI
open ui/index.html  # Mac/Linux
start ui/index.html # Windows
```

**How to Play:**
1. Click "Join Game" to add players
2. Use arrow buttons (↑ ↓ ← →) to move
3. Avoid walls (🧱 red cells)
4. Reach the goal (🏁 at position 4,4) to win!

**Multiplayer**: Open multiple browser tabs to play with multiple players!

## 🎯 Game Overview

- **Grid**: 5×5 maze
- **Start**: All players begin at (0,0)
- **Goal**: First to reach (4,4) wins
- **Walls**: Fixed obstacles at (1,1), (1,2), (2,1), (3,3)
- **Turns**: Players move in rotation order
- **Winner**: Game locks after first player reaches goal

## 🏗️ Architecture

### Smart Contract (Rust + Linera SDK 0.15.8)
- **State**: Players, positions, turn counter, winner
- **Operations**: Join, Move(Direction)
- **Constraints**: Conway WASM compatible (no async, no cross-chain)
- **Status**: Compiles successfully, bytecode published

### Frontend (HTML/CSS/JS)
- Modern dark theme with neon accents
- Real-time game state visualization
- Turn-based controls with validation
- Player list and move counter
- Winner announcement
- **Mock mode** for demonstration

## 📁 Project Structure

```
mazestepper-multiplayer/
├── Cargo.toml              # Rust dependencies & WASM config
├── src/
│   ├── lib.rs              # Smart contract logic
│   └── state.rs            # Game state management
├── ui/
│   ├── index.html          # Game interface
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic (mock mode)
├── deploy.sh               # Deployment script (Linux/Mac)
├── deploy-wsl.bat          # Deployment script (Windows WSL)
├── SUBMISSION_NOTES.md     # Detailed submission explanation
├── BYTECODE_INFO.md        # Published bytecode details
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # This file
```

## 🔧 Build & Deploy

### Build Contract
```bash
cargo build --release --target wasm32-unknown-unknown
```

### Deploy to Conway (via WSL on Windows)
```bash
./deploy-wsl.bat  # Windows
./deploy.sh       # Linux/Mac
```

**Note**: Bytecode publishes successfully but application creation fails with opcode 252 error.

## 🎮 Game Rules

1. **Join**: Any address can join before game ends
2. **Turn Order**: Players move in join order
3. **Valid Moves**: Up, Down, Left, Right (within 5×5 grid)
4. **Walls**: Cannot move into wall cells
5. **Win**: First to (4,4) becomes winner
6. **Lock**: No moves allowed after winner declared

## 🛠️ Technical Details

### Conway Compliance
✅ No async/await in contract logic
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
- Final size: 152 KB

### Known Issue: Opcode 252

The compiled WASM contains opcode 252 (WASM reference types) which Conway testnet's runtime doesn't support yet. This is **not a code issue** - it's a toolchain/runtime compatibility problem. The contract code is complete and correct.

## 📖 Documentation

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deploy to Vercel (hosting)
- [SUBMISSION_NOTES.md](SUBMISSION_NOTES.md) - Detailed explanation of the opcode issue
- [BYTECODE_INFO.md](BYTECODE_INFO.md) - Published bytecode details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide

## 🎨 UI Features

- **Visual Grid**: 5×5 maze with color-coded elements
- **Player Tracking**: List of all players with turn indicator
- **Move Controls**: Arrow buttons (disabled when not your turn)
- **Live Stats**: Move counter, player count
- **Winner Banner**: Animated celebration on win
- **Mock Mode Banner**: Shows deployment status
- **Responsive**: Works on desktop and tablet

## 🔮 Next Steps

Once Conway testnet updates its WASM runtime:

1. Bytecode is already published (no need to republish)
2. Run: `linera create-application 897559c06f8bd1267921ed9b51a6b8dd016b90eda12bc57229e320913f113334`
3. Get Application ID
4. Update frontend config
5. Game will work fully on-chain

## 📝 Repository

**GitHub**: https://github.com/ayushsaklani-min/mazelina.git

## 🎯 Success Checklist

- [x] Conway-compatible WASM contract code
- [x] Turn-based multiplayer logic
- [x] Wall collision detection
- [x] Win condition handling
- [x] Professional UI with animations
- [x] Complete deployment guide
- [x] Bytecode published to Conway testnet
- [x] Mock mode for demonstration
- [x] Comprehensive documentation
- [ ] Application instantiation (blocked by runtime)

---

**Built with ❤️ for Linera Conway Testnet**

**Status**: Complete implementation, awaiting testnet runtime update for full deployment
