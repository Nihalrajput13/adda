import api from './api'; 

export const gameService = {
  /**
   * Fetches the list of all games (for Home.jsx)
   */
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  /**
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
  },
  
  /**
   * --- THIS IS THE NEW FUNCTION ---
   * Submits the user's details to join a tournament
   */
  joinTournament: async (data) => {
    // data = { tournamentId, inGameUsername, inGameUserId, gameLevel }
    const response = await api.post('/tournaments/join', data);
    return response.data;
  }
};