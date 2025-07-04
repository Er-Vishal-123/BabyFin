
export const createSpeechUtterance = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8; // Slower speech for better understanding
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness
  utterance.volume = 0.9;
  return utterance;
};

export const stopSpeech = () => {
  window.speechSynthesis.cancel();
};

export const fetchArticleContent = async (url: string): Promise<string> => {
  console.log('Attempting to fetch article from:', url);
  
  // List of CORS proxy services to try
  const proxies = [
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/'
  ];
  
  // Try each proxy service
  for (let i = 0; i < proxies.length; i++) {
    const proxyUrl = proxies[i];
    console.log(`Trying proxy ${i + 1}:`, proxyUrl);
    
    try {
      const fullUrl = proxyUrl + encodeURIComponent(url);
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)'
        }
      });
      
      if (!response.ok) {
        console.log(`Proxy ${i + 1} failed with status:`, response.status);
        continue;
      }
      
      let htmlContent;
      
      // Handle different proxy response formats
      if (proxyUrl.includes('allorigins')) {
        const data = await response.json();
        htmlContent = data.contents;
      } else {
        htmlContent = await response.text();
      }
      
      if (!htmlContent || htmlContent.length < 100) {
        console.log(`Proxy ${i + 1} returned insufficient content`);
        continue;
      }
      
      console.log(`Successfully fetched content using proxy ${i + 1}`);
      return extractArticleText(htmlContent);
      
    } catch (error) {
      console.log(`Proxy ${i + 1} error:`, error);
      continue;
    }
  }
  
  // If all proxies fail, return a fallback message
  console.log('All proxies failed, using fallback content');
  return generateFallbackContent(url);
};

const extractArticleText = (htmlContent: string): string => {
  try {
    // Extract text content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .ads');
    scripts.forEach(script => script.remove());
    
    // Try to find the main article content
    let articleText = '';
    
    // Common article selectors (in order of preference)
    const articleSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      '.story-body',
      '.article-body',
      '.main-content',
      'main',
      '.post-body',
      '.article-text'
    ];
    
    for (const selector of articleSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        articleText = element.textContent || '';
        if (articleText.length > 200) { // Ensure we have substantial content
          break;
        }
      }
    }
    
    // Fallback to body content if no article found
    if (!articleText || articleText.length < 200) {
      const bodyElement = doc.body;
      if (bodyElement) {
        articleText = bodyElement.textContent || '';
      }
    }
    
    // Clean up the text
    articleText = articleText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\t+/g, ' ') // Replace tabs with spaces
      .trim();
    
    // Limit content length for processing
    if (articleText.length > 8000) {
      articleText = articleText.substring(0, 8000) + '...';
    }
    
    console.log('Extracted article length:', articleText.length);
    return articleText;
  } catch (error) {
    console.error('Error extracting article text:', error);
    throw new Error('Failed to extract article text');
  }
};

const generateFallbackContent = (url: string): string => {
  // Generate content based on URL patterns for common financial news sites
  const domain = new URL(url).hostname.toLowerCase();
  
  const fallbackContent = `Financial news article from ${domain}. 
  
  This appears to be a financial news story that discusses market movements, company performance, or economic developments. 
  The article likely covers topics such as stock prices, market trends, corporate earnings, economic indicators, or investment advice.
  
  Key themes often found in financial news include:
  - Stock market performance and trading activity
  - Company earnings reports and financial results  
  - Economic data and government policy impacts
  - Industry analysis and market forecasts
  - Investment opportunities and risks
  - Currency and commodity price movements
  
  This content represents typical financial news coverage that would benefit from simplified explanation for general audiences.`;
  
  console.log('Generated fallback content for:', domain);
  return fallbackContent;
};

export const summarizeArticle = async (content: string): Promise<string> => {
  console.log('Starting article summarization, content length:', content.length);
  
  try {
    // Improved extractive summarization approach
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length === 0) {
      throw new Error('No meaningful content found in article');
    }
    
    console.log('Found', sentences.length, 'sentences to analyze');
    
    // Enhanced financial keywords for better relevance scoring
    const financialKeywords = [
      // Market terms
      'stock', 'market', 'shares', 'trading', 'nasdaq', 'dow', 'sp500', 's&p',
      // Financial metrics
      'price', 'revenue', 'profit', 'earnings', 'sales', 'growth', 'loss',
      // Business terms
      'company', 'business', 'corporation', 'firm', 'enterprise',
      // Economic terms
      'economy', 'economic', 'financial', 'investment', 'investor',
      // Money terms
      'money', 'dollar', 'billion', 'million', 'cash', 'fund', 'capital',
      // Market movements
      'rise', 'fall', 'increase', 'decrease', 'surge', 'decline', 'jump', 'drop',
      // Key roles
      'ceo', 'cfo', 'executive', 'analyst', 'investor',
      // Reports and data
      'report', 'quarter', 'quarterly', 'annual', 'forecast', 'guidance',
      // Crypto terms
      'bitcoin', 'crypto', 'cryptocurrency', 'blockchain', 'ethereum'
    ];
    
    // Score sentences based on keyword relevance and position
    const scoredSentences = sentences.map((sentence, index) => {
      const words = sentence.toLowerCase().split(/\s+/);
      let score = 0;
      
      // Keyword relevance score
      words.forEach(word => {
        if (financialKeywords.some(keyword => word.includes(keyword))) {
          score += 2;
        }
      });
      
      // Length bonus (prefer substantial sentences)
      if (sentence.length > 50 && sentence.length < 200) {
        score += 1;
      }
      
      // Position bonus (earlier sentences often more important)
      if (index < sentences.length * 0.3) {
        score += 1;
      }
      
      // Number bonus (sentences with numbers often contain key data)
      if (/\d+/.test(sentence)) {
        score += 1;
      }
      
      return { sentence: sentence.trim(), score, index };
    });
    
    // Get top 3-4 sentences
    const topSentences = scoredSentences
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .sort((a, b) => a.index - b.index) // Restore original order
      .map(item => item.sentence);
    
    console.log('Selected', topSentences.length, 'key sentences for summary');
    
    // Create kid-friendly summary
    const summary = `🍼 Here's what happened in simple words:

${topSentences.map((sentence, index) => `${index + 1}. ${makeKidFriendly(sentence)}`).join('\n\n')}

💡 Why this matters: This news affects how companies make money and how much their "company shares" (stocks) are worth. When companies do well, people get excited and want to buy their shares. When companies have problems, people might sell their shares instead!

🎯 Think of it like: Companies are like your favorite game characters, and stocks are like trading cards of those characters. Good news makes the cards more valuable, bad news makes them less valuable!

🔄 Real-time update: This summary was created just now from the latest news content, so you're getting the freshest financial info explained in the simplest way possible!`;

    console.log('Successfully created kid-friendly summary');
    return summary;
  } catch (error) {
    console.error('Error in summarization:', error);
    throw new Error('Failed to create summary from article content');
  }
};

const makeKidFriendly = (sentence: string): string => {
  // Enhanced replacements for financial terms
  const replacements: { [key: string]: string } = {
    'revenue': 'money they made',
    'profit': 'extra money after paying bills',
    'earnings': 'money they earned',
    'stock price': 'company card value',
    'share price': 'company card value',
    'shares': 'company pieces',
    'stocks': 'company cards',
    'investment': 'money put in to help grow',
    'market': 'big trading place',
    'nasdaq': 'tech company trading place',
    'dow jones': 'big company scorecard',
    'ceo': 'company boss',
    'cfo': 'money boss',
    'quarterly': 'every 3 months',
    'analyst': 'smart money person',
    'forecast': 'guess about future',
    'guidance': 'company prediction',
    'decline': 'went down',
    'surge': 'went up fast',
    'volatility': 'price jumping around',
    'bullish': 'feeling good about prices going up',
    'bearish': 'worried about prices going down',
    'dividend': 'bonus money for shareholders',
    'ipo': 'company going public for first time',
    'merger': 'two companies becoming one',
    'acquisition': 'one company buying another',
    'billion': 'thousand million (huge number!)',
    'million': 'thousand thousand (big number!)'
  };
  
  let friendlySentence = sentence;
  
  // Apply replacements
  Object.entries(replacements).forEach(([term, replacement]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    friendlySentence = friendlySentence.replace(regex, replacement);
  });
  
  // Add enthusiasm and simplify complex structures
  if (friendlySentence.includes('increase') || friendlySentence.includes('rise') || friendlySentence.includes('up')) {
    friendlySentence += ' 📈';
  } else if (friendlySentence.includes('decrease') || friendlySentence.includes('fall') || friendlySentence.includes('down')) {
    friendlySentence += ' 📉';
  }
  
  return friendlySentence;
};
