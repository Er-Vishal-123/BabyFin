
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
  try {
    // Using AllOrigins as a CORS proxy to fetch the article content
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const response = await fetch(proxyUrl + encodeURIComponent(url));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const htmlContent = data.contents;
    
    // Extract text content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style');
    scripts.forEach(script => script.remove());
    
    // Try to find the main article content
    let articleText = '';
    
    // Common article selectors
    const articleSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      '.story-body',
      '.article-body',
      'main'
    ];
    
    for (const selector of articleSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        articleText = element.textContent || '';
        break;
      }
    }
    
    // Fallback to body content if no article found
    if (!articleText) {
      articleText = doc.body?.textContent || '';
    }
    
    // Clean up the text
    articleText = articleText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    // Limit content length for processing
    if (articleText.length > 5000) {
      articleText = articleText.substring(0, 5000) + '...';
    }
    
    return articleText;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article content');
  }
};

export const summarizeArticle = async (content: string): Promise<string> => {
  // This is a client-side summarization approach
  // In a real app, you'd want to use a proper AI API like OpenAI, Claude, etc.
  
  try {
    // Simple extractive summarization - find key sentences
    const sentences = content.split(/[.!?]+/).filter(s => s.length > 20);
    
    if (sentences.length === 0) {
      throw new Error('No meaningful content found');
    }
    
    // Score sentences based on common financial keywords
    const financialKeywords = [
      'stock', 'market', 'price', 'shares', 'trading', 'investment', 'revenue', 
      'profit', 'earnings', 'company', 'business', 'financial', 'money', 'dollar',
      'economy', 'economic', 'growth', 'decline', 'increase', 'decrease', 'analyst',
      'forecast', 'report', 'quarter', 'annual', 'CEO', 'investor', 'fund'
    ];
    
    const scoredSentences = sentences.map(sentence => {
      const words = sentence.toLowerCase().split(/\s+/);
      const score = words.reduce((acc, word) => {
        return acc + (financialKeywords.includes(word) ? 1 : 0);
      }, 0);
      return { sentence: sentence.trim(), score };
    });
    
    // Get top sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.sentence);
    
    // Create 5-year-old friendly summary
    const summary = `🍼 Here's what happened in simple words:

${topSentences.map((sentence, index) => `${index + 1}. ${makeKidFriendly(sentence)}`).join('\n\n')}

💡 Why this matters: This news affects how companies make money and how much their "company tokens" (stocks) are worth. When companies do well, people get excited and want to buy their tokens. When companies have problems, people might sell their tokens instead!

🎯 Think of it like: Companies are like your favorite game characters, and stocks are like trading cards of those characters. Good news makes the cards more valuable, bad news makes them less valuable!`;

    return summary;
  } catch (error) {
    console.error('Error summarizing:', error);
    throw new Error('Failed to create summary');
  }
};

const makeKidFriendly = (sentence: string): string => {
  // Replace complex financial terms with simple explanations
  const replacements: { [key: string]: string } = {
    'revenue': 'money they made',
    'profit': 'extra money after paying bills',
    'earnings': 'money they earned',
    'stock price': 'company card value',
    'shares': 'company pieces',
    'investment': 'money put in to help grow',
    'market': 'big trading place',
    'CEO': 'company boss',
    'quarterly': 'every 3 months',
    'analyst': 'smart money person',
    'forecast': 'guess about future',
    'decline': 'went down',
    'surge': 'went up fast',
    'volatility': 'price jumping around'
  };
  
  let friendlySentence = sentence;
  Object.entries(replacements).forEach(([term, replacement]) => {
    const regex = new RegExp(term, 'gi');
    friendlySentence = friendlySentence.replace(regex, replacement);
  });
  
  return friendlySentence;
};
