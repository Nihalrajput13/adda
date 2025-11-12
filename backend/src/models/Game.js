import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // 'slug' is the URL-friendly name, e.g., "free-fire"
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Games', 'Esports', 'Fanbattle'], // Categories from your design
  },
  iconUrl: {
    type: String, // URL to the game's icon
    required: true,
  },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;