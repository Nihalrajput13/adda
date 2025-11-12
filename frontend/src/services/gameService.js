import api from './api'; // This imports your configured axios instance

export const gameService = {
  /**
   * Fetches the list of all games (for Home.jsx)
   */
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  /**
   * --- THIS IS THE NEW FUNCTION THAT FIXES YOUR BUG ---
   * Fetches a single game's details (for GameDetailPage.jsx header)
   */
  getGameBySlug: async (gameSlug) => {
    const response = await api.get(`/games/${gameSlug}`);
    return response.data;
  },

  /**
   * Fetches all tournaments for a specific game (for GameDetailPage.jsx list)
   */
  getTournamentsByGame: async (gameSlug) => {
    const response = await api.get(`/tournaments/game/${gameSlug}`);
    return response.data;
  }
};