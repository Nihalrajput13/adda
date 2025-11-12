import mongoose from 'mongoose';

const tournamentEntrySchema = new mongoose.Schema({
  // Link to the user who is joining
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Link to the tournament they are joining
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  
  // The 3 new fields you requested
  inGameUsername: {
    type: String,
    required: true,
    trim: true,
  },
  inGameUserId: {
    type: String,
    required: true,
    trim: true,
  },
  gameLevel: {
    type: Number,
    required: true,
  },

}, { timestamps: true });

// Add a unique index to prevent a user from joining the same tournament twice
tournamentEntrySchema.index({ user: 1, tournament: 1 }, { unique: true });

const TournamentEntry = mongoose.model('TournamentEntry', tournamentEntrySchema);

export default TournamentEntry;