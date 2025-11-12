import Tournament from '../models/Tournament.js';
import Game from '../models/Game.js'; // We must import the Game model

/**
 * Get all tournaments for a specific game
 * This is the function that fixes your bug
 */
export const getTournamentsByGame = async (req, res) => {
  try {
    const gameSlug = req.params.slug; // e.g., "free-fire"

    // 1. Find the game document using the slug to get its ID
    const game = await Game.findOne({ slug: gameSlug });

    // Handle if no game is found
    if (!game) {
      console.log(`Game not found with slug: ${gameSlug}`);
      return res.status(404).json({ message: "Game not found" });
    }

    // 2. Use that game's _id to find all matching tournaments
    //    This now matches the data in your screenshot!
    const tournaments = await Tournament.find({ game: game._id });

    // 3. Send the tournaments back
    res.status(200).json({ tournaments });

  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};