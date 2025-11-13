import Tournament from '../models/Tournament.js';
import Game from '../models/Game.js';
import TournamentEntry from '../models/tournamentEntry.js'; // Use lowercase 't'

// --- 1. FOR GameDetailPage.jsx (PUBLIC LIST) ---
// THIS IS YOUR OLD, WORKING CODE. IT WILL FIX YOUR PAGE.
export const getAllPublicTournaments = async (req, res) => {
  try {
    const gameSlug = req.params.slug;
    const game = await Game.findOne({ slug: gameSlug });

    if (!game) {
      console.log(`Game not found with slug: ${gameSlug}`);
      return res.status(404).json({ message: "Game not found" });
    }

    // --- THIS IS THE FIX ---
    // Reverting to your simple, working query.
    // This finds all tournaments for the game, regardless of date or status.
    const tournaments = await Tournament.find({ game: game._id });
    // --- END OF FIX ---
    
    res.status(200).json({ tournaments });

  } catch (error)
 {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- 2. FOR MyLeaguesPage.jsx ("Live" tab) ---
// This function is for your "My Leagues" page
export const getLiveJoinedTournaments = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameSlug = req.params.slug;

    const game = await Game.findOne({ slug: gameSlug });
    if (!game) { return res.status(404).json({ message: "Game not found" }); }

    const entries = await TournamentEntry.find({ user: userId }).select('tournament');
    const tournamentIds = entries.map(entry => entry.tournament);

    const tournaments = await Tournament.find({
      _id: { $in: tournamentIds },
      game: game._id,
      status: 'Live',
    }).sort({ startTime: -1 }); 

    res.status(200).json({ tournaments });
  
  } catch (error) {
    console.error('Error fetching live joined tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- 3. FOR MyLeaguesPage.jsx ("Upcoming" tab) ---
// This function is for your "My Leagues" page
export const getUpcomingJoinedTournaments = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameSlug = req.params.slug;

    const game = await Game.findOne({ slug: gameSlug });
    if (!game) { return res.status(404).json({ message: "Game not found" }); }

    const entries = await TournamentEntry.find({ user: userId }).select('tournament');
    const tournamentIds = entries.map(entry => entry.tournament);

    const tournaments = await Tournament.find({
      _id: { $in: tournamentIds },
      game: game._id,
      status: 'Upcoming',
      startTime: { $gt: new Date() }
    }).sort({ startTime: 1 });

    res.status(200).json({ tournaments });
  
  } catch (error) {
    console.error('Error fetching upcoming tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- 4. FOR MyLeaguesPage.jsx ("Past" tab) ---
// This function is for your "My Leagues" page
export const getPastJoinedTournaments = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameSlug = req.params.slug;

    const game = await Game.findOne({ slug: gameSlug });
    if (!game) { return res.status(404).json({ message: "Game not found" }); }

    const entries = await TournamentEntry.find({ user: userId }).select('tournament');
    const tournamentIds = entries.map(entry => entry.tournament);

    const tournaments = await Tournament.find({
      _id: { $in: tournamentIds },
      game: game._id,
      status: 'Completed',
      startTime: { $lt: new Date() }
    }).sort({ startTime: -1 });

    res.status(200).json({ tournaments });
  
  } catch (error) {
    console.error('Error fetching past tournaments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// --- Join a tournament (This is your old, working function) ---
export const joinTournament = async (req, res) => {
  try {
    const { tournamentId, inGameUsername, inGameUserId, gameLevel } = req.body;
    const userId = req.user.id; 

    const existingEntry = await TournamentEntry.findOne({
      user: userId,
      tournament: tournamentId,
    });
    if (existingEntry) {
      return res.status(400).json({ message: "You have already joined this tournament." });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found." });
    }
    
    if (new Date(tournament.startTime) < new Date()) {
      return res.status(400).json({ message: "This tournament has already started." });
    }
    
    if (tournament.playersJoined >= tournament.maxPlayers) {
      return res.status(400).json({ message: "This tournament is already full." });
    }
    if (tournament.entryFee > 0) {
      return res.status(400).json({ message: "This is a paid tournament." });
    }

    const newEntry = new TournamentEntry({
      user: userId,
      tournament: tournamentId,
      inGameUsername,
      inGameUserId,
      gameLevel,
    });
    await newEntry.save();

    tournament.playersJoined += 1;
    // We also set the status, so it works with "My Leagues"
    tournament.status = 'Upcoming'; 
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