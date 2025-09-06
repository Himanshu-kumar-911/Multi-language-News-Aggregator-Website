import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeartIcon, 
  ClockIcon, 
  GlobeAltIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { showToast } from './Toast';

export function ArticleCard({ article, onClick }) {
  const { t } = useTranslation();
  const { currentLanguage, isFavorite, addToFavorites, removeFromFavorites } = useApp();
  const [imageError, setImageError] = useState(false);
  
  const isArticleFavorited = isFavorite(article.id);
  
  // Get localized content
  const title = currentLanguage === 'hi' ? article.title_hi : article.title_en;
  const description = currentLanguage === 'hi' ? article.description_hi : article.description_en;
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    
    if (isArticleFavorited) {
      removeFromFavorites(article.id);
      showToast(t('favorites.removed'), 'info');
    } else {
      addToFavorites(article.id);
      showToast(t('favorites.added'), 'success');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article 
      onClick={onClick}
      className="
        group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer
        border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600
      "
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {!imageError && article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <GlobeAltIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-600 text-white shadow-lg">
            {t(`categories.${article.category.toLowerCase()}`)}
          </span>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="
            absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 
            hover:bg-white dark:hover:bg-gray-800 transition-all duration-200
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
          aria-label={isArticleFavorited ? t('article.removeFromFavorites') : t('article.addToFavorites')}
        >
          {isArticleFavorited ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          {/* Source and Date */}
          <div className="flex items-center space-x-3">
            <span className="font-medium">{article.source.name}</span>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          {/* Read More Indicator */}
          <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <EyeIcon className="h-4 w-4" />
            <span className="text-xs font-medium">{t('common.readMore')}</span>
          </div>
        </div>
      </div>
    </article>
  );
}