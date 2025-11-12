import Tournament from '../models/Tournament.js';
import Game from '../models/Game.js';
import TournamentEntry from '../models/Tournamententry.js'; // Import the new model

/**
 * Get all tournaments for a specific game
 */
export const getTournamentsByGame = async (req, res) => {
  try {
    const gameSlug = req.params.slug;
    const game = await Game.findOne({ slug: gameSlug });

    if (!game) {
      console.log(`Game not found with slug: ${gameSlug}`);
      return res.status(404).json({ message: "Game not found" });
    }

    const tournaments = await Tournament.find({ game: game._id });
    res.status(200).json({ tournaments });

  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * --- THIS IS THE NEW FUNCTION ---
 * Join a tournament
 */
export const joinTournament = async (req, res) => {
  try {
    const { tournamentId, inGameUsername, inGameUserId, gameLevel } = req.body;
    const userId = req.user.id; // From authMiddleware

    // 1. Check if user has already joined
    const existingEntry = await TournamentEntry.findOne({
      user: userId,
      tournament: tournamentId,
    });

    if (existingEntry) {
      return res.status(400).json({ message: "You have already joined this tournament." });
    }

    // 2. Find the tournament to check fee and player count
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found." });
    }

    // 3. Check if tournament is full
    if (tournament.playersJoined >= tournament.maxPlayers) {
      return res.status(400).json({ message: "This tournament is already full." });
    }
    
    // 4. Check if tournament is free (as requested)
    if (tournament.entryFee > 0) {
      // In a real app, you'd check wallet balance here.
      // For now, we'll just block it if it's not free.
      return res.status(400).json({ message: "This is a paid tournament." });
    }

    // 5. Create the new entry
    const newEntry = new TournamentEntry({
      user: userId,
      tournament: tournamentId,
      inGameUsername,
      inGameUserId,
      gameLevel,
    });
    await newEntry.save();

    // 6. Increment the player count on the tournament
    tournament.playersJoined += 1;
    await tournament.save();

    res.status(201).json({ message: "Successfully joined tournament!", entry: newEntry });

  } catch (error) {
    console.error('Error joining tournament:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already joined this tournament." });
    }
    res.status(500).json({ message: 'Server error' });
  }
};