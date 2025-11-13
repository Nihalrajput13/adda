import api from './api.js'; 

export const gameService = {
  
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  getGameBySlug: async (gameSlug) => {
    const response = await api.get(`/games/${gameSlug}`);
    return response.data;
  },

  // --- THIS IS THE FIX FOR YOUR MAIN TOURNAMENT PAGE ---
  getAllPublicTournaments: async (gameSlug) => {
    const response = await api.get(`/tournaments/game/${gameSlug}/all`);
    return response.data;
  },
  
  // --- THESE ARE FOR "MY LEAGUES" ---
  getLiveJoinedTournaments: async (gameSlug) => {
    const response = await api.get(`/tournaments/game/${gameSlug}/live-joined`);
    return response.data;
  },

  getUpcomingJoinedTournaments: async (gameSlug) => {
    const response = await api.get(`/tournaments/game/${gameSlug}/upcoming-joined`);
    return response.data;
  },
  
  getPastJoinedTournaments: async (gameSlug) => {
    const response = await api.get(`/tournaments/game/${gameSlug}/past-joined`);
    return response.data;
  },
  // --- END OF NEW FUNCTIONS ---

  joinTournament: async (data) => {
    const response = await api.post('/tournaments/join', data);
    return response.data;
  }
};