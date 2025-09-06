import { useTranslation } from 'react-i18next';
import { 
  GlobeAltIcon, 
  ClockIcon, 
  HeartIcon, 
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export function About() {
  const { t } = useTranslation();

  const features = [
    {
      icon: GlobeAltIcon,
      title: t('about.features.multilingual'),
      description: 'Read news in both English and Hindi with seamless language switching.'
    },
    {
      icon: ClockIcon,
      title: t('about.features.realtime'),
      description: 'Get the latest news updates as they happen around the world.'
    },
    {
      icon: HeartIcon,
      title: t('about.features.favorites'),
      description: 'Save articles you love and access them anytime from your favorites collection.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: t('about.features.responsive'),
      description: 'Enjoy a perfect reading experience on all your devices - mobile, tablet, and desktop.'
    },
    {
      icon: MagnifyingGlassIcon,
      title: t('about.features.search'),
      description: 'Find exactly what you\'re looking for with our powerful search functionality.'
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: t('about.features.categories'),
      description: 'Filter news by categories like Technology, Sports, Politics, and more.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            {t('about.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {t('about.description')}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('about.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                  border border-gray-100 dark:border-gray-700
                "
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Stay Informed?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of readers who trust NewsHub for their daily dose of global news.
            </p>
            <a
              href="#home"
              className="
                inline-flex items-center px-8 py-4 bg-white text-indigo-600 
                font-semibold rounded-lg hover:bg-gray-100 transition-colors
                shadow-lg hover:shadow-xl transform hover:-translate-y-1
              "
            >
              Start Reading News
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">10+</div>
            <div className="text-gray-600 dark:text-gray-400">News Categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">2</div>
            <div className="text-gray-600 dark:text-gray-400">Languages Supported</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Latest Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}