import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get news articles (public route with optional authentication)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // This is a placeholder - you can integrate with news APIs here
    // For now, return mock data or integrate with your frontend's mock data
    
    const mockNews = [
      {
        id: '1',
        title: 'Sample News Article 1',
        description: 'This is a sample news article description.',
        url: 'https://example.com/news/1',
        urlToImage: 'https://via.placeholder.com/400x200',
        publishedAt: new Date().toISOString(),
        source: { name: 'Sample News' },
        category: 'general'
      },
      {
        id: '2',
        title: 'Sample News Article 2',
        description: 'This is another sample news article description.',
        url: 'https://example.com/news/2',
        urlToImage: 'https://via.placeholder.com/400x200',
        publishedAt: new Date().toISOString(),
        source: { name: 'Sample News' },
        category: 'technology'
      }
    ];

    res.json({
      success: true,
      data: {
        articles: mockNews,
        totalResults: mockNews.length,
        user: req.user ? { id: req.user.userId } : null
      }
    });

  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news articles'
    });
  }
});

// Get news by category
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology', 'politics'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Mock data for specific category
    const mockNews = [
      {
        id: `1-${category}`,
        title: `Sample ${category} News Article`,
        description: `This is a sample ${category} news article description.`,
        url: `https://example.com/news/${category}/1`,
        urlToImage: 'https://via.placeholder.com/400x200',
        publishedAt: new Date().toISOString(),
        source: { name: 'Sample News' },
        category: category
      }
    ];

    res.json({
      success: true,
      data: {
        articles: mockNews,
        totalResults: mockNews.length,
        category: category,
        user: req.user ? { id: req.user.userId } : null
      }
    });

  } catch (error) {
    console.error('Category news fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category news'
    });
  }
});

// Search news articles
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q: query, category, language = 'en' } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Mock search results
    const mockResults = [
      {
        id: `search-1-${query}`,
        title: `Search result for "${query}"`,
        description: `This is a search result for the query "${query}".`,
        url: `https://example.com/search/${encodeURIComponent(query)}`,
        urlToImage: 'https://via.placeholder.com/400x200',
        publishedAt: new Date().toISOString(),
        source: { name: 'Search News' },
        category: category || 'general'
      }
    ];

    res.json({
      success: true,
      data: {
        articles: mockResults,
        totalResults: mockResults.length,
        query: query,
        category: category,
        language: language,
        user: req.user ? { id: req.user.userId } : null
      }
    });

  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search news articles'
    });
  }
});

export default router;
