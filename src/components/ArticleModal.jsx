import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  XMarkIcon, 
  HeartIcon,
  ShareIcon,
  ClockIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { showToast } from './Toast';

export function ArticleModal({ article, isOpen, onClose }) {
  const { t } = useTranslation();
  const { currentLanguage, isFavorite, addToFavorites, removeFromFavorites } = useApp();
  const modalRef = useRef(null);
  
  if (!article) return null;
  
  const isArticleFavorited = isFavorite(article.id);
  
  // Get localized content
  const title = currentLanguage === 'hi' ? article.title_hi : article.title_en;
  const description = currentLanguage === 'hi' ? article.description_hi : article.description_en;
  const content = currentLanguage === 'hi' ? article.content_hi : article.content_en;

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  const handleFavoriteClick = () => {
    if (isArticleFavorited) {
      removeFromFavorites(article.id);
      showToast(t('favorites.removed'), 'info');
    } else {
      addToFavorites(article.id);
      showToast(t('favorites.added'), 'success');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: article.url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(article.url);
        showToast('Article URL copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy URL', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          ref={modalRef}
          className="
            relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
            max-h-[90vh] overflow-hidden transform transition-all animate-in zoom-in duration-200
          "
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {t(`categories.${article.category.toLowerCase()}`)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {article.source.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isArticleFavorited ? t('article.removeFromFavorites') : t('article.addToFavorites')}
              >
                {isArticleFavorited ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-red-500" />
                )}
              </button>
              
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('article.shareArticle')}
              >
                <ShareIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('common.close')}
              >
                <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Featured Image */}
            {article.urlToImage && (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={article.urlToImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <span>•</span>
                <span>{t('common.source')}: {article.source.name}</span>
              </div>

              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {content}
                </p>
              </div>

              {/* Read Full Article Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 
                    text-white px-6 py-3 rounded-lg font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  "
                >
                  <span>{t('article.readFull')}</span>
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}