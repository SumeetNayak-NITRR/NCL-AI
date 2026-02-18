/**
 * Global Default Configuration for Player Card Layout
 * 
 * These values are used as fallbacks when specific player cards do not have
 * manual overrides saved in their photo_url parameters.
 * 
 * To shift the layout for ALL cards, edit these values.
 */

export const CARD_LAYOUT_DEFAULTS = {
    // Name Section (Bottom)
    NAME_X: 0,
    NAME_Y: -16,
    NAME_SIZE: 52, // Font size in px

    // Stats Row (Bottom)
    STATS_X: 0,
    STATS_Y: -30,

    // Rating & Info (Top Left)
    RATING_X: -8,
    RATING_Y: 20,

    // Position (Below Rating)
    POSITION_X: -10,
    POSITION_Y: 25,
    POSITION_SIZE: 42,

    // Branch (Below Position)
    BRANCH_X: -10,
    BRANCH_Y: 55, // Consistent gap ~30px visual
    BRANCH_SIZE: 28,

    // Gap between elements in vertical stack
    GAP: 5
};
