import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { newsClient } from '../services/newsClient';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleModal } from '../components/ArticleModal';
import { LoadingGrid } from '../components/LoadingSkeleton';

export function Favorites() {
  const { t } = useTranslation();
  const { favorites } = useApp();
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite articles
  useEffect(() => {
    const fetchFavoriteArticles = async () => {
      if (favorites.length === 0) {
        setFavoriteArticles([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const articles = await newsClient.getArticlesByIds(favorites);
        setFavoriteArticles(articles);
      } catch (err) {
        setError(err.message);
        setFavoriteArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteArticles();
  }, [favorites]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  if (error) {
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('favorites.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('favorites.subtitle')}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingGrid count={12} />}

        {/* Empty State */}
        {!isLoading && favoriteArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <HeartOutline className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('favorites.empty')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {t('favorites.emptyDescription')}
            </p>
            <a
              href="#home"
              className="
                mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 
                text-white font-medium rounded-lg transition-colors
              "
            >
              Explore Articles
            </a>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favoriteArticles.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {t('common.showingResults', { count: favoriteArticles.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))}
            </div>
          </>
        )}

        {/* Article Modal */}
        <ArticleModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}