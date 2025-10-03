import { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authClient } from '../services/authClient';

const AppContext = createContext();

// App state reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_ITEMS_PER_PAGE':
      return { ...state, itemsPerPage: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_FAVORITE':
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload]
      };
    case 'REMOVE_FAVORITE':
      return { 
        ...state, 
        favorites: state.favorites.filter(id => id !== action.payload)
      };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export function AppProvider({ children }) {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  
  // Initialize state from URL params
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      searchQuery: params.get('search') || '',
      selectedCategory: params.get('category') || 'all',
      currentPage: parseInt(params.get('page')) || 1,
      itemsPerPage: parseInt(params.get('limit')) || 12,
      sortOrder: params.get('sort') || 'newest',
      isLoading: false,
      favorites: favorites,
      user: authClient.getCurrentUser()
    };
  };

  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.searchQuery) params.set('search', state.searchQuery);
    if (state.selectedCategory !== 'all') params.set('category', state.selectedCategory);
    if (state.currentPage !== 1) params.set('page', state.currentPage.toString());
    if (state.itemsPerPage !== 12) params.set('limit', state.itemsPerPage.toString());
    if (state.sortOrder !== 'newest') params.set('sort', state.sortOrder);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [state.searchQuery, state.selectedCategory, state.currentPage, state.itemsPerPage, state.sortOrder]);

  // Sync favorites with localStorage
  useEffect(() => {
    dispatch({ type: 'SET_FAVORITES', payload: favorites });
  }, [favorites]);

  // Auth actions
  const login = async (credentials) => {
    const user = await authClient.login(credentials);
    dispatch({ type: 'SET_USER', payload: user });
    return user;
  };

  const register = async (payload) => {
    const user = await authClient.register(payload);
    dispatch({ type: 'SET_USER', payload: user });
    return user;
  };

  const logout = async () => {
    await authClient.logout();
    dispatch({ type: 'SET_USER', payload: null });
  };

  // Language switching
  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Favorite management
  const addToFavorites = (articleId) => {
    const updatedFavorites = [...favorites, articleId];
    setFavorites(updatedFavorites);
  };

  const removeFromFavorites = (articleId) => {
    const updatedFavorites = favorites.filter(id => id !== articleId);
    setFavorites(updatedFavorites);
  };

  const isFavorite = (articleId) => {
    return state.favorites.includes(articleId);
  };

  const value = {
    // State
    ...state,
    theme,
    currentLanguage: i18n.language,
    
    // Actions
    dispatch,
    switchLanguage,
    toggleTheme,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    // Auth
    user: state.user,
    login,
    register,
    logout,
    
    // Computed values
    favoriteCount: state.favorites.length
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}