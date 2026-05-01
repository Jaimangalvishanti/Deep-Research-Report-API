import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

/**
 * DuckDuckGo Instant Answer API (Free, no key)
 * Note: Limited to "instant" results, good for definitions/top hits.
 */
export async function searchDuckDuckGo(query: string): Promise<SearchSource[]> {
  try {
    const response = await axios.get(`https://api.duckduckgo.com/`, {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
    });

    const data = response.data;
    const sources: SearchSource[] = [];

    if (data.AbstractText) {
      sources.push({
        title: data.Heading || 'Main Topic',
        url: data.AbstractURL || '',
        snippet: data.AbstractText,
      });
    }

    if (data.RelatedTopics) {
      data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          sources.push({
            title: topic.Text.split(' - ')[0] || 'Related Info',
            url: topic.FirstURL,
            snippet: topic.Text,
          });
        }
      });
    }

    return sources;
  } catch (error) {
    console.error('DDG Search Error:', error);
    return [];
  }
}

/**
 * Wikipedia REST API
 */
export async function searchWikipedia(query: string): Promise<SearchSource[]> {
  try {
    const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*',
      },
    });

    const searchResults = response.data.query.search;
    return searchResults.slice(0, 3).map((item: any) => ({
      title: item.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
      snippet: item.snippet.replace(/<[^>]*>?/gm, ''), // Remove HTML tags
    }));
  } catch (error) {
    console.error('Wikipedia Search Error:', error);
    return [];
  }
}

/**
 * HackerNews Algolia API
 */
export async function searchHackerNews(query: string): Promise<SearchSource[]> {
  try {
    const response = await axios.get(`https://hn.algolia.com/api/v1/search`, {
      params: {
        query,
        tags: 'story',
        hitsPerPage: 3,
      },
    });

    return response.data.hits.map((hit: any) => ({
      title: hit.title,
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      snippet: hit.comment_text || hit.story_text || 'HackerNews Discussion',
    }));
  } catch (error) {
    console.error('HN Search Error:', error);
    return [];
  }
}

/**
 * Simple Scraper using Cheerio
 */
export async function scrapeUrl(url: string): Promise<string> {
  if (!url) return '';
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResearchBot/1.0)',
      },
    });
    const $ = cheerio.load(response.data);
    
    // Remove scripts, styles, and junk
    $('script, style, nav, header, footer, iframe').remove();
    
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.slice(0, 5000); // Limit context size
  } catch (error) {
    console.warn(`Failed to scrape ${url}:`, error);
    return '';
  }
}
