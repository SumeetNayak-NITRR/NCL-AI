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
    NAME_Y: 0,
    NAME_SIZE: 52, // Font size in px

    // Stats Row (Bottom)
    STATS_X: 0,
    STATS_Y: 0,

    // Rating & Info (Top Left)
    RATING_X: 0,
    RATING_Y: 0,
    POSITION_SIZE: 28, // Increased from 24px
    BRANCH_SIZE: 18    // Increased from 14/16px
};
