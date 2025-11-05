import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export function Navbar() {
  const { t } = useTranslation();
  const {
    searchQuery,
    dispatch,
    theme,
    toggleTheme,
    currentLanguage,
    switchLanguage,
    favoriteCount,
    user,
    logout
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const searchInputRef = useRef(null);
  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, 500);

  // Update search query in global state when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: debouncedSearchQuery });
      dispatch({ type: 'SET_PAGE', payload: 1 }); // Reset to first page
    }
  }, [debouncedSearchQuery, searchQuery, dispatch]);

  // Sync local search state with global state
  useEffect(() => {
    if (searchQuery !== localSearchQuery) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleLanguageChange = (lng) => {
    switchLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {t('nav.brand')}
            </h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="
                  w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 
                  rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 
                  focus:ring-indigo-500 focus:border-transparent transition-colors
                "
              />
              {localSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                {/* Favorites */}
                <a
                  href="#favorites"
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <HeartIcon className="h-6 w-6" />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </a>
              </>
            )}

            {user && (
              <>
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center space-x-1 p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
                  </button>
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <button onClick={() => handleLanguageChange('en')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>English</button>
                      <button onClick={() => handleLanguageChange('hi')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'hi' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>हिन्दी</button>
                      <button onClick={() => handleLanguageChange('mr')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'mr' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>मराठी</button>
                      <button onClick={() => handleLanguageChange('gu')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'gu' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>ગુજરાતી</button>
                      <button onClick={() => handleLanguageChange('bn')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'bn' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>বাংলা</button>
                      <button onClick={() => handleLanguageChange('ta')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'ta' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>தமிழ்</button>
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <MoonIcon className="h-6 w-6" />
                  ) : (
                    <SunIcon className="h-6 w-6" />
                  )}
                </button>
              </>
            )}

            {/* About */}
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t('nav.about')}
            </a>

            {/* Auth */}
            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">{user.firstName} {user.lastName}</span>
                <button
                  onClick={async () => { await logout(); window.location.hash = 'home'; }}
                  className="px-3 py-1.5 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="#login" className="px-3 py-1.5 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Login
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)
                    
                  }
                  placeholder={t('nav.search')}
                  className="
                    w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 
                    rounded-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 
                    focus:ring-indigo-500 focus:border-transparent
                  "
                />
              </div>

              {/* Mobile Actions */}
              {user && (
                <>
                  <a
                    href="#favorites"
                    className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <HeartIcon className="h-5 w-5 mr-3" />
                    {t('nav.favorites')}
                    {favoriteCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {favoriteCount}
                      </span>
                    )}
                  </a>
                </>
              )}

              {user && (
                <>
                  {/* Language Selector (mobile) */}
                  <div className="px-2">
                    <button
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <GlobeAltIcon className="h-5 w-5 mr-3" />
                      {currentLanguage.toUpperCase()}
                    </button>
                    {isLangMenuOpen && (
                      <div className="mt-1 mb-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                        <button onClick={() => {handleLanguageChange('en'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>English</button>
                        <button onClick={() => {handleLanguageChange('hi'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'hi' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>हिन्दी</button>
                        <button onClick={() => {handleLanguageChange('mr'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'mr' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>मराठी</button>
                        <button onClick={() => {handleLanguageChange('gu'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'gu' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>ગુજરાતી</button>
                        <button onClick={() => {handleLanguageChange('bn'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'bn' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>বাংলা</button>
                        <button onClick={() => {handleLanguageChange('ta'); setIsMenuOpen(true);} } className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${currentLanguage === 'ta' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>தமிழ்</button>
                      </div>
                    )}
                  </div>

                  {/* Theme Toggle (mobile) */}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {theme === 'light' ? (
                      <>
                        <MoonIcon className="h-5 w-5 mr-3" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <SunIcon className="h-5 w-5 mr-3" />
                        Light Mode
                      </>
                    )}
                  </button>
                </>
              )}

              <a
                href="#about"
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {t('nav.about')}
              </a>

              {/* Auth (mobile) */}
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300">
                    {user.firstName} {user.lastName}
                  </div>
                  <button
                    onClick={async () => { await logout(); setIsMenuOpen(false); window.location.hash = 'home'; }}
                    className="w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="#login" className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside handler for language menu */}
      {isLangMenuOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsLangMenuOpen(false)}
        />
      )}
    </nav>
  );
}