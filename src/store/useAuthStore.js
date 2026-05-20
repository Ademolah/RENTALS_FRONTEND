import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // 1. Initial State: Read from localStorage to survive page refreshes
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // 2. Login Action: Saves the data and updates the app instantly
  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },

  // 3. Logout Action: Wipes the secure data and locks the app
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  // 4. Update Action: Crucial for when a User upgrades to an ADMIN (CEO)
  updateUser: (updates) => set((state) => {
    if (!state.user) return state;
    
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  })
}));