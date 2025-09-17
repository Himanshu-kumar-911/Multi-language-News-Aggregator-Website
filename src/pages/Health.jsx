import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { newsClient } from '../services/newsClient';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleModal } from '../components/ArticleModal';
import { Pagination } from '../components/Pagination';
import { LoadingGrid } from '../components/LoadingSkeleton';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export function Health() {
  const { t } = useTranslation();
  const { 
    searchQuery, 
    currentPage, 
    itemsPerPage, 
    sortOrder, 
    currentLanguage,
    isLoading,
    dispatch
  } = useApp();

  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState(null);
  
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        setError(null);

        const filters = {
          category: 'health',
          search: debouncedSearchQuery,
          language: currentLanguage,
          page: currentPage,
          pageSize: itemsPerPage,
          sortBy: sortOrder
        };

        const response = await newsClient.fetchArticles(filters);
        setArticles(response.articles);
        setTotalResults(response.totalResults);
      } catch (err) {
        setError(err.message);
        setArticles([]);
        setTotalResults(0);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchArticles();
  }, [debouncedSearchQuery, currentLanguage, currentPage, itemsPerPage, sortOrder, dispatch]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('categories.health')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Latest health news and medical updates
          </p>
        </div>

        {!isLoading && totalResults > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? (
                <span>
                  {t('search.results')}: "{searchQuery}" - {t('common.showingResults', { count: totalResults })}
                </span>
              ) : (
                t('common.showingResults', { count: totalResults })
              )}
            </p>
            
            <select
              value={sortOrder}
              onChange={(e) => dispatch({ type: 'SET_SORT_ORDER', payload: e.target.value })}
              className="
                border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              "
            >
              <option value="newest">{t('home.newest')}</option>
              <option value="oldest">{t('home.oldest')}</option>
            </select>
          </div>
        )}

        {isLoading && <LoadingGrid count={itemsPerPage} />}

        {!isLoading && articles.length === 0 && !error && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('common.noResults')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? t('search.noResults') : 'No health articles available.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
              >
                {t('search.clear')}
              </button>
            )}
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
            <Pagination totalItems={totalResults} />
          </>
        )}

        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
