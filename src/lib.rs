#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    abi::{ContractAbi, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime,
};
use serde::{Deserialize, Serialize};
use state::MazeState;

/// -------- ABI --------

#[derive(Debug, Serialize, Deserialize)]
pub enum Operation {
    Join,
    Move(Direction),
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

pub struct MazeAbi;

impl ContractAbi for MazeAbi {
    type Operation = Operation;
    type Response = ();
}

/// -------- Contract --------

pub struct MazeContract {
    state: MazeState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(MazeContract);

impl WithContractAbi for MazeContract {
    type Abi = MazeAbi;
}

impl Contract for MazeContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = MazeState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        Self { state, runtime }
    }

    async fn instantiate(&mut self, _: ()) {
        self.state.player_count.set(0);
        self.state.current_turn.set(0);
        self.state.total_moves.set(0);
        self.state.winner.set(None);
    }

    async fn execute_operation(&mut self, operation: Operation) {
        match operation {
            Operation::Join => self.join().await,
            Operation::Move(dir) => self.move_player(dir).await,
        }
    }

    async fn execute_message(&mut self, _: ()) {
        unreachable!()
    }

    async fn store(mut self) {
        self.state.save().await.expect("Save failed");
    }
}

/// -------- Game Logic --------

impl MazeContract {
    fn is_wall(x: u8, y: u8) -> bool {
        matches!((x, y), (1, 1) | (1, 2) | (2, 1) | (3, 3))
    }

    async fn join(&mut self) {
        if self.state.winner.get().is_some() {
            panic!("Game finished");
        }

        let id = *self.state.player_count.get();
        self.state.player_count.set(id + 1);
        self.state.positions.insert(&id, (0, 0)).unwrap();
    }

    async fn move_player(&mut self, dir: Direction) {
        if self.state.winner.get().is_some() {
            panic!("Game finished");
        }

        let players = *self.state.player_count.get();
        if players == 0 {
            panic!("No players");
        }

        let current = *self.state.current_turn.get() % players;
        let (x, y) = self
            .state
            .positions
            .get(&current)
            .await
            .unwrap()
            .unwrap();

        let (nx, ny) = match dir {
            Direction::Up if y > 0 => (x, y - 1),
            Direction::Down if y < 4 => (x, y + 1),
            Direction::Left if x > 0 => (x - 1, y),
            Direction::Right if x < 4 => (x + 1, y),
            _ => panic!("Out of bounds"),
        };

        if Self::is_wall(nx, ny) {
            panic!("Wall");
        }

        self.state
            .positions
            .insert(&current, (nx, ny))
            .unwrap();
        self.state
            .total_moves
            .set(*self.state.total_moves.get() + 1);

        if nx == 4 && ny == 4 {
            self.state.winner.set(Some(current));
        } else {
            self.state
                .current_turn
                .set(*self.state.current_turn.get() + 1);
        }
    }
}
