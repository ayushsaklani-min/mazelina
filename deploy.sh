#!/bin/bash
set -e

# Add cargo bin to PATH
export PATH="$HOME/.cargo/bin:$PATH"

echo "🎮 MazeStepper Multiplayer - Conway Deployment Script"
echo "======================================================"

# Check if linera is installed
if ! command -v linera &> /dev/null; then
    echo "❌ Error: linera CLI not found"
    echo "PATH: $PATH"
    exit 1
fi

echo "✅ Linera version: $(linera --version | head -n 1)"

# Handle parent workspace if it exists
PARENT_CARGO="../Cargo.toml"
PARENT_CARGO_BACKUP="../Cargo.toml.backup"
PARENT_WORKSPACE_EXISTS=false

if [ -f "$PARENT_CARGO" ]; then
    echo "⚠️  Found parent workspace Cargo.toml, temporarily moving it..."
    mv "$PARENT_CARGO" "$PARENT_CARGO_BACKUP"
    PARENT_WORKSPACE_EXISTS=true
fi

# Cleanup function
cleanup() {
    if [ "$PARENT_WORKSPACE_EXISTS" = true ]; then
        echo "🔄 Restoring parent Cargo.toml..."
        mv "$PARENT_CARGO_BACKUP" "$PARENT_CARGO"
    fi
}

# Set trap to restore on exit
trap cleanup EXIT

# Step 1: Add wasm32 target
echo ""
echo "📦 Step 1: Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown

# Step 2: Build WASM
echo ""
echo "🔨 Step 2: Building WASM contract..."
cargo build --release --target wasm32-unknown-unknown

WASM_FILE="target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm"

if [ ! -f "$WASM_FILE" ]; then
    echo "❌ Error: WASM file not found at $WASM_FILE"
    exit 1
fi

WASM_SIZE=$(ls -lh "$WASM_FILE" | awk '{print $5}')
echo "✅ WASM built successfully: $WASM_SIZE"

# Step 3: Check wallet configuration
echo ""
echo "🔍 Step 3: Checking wallet configuration..."
WALLET_SHOW=$(linera wallet show 2>&1 || true)
echo "$WALLET_SHOW"

# Step 4: Publish and create application
echo ""
echo "📤 Step 4: Publishing bytecode and creating application..."
echo "This may take a moment..."

# Use the same WASM for both contract and service
PUBLISH_CREATE_OUTPUT=$(linera publish-and-create "$WASM_FILE" "$WASM_FILE" 2>&1 || true)
echo "$PUBLISH_CREATE_OUTPUT"

# Extract bytecode ID - try multiple patterns
BYTECODE_ID=$(echo "$PUBLISH_CREATE_OUTPUT" | grep -oP 'Bytecode ID: \K[a-f0-9]+' || echo "$PUBLISH_CREATE_OUTPUT" | grep -oP 'bytecode.*?["\x27]?([a-f0-9]{64})["\x27]?' | grep -oP '[a-f0-9]{64}' | head -n 1 || echo "")

# Extract application ID - try multiple patterns
APPLICATION_ID=$(echo "$PUBLISH_CREATE_OUTPUT" | grep -oP 'Application ID: \K[a-f0-9]+' || echo "$PUBLISH_CREATE_OUTPUT" | grep -oP 'application.*?["\x27]?([a-f0-9]{64}[a-f0-9]+)["\x27]?' | grep -oP '[a-f0-9]{64}[a-f0-9]+' | head -n 1 || echo "")

if [ -z "$BYTECODE_ID" ] && [ -z "$APPLICATION_ID" ]; then
    echo "⚠️  Could not extract IDs automatically"
    echo "Full output:"
    echo "$PUBLISH_CREATE_OUTPUT"
    echo ""
    echo "Please check the output above for the bytecode and application IDs"
    exit 0
fi

if [ -n "$BYTECODE_ID" ]; then
    echo "✅ Bytecode ID: $BYTECODE_ID"
fi

if [ -n "$APPLICATION_ID" ]; then
    echo "✅ Application ID: $APPLICATION_ID"
fi

# Save IDs to file
echo ""
echo "💾 Saving deployment info..."
cat > deployment-info.txt <<EOF
MazeStepper Multiplayer - Deployment Info
==========================================
Deployed: $(date)
Network: Conway Testnet

Bytecode ID: $BYTECODE_ID
Application ID: $APPLICATION_ID

Next Steps:
-----------
1. Join game:
   linera service --application-id $APPLICATION_ID --operation '{"Join": null}'

2. Query state:
   linera query-application $APPLICATION_ID

3. Move (after joining):
   linera service --application-id $APPLICATION_ID --operation '{"Move": "Right"}'
   linera service --application-id $APPLICATION_ID --operation '{"Move": "Down"}'

4. Get your address:
   linera wallet show

5. Configure UI:
   - Open ui/index.html
   - Enter Application ID: $APPLICATION_ID
   - Enter your owner address from wallet
EOF

cat deployment-info.txt

echo ""
echo "🎉 Deployment Complete!"
echo "📄 Details saved to: deployment-info.txt"
echo ""
echo "🎮 Quick Start:"
echo "   ./play.sh join"
echo "   ./play.sh move Right"
echo "   ./play.sh query"
