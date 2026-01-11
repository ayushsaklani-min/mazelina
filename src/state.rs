use linera_sdk::views::{MapView, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct MazeState {
    /// Number of players that joined
    pub player_count: RegisterView<u32>,

    /// player_id → (x, y)
    pub positions: MapView<u32, (u8, u8)>,

    /// whose turn (player_id)
    pub current_turn: RegisterView<u32>,

    pub total_moves: RegisterView<u32>,
    pub winner: RegisterView<Option<u32>>,
}
