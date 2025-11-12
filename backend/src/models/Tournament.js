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
}, { timestamps: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);

// --- THIS IS THE FIX ---
// This line makes it a default export.
export default Tournament;