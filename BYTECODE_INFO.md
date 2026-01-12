# MazeStepper Multiplayer - Bytecode Information

## Published Bytecode Details

### Contract Bytecode
- **Bytecode ID**: `897559c06f8bd1267921ed9b51a6b8dd016b90eda12bc57229e320913f113334`
- **Status**: Successfully published to Conway testnet
- **Chain ID**: `a6b91a89fb179d82b40e705bcdaa1dd59e01aa2f54646135ecc49eedf8e6e1e6`

### Service Bytecode
- **Bytecode ID**: `cddd1e84e3cae61910156a9f68a9d1252e61ecf49886bba58a096618135b0baf`
- **Status**: Successfully published to Conway testnet

## Local WASM File

- **File**: `target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm`
- **Size**: 155,227 bytes (152 KB)
- **SHA256**: `f2eded73883d81f5e0bcdb6b222f4bd2a9e402bd0b2fd6b4e5e6428c72cbebe8`
- **Last Modified**: 2026-01-11 19:37:41

## Deployment Status

✅ **Module Published**: Successfully published to Conway testnet
❌ **Application Creation**: Failed with error "Unknown opcode 252 during Operation(0)"

### Issue Details

The bytecode was successfully published and is available on the Conway testnet, but application instantiation fails due to WASM compatibility issues. The compiled WASM contains opcode 252 (part of WASM reference types proposal) which is not supported by the current Linera runtime on Conway testnet.

### Bytecode Location on Network

The bytecode is stored on Conway testnet and can be referenced by its bytecode ID:
- Contract: `897559c06f8bd1267921ed9b51a6b8dd016b90eda12bc57229e320913f113334`
- Service: `cddd1e84e3cae61910156a9f68a9d1252e61ecf49886bba58a096618135b0baf`

### Compilation Details

- **Rust Toolchain**: stable
- **Linera SDK**: 0.15.8
- **Target**: wasm32-unknown-unknown
- **Optimization**: Release profile with LTO
- **Build Date**: 2026-01-11

## How to Use This Bytecode

Once the Conway testnet runtime is updated to support newer WASM features, you can create an application using this published bytecode:

```bash
linera create-application <bytecode-id> \
  --json-argument '{}' \
  --json-parameters '{}'
```

## Viewing the Bytecode

To inspect the WASM bytecode locally:

```bash
# View file info
ls -lh target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm

# Inspect WASM structure (requires wasm-tools)
wasm-tools print target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm

# Validate WASM
wasm-tools validate target/wasm32-unknown-unknown/release/mazestepper_multiplayer.wasm
```

## Next Steps

1. Wait for Conway testnet runtime update to support WASM reference types
2. Or deploy to a local Linera network for testing
3. Or contact Linera team about the compatibility issue
