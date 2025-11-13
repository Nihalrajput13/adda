import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
    default: 0,
  },
  prizePool: {
    type: Number,
    required: true,
  },
  map: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  playersJoined: {
    type: Number,
    default: 0,
  },
  maxPlayers: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed'],
    default: 'Upcoming',
  },

  // --- THIS IS THE FIX ---
  // Change this field to be a simple String
  // This now matches your database screenshot perfectly
  prizeBreakup: {
    type: String,
    default: ''
  }
  // --- END OF FIX ---

}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;