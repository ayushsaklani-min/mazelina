# MazeStepper Multiplayer - Deployment Guide

## Prerequisites
- Linera CLI installed and configured
- Conway testnet wallet with tokens
- WSL or Linux environment

## Step 1: Build WASM Contract

```bash
# Navigate to project directory
cd mazestepper-multiplayer

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# Verify WASM output
ls -lh target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm
```

## Step 2: Publish Application Bytecode

```bash
# Publish the bytecode to Conway testnet
linera publish-bytecode \
  target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm \
  --network conway

# Save the returned BYTECODE_ID
# Example: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
```

## Step 3: Create Application

```bash
# Create application instance
linera create-application <BYTECODE_ID> \
  --network conway

# Save the returned APPLICATION_ID
# Example: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
```

## Step 4: Player A Joins Game

```bash
# Set your owner address
export OWNER_A=<your_address_here>

# Join game as Player A
linera service \
  --application-id <APPLICATION_ID> \
  --operation '{"Join": null}' \
  --network conway
```

## Step 5: Player B Joins Game

```bash
# On another machine or wallet
export OWNER_B=<player_b_address>

# Join game as Player B
linera service \
  --application-id <APPLICATION_ID> \
  --operation '{"Join": null}' \
  --network conway
```

## Step 6: Query Game State

```bash
# Check current game state
linera query-application <APPLICATION_ID> \
  --query '{"GameState": null}' \
  --network conway

# Expected output:
# {
#   "players": ["<OWNER_A>", "<OWNER_B>"],
#   "positions": {
#     "<OWNER_A>": [0, 0],
#     "<OWNER_B>": [0, 0]
#   },
#   "current_turn": 0,
#   "total_moves": 0,
#   "winner": null
# }
```

## Step 7: Player A Makes First Move

```bash
# Player A moves right (it's their turn)
linera service \
  --application-id <APPLICATION_ID> \
  --operation '{"Move": "Right"}' \
  --network conway

# Query to verify
linera query-application <APPLICATION_ID> \
  --query '{"GameState": null}' \
  --network conway
```

## Step 8: Player B Makes Move

```bash
# Now it's Player B's turn
linera service \
  --application-id <APPLICATION_ID> \
  --operation '{"Move": "Down"}' \
  --network conway
```

## Step 9: Continue Playing

```bash
# Players alternate turns
# Valid moves: "Up", "Down", "Left", "Right"

# Example sequence to reach goal:
# Player A: Right, Right, Down, Down, Right, Right, Down, Down
# (avoiding walls at (1,1), (1,2), (2,1), (3,3))
```

## Step 10: Launch UI

```bash
# Open UI in browser
cd ui
python3 -m http.server 8000

# Or use any static file server
# Navigate to: http://localhost:8000
```

## UI Configuration

1. Open `http://localhost:8000` in browser
2. Enter your `APPLICATION_ID` in the config section
3. Enter your `OWNER_ADDRESS`
4. Click "Join Game" to join
5. Use arrow buttons to move when it's your turn
6. Click "Refresh State" to update game view

## Testing Turn-Based Logic

```bash
# Player A tries to move twice (should fail)
linera service --application-id <APP_ID> --operation '{"Move": "Right"}'
linera service --application-id <APP_ID> --operation '{"Move": "Right"}'
# Second call should error: "Not your turn"

# Player B tries to move into wall (should fail)
linera service --application-id <APP_ID> --operation '{"Move": "Right"}'
# If position would hit wall, error: "Invalid move: wall collision"
```

## Winning the Game

```bash
# First player to reach (4, 4) wins
# After win, all further moves are rejected
# Query will show: "winner": "<winning_address>"
```

## Troubleshooting

### WASM Build Fails
```bash
# Ensure wasm32 target is installed
rustup target add wasm32-unknown-unknown

# Check Cargo.toml has correct profile settings
```

### Operation Rejected
```bash
# Check it's your turn
linera query-application <APP_ID> --query '{"GameState": null}'

# Verify current_turn matches your player index
```

### UI Not Connecting
```bash
# The UI uses mock adapter by default
# For production: Integrate with Linera RPC or CLI wrapper
# Update app.js mockCliCall() function with actual implementation
```

## Production Integration

To connect UI to actual chain:

1. **Option A: CLI Wrapper**
   - Create Node.js backend that executes `linera` commands
   - UI calls backend API endpoints
   - Backend returns parsed CLI output

2. **Option B: Direct RPC**
   - Use Linera RPC endpoints if available
   - Update `app.js` to make HTTP requests to chain
   - Parse GraphQL or JSON-RPC responses

3. **Option C: WebSocket**
   - Subscribe to chain events
   - Real-time state updates
   - No manual refresh needed

## Conway Testnet Notes

- Ensure sufficient tokens for operations
- Network may have rate limits
- Keep APPLICATION_ID secure
- Monitor gas costs per operation
- Test with 2-4 players for best experience

## Success Criteria

✅ Contract deploys without errors
✅ Multiple players can join
✅ Turn rotation works correctly
✅ Wall collisions are blocked
✅ Winner is declared at (4,4)
✅ UI displays game state accurately
✅ No async/await in contract
✅ No cross-chain messages
✅ WASM size < 1MB
