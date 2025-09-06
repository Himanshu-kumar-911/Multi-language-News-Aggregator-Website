import { mockNewsData } from '../data/mockNews';

// Configuration for API mode vs Mock mode
const NEWS_CLIENT_MODE = 'mock'; // 'mock' or 'api'
const API_BASE_URL = 'https://newsapi.org/v2';

class NewsClient {
  constructor() {
    this.mode = NEWS_CLIENT_MODE;
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY;
  }

  // Main method to fetch news articles
  async fetchArticles(filters = {}) {
    try {
      if (this.mode === 'api' && this.apiKey) {
        return await this.fetchFromAPI(filters);
      } else {
        return await this.fetchFromMock(filters);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  // Fetch from real News API
  async fetchFromAPI(filters) {
    // TODO: Implement real API integration when API key is available
    const { category, search, language = 'en', page = 1, pageSize = 20 } = filters;
    
    let url = `${API_BASE_URL}/top-headlines?apiKey=${this.apiKey}&page=${page}&pageSize=${pageSize}`;
    
    if (category && category !== 'all') {
      url += `&category=${category.toLowerCase()}`;
    }
    
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
    
    if (language) {
      url += `&language=${language}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      status: data.status
    };
  }

  // Fetch from mock data
  async fetchFromMock(filters) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { 
      category = 'all', 
      search = '', 
      language = 'en', 
      page = 1, 
      pageSize = 20,
      sortBy = 'newest' 
    } = filters;

    let filteredArticles = [...mockNewsData];

    // Filter by category
    if (category && category !== 'all') {
      filteredArticles = filteredArticles.filter(
        article => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => {
        const title = language === 'hi' ? article.title_hi : article.title_en;
        const description = language === 'hi' ? article.description_hi : article.description_en;
        
        return title.toLowerCase().includes(searchLower) || 
               description.toLowerCase().includes(searchLower);
      });
    }

    // Sort articles
    if (sortBy === 'newest') {
      filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'oldest') {
      filteredArticles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      articles: paginatedArticles,
      totalResults: filteredArticles.length,
      status: 'ok'
    };
  }

  // Get article by ID
  async getArticleById(id) {
    try {
      if (this.mode === 'api' && this.apiKey) {
        // TODO: Implement API-based article fetching by ID
        throw new Error('Article by ID not implemented for API mode');
      } else {
        const article = mockNewsData.find(article => article.id === id);
        if (!article) {
          throw new Error('Article not found');
        }
        return article;
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  // Get multiple articles by IDs (for favorites)
  async getArticlesByIds(ids) {
    try {
      if (this.mode === 'api' && this.apiKey) {
        // TODO: Implement API-based batch article fetching
        throw new Error('Batch article fetching not implemented for API mode');
      } else {
        const articles = mockNewsData.filter(article => ids.includes(article.id));
        return articles;
      }
    } catch (error) {
      console.error('Error fetching articles by IDs:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const newsClient = new NewsClient();