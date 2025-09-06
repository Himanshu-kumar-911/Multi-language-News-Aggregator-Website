# Multi-language News Aggregator Website

A modern, responsive news aggregator built with React, Vite, and Tailwind CSS. Features multi-language support (English/Hindi), dark/light themes, favorites, and a clean, accessible UI.

## Features

- **Multi-language Support**: Switch between English and Hindi with full UI and content localization
- **Responsive Design**: Perfect experience on mobile, tablet, and desktop
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Category Filtering**: Browse news by Technology, Sports, Politics, Business, etc.
- **Advanced Search**: Debounced search with real-time filtering
- **Favorites System**: Save articles for later reading with localStorage persistence  
- **Pagination**: Configurable page sizes with smooth navigation
- **Article Modal**: Quick preview with full content display
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Loading States**: Skeleton loaders and smooth transitions
- **Toast Notifications**: User feedback for actions
- **URL State**: Shareable links with filter and pagination state

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd news-aggregator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation with search and theme toggle
│   ├── CategoryBar.js  # Category filtering buttons
│   ├── ArticleCard.js  # Individual article card component
│   ├── ArticleModal.js # Article detail modal
│   ├── Pagination.js   # Pagination controls
│   ├── Toast.js        # Toast notification system
│   └── LoadingSkeleton.js # Loading state components
├── pages/              # Main page components
│   ├── Home.js         # Main news listing page
│   ├── Favorites.js    # Saved articles page
│   └── About.js        # About page
├── context/            # React Context for state management
│   └── AppContext.js   # Global app state
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useDebouncedValue.js
│   └── useTheme.js
├── services/           # API and data services
│   └── newsClient.js   # News data fetching service
├── data/               # Mock data and constants
│   └── mockNews.js     # Sample news articles
├── i18n/               # Internationalization
│   ├── index.js        # i18n configuration
│   └── locales/        # Translation files
│       ├── en.json     # English translations
│       └── hi.json     # Hindi translations
└── App.js              # Main app component
```

## API Integration

The app is designed with a pluggable architecture for easy API integration:

### Current Mode: Mock Data
- Uses local JSON data for demonstration
- All features work with sample articles
- No external dependencies

### Future API Mode
1. Set the `NEWS_CLIENT_MODE` to `'api'` in `src/services/newsClient.js`
2. Add your News API key to environment variables:
```bash
# .env
VITE_NEWS_API_KEY=your_api_key_here
```

3. The `newsClient.js` service will automatically switch to live API calls

### Supported News APIs
- News API (newsapi.org) - Primary integration ready
- Easily extensible for other news APIs

## Configuration

### Environment Variables
```bash
# Optional - for API mode
VITE_NEWS_API_KEY=your_news_api_key

# Optional - default language
VITE_DEFAULT_LANGUAGE=en
```

### Customization
- **Theme Colors**: Modify `tailwind.config.js`
- **Categories**: Update `src/data/mockNews.js`
- **Languages**: Add translation files to `src/i18n/locales/`
- **Mock Data**: Edit `src/data/mockNews.js`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React i18next** - Internationalization
- **Headless UI** - Accessible UI components
- **Heroicons** - SVG icon library
- **React Router DOM** - Client-side routing

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] Real-time notifications
- [ ] Social sharing integration  
- [ ] Offline reading support
- [ ] User accounts and sync
- [ ] More language support
- [ ] RSS feed integration
- [ ] Advanced filtering options
- [ ] Reading time estimates