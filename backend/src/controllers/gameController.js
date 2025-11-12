import Game from '../models/Game.js';

/**
 * Get all games for the lobby
 */
export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * --- THIS IS THE NEW FUNCTION THAT FIXES YOUR BUG ---
 * Get a single game's details by its slug
 */
export const getGameBySlug = async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json({ game });
  } catch (error) {
    console.error('Error fetching game by slug:', error);
    res.status(500).json({ message: 'Server error' });
  }
};