import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockNews';

export function CategoryBar() {
  const { t } = useTranslation();
  const { selectedCategory, dispatch } = useApp();

  const handleCategoryChange = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
    dispatch({ type: 'SET_PAGE', payload: 1 }); // Reset to first page
  };

  const allCategories = ['all', ...categories.map(cat => cat.toLowerCase())];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-4">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                whitespace-nowrap border-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${selectedCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent hover:bg-indigo-50 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400'
                }
              `}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}