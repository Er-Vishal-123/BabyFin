
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NewsCard } from "@/components/NewsCard";
import { StockChart } from "@/components/StockChart";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { LinkSummarizer } from "@/components/LinkSummarizer";
import { GrokChat } from "@/components/GrokChat";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, TrendingUp, DollarSign, Zap, Search } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);
  const { toast } = useToast();

  const categories = [
    "All",
    "Stock Drama", 
    "Money Moves",
    "Earnings Tea",
    "Crypto Chaos",
    "Market Vibes"
  ];

  // Mock stock data for demonstration
  const mockStockData = [
    {
      symbol: "AAPL",
      data: Array.from({length: 7}, (_, i) => ({
        time: `Day ${i + 1}`,
        price: 150 + Math.random() * 20
      })),
      change: 5.23,
      changePercent: 3.21
    },
    {
      symbol: "TSLA", 
      data: Array.from({length: 7}, (_, i) => ({
        time: `Day ${i + 1}`,
        price: 200 + Math.random() * 50
      })),
      change: -12.45,
      changePercent: -5.67
    }
  ];

  useEffect(() => {
    const savedApiKey = localStorage.getItem('newsApiKey');
    const providedKey = "ad0f21e19ff6499f8072a5e313e0529e";
    
    if (providedKey) {
      setApiKey(providedKey);
      localStorage.setItem('newsApiKey', providedKey);
      fetchNews(providedKey);
      
      // Set up real-time updates every 5 minutes
      const interval = setInterval(() => {
        fetchNews(providedKey);
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    } else if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchNews(savedApiKey);
    }
  }, []);

  const fetchNews = async (key: string) => {
    setLoading(true);
    try {
      const financialQueries = [
        'stock market',
        'earnings report',
        'financial markets',
        'cryptocurrency bitcoin',
        'investment banking',
        'Federal Reserve',
        'NYSE nasdaq',
        'economic news'
      ];
      
      const randomQuery = financialQueries[Math.floor(Math.random() * financialQueries.length)];
      
      // Using CORS proxy to avoid CORS issues
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(randomQuery)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${key}`;
      const fullUrl = proxyUrl + encodeURIComponent(apiUrl);
      
      console.log('Fetching news with query:', randomQuery);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('News API Response:', data);
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API returned an error');
      }
      
      const validArticles = (data.articles || []).filter((article: NewsArticle) => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description && 
        article.description !== '[Removed]' &&
        article.url
      );
      
      setNews(validArticles);
      setLastUpdate(new Date());
      
      toast({
        title: "🎉 Fresh financial tea served!",
        description: `Found ${validArticles.length} spicy financial stories! ☕📈`,
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Fallback to mock data if API fails
      const mockNewsData = [
        {
          title: "Apple Stock Hits New All-Time High - What This Means for Your Wallet",
          description: "Apple's stock price soared to unprecedented levels today as investors showed confidence in the tech giant's latest quarterly earnings report.",
          url: "https://example.com/apple-stock",
          publishedAt: new Date().toISOString(),
          source: { name: "Financial Times" }
        },
        {
          title: "Bitcoin Rollercoaster: Crypto Market Sees Wild Swings",
          description: "Cryptocurrency markets experienced significant volatility with Bitcoin fluctuating between major support and resistance levels.",
          url: "https://example.com/bitcoin-volatility",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "Crypto Weekly" }
        },
        {
          title: "Federal Reserve Hints at Interest Rate Changes",
          description: "The Federal Reserve's latest meeting minutes suggest potential shifts in monetary policy that could impact borrowing costs nationwide.",
          url: "https://example.com/fed-rates",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "Economic Daily" }
        },
        {
          title: "Tesla Earnings Surprise Wall Street Analysts",
          description: "Electric vehicle manufacturer Tesla reported better-than-expected quarterly results, sending shares up in after-hours trading.",
          url: "https://example.com/tesla-earnings",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: "Market Watch" }
        },
        {
          title: "Gold Prices Surge Amid Economic Uncertainty",
          description: "Precious metals markets saw significant gains as investors sought safe-haven assets during periods of market volatility.",
          url: "https://example.com/gold-surge",
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          source: { name: "Commodity News" }
        }
      ];
      
      setNews(mockNewsData);
      setLastUpdate(new Date());
      
      toast({
        title: "📰 Using demo financial news",
        description: "Showing sample stories while we work on getting live data! The simplified explanations still work perfectly! 💪",
      });
    } finally {
      setLoading(false);
    }
  };

  const simplifyForKids = (title: string, description: string): string => {
    const simplifications = [
      "Imagine your piggy bank, but MUCH bigger! 🐷💰",
      "It's like when you trade Pokemon cards, but with company pieces! 🃏✨",
      "Think of companies like your favorite YouTubers - sometimes they're trending up, sometimes down! 📱📈",
      "Money stuff happened and people are either happy 😊 or sad 😢 about it!",
      "Someone's wallet got heavier or lighter today! 💰⚖️",
      "It's like a video game where scores go up and down, but with real money! 🎮💵",
      "Companies had a good day or bad day, kinda like when you ace a test or forget homework! 📚📊"
    ];
    
    return simplifications[Math.floor(Math.random() * simplifications.length)];
  };

  const getCategoryForArticle = (title: string, description: string): string => {
    const text = (title + " " + description).toLowerCase();
    
    if (text.includes('earnings') || text.includes('revenue') || text.includes('profit')) {
      return 'Earnings Tea';
    }
    if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum')) {
      return 'Crypto Chaos';
    }
    if (text.includes('stock') || text.includes('share') || text.includes('trading')) {
      return 'Stock Drama';
    }
    if (text.includes('investment') || text.includes('fund') || text.includes('money')) {
      return 'Money Moves';
    }
    return 'Market Vibes';
  };

  const getSentiment = (): 'bullish' | 'bearish' | 'neutral' => {
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !apiKey) return;
    
    setLoading(true);
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${apiKey}`;
      const fullUrl = proxyUrl + encodeURIComponent(apiUrl);
      
      console.log('Searching news with query:', searchQuery);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search API Response:', data);
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API returned an error');
      }
      
      const validArticles = (data.articles || []).filter((article: NewsArticle) => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description && 
        article.description !== '[Removed]' &&
        article.url
      );
      
      setNews(validArticles);
      setLastUpdate(new Date());
      
      toast({
        title: "🔍 Search results ready!",
        description: `Found ${validArticles.length} articles about "${searchQuery}"! 📰`,
      });
    } catch (error) {
      console.error('Error searching news:', error);
      toast({
        title: "😅 Search had a hiccup",
        description: "Let's try a different search term or check back later!",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = activeCategory === "All" 
    ? news 
    : news.filter(article => getCategoryForArticle(article.title, article.description) === activeCategory);

  if (!apiKey) {
    return <ApiKeyInput onApiKeySubmit={setApiKey} />;
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-money rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-money bg-clip-text text-transparent">
                BabyFin 👶💰
              </h1>
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="w-3 h-3 mr-1" />
                Finance Made Simple
              </Badge>
              {lastUpdate && (
                <Badge variant="outline" className="hidden md:flex">
                  🔴 Live • Last updated: {lastUpdate.toLocaleTimeString()}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isRealTime ? "money" : "outline"} 
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
              >
                {isRealTime ? "⏸️ Pause" : "▶️ Resume"} Real-time
              </Button>
              <Button 
                variant="money" 
                size="sm"
                onClick={() => fetchNews(apiKey)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "🔄 Refresh Feed"}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex gap-4 border-b">
            <button
              onClick={() => setActiveTab("news")}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === "news" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📰 News Feed
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === "link" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🔗 Link Summary
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === "chat" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              💬 Ask Grok
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">
                BabyFin: Your First Finance Friend! 👶💰
              </h2>
              <p className="text-xl opacity-90">
                Making money stuff as easy as baby talk! Search, summarize, and chat about finance! 
                🍼📈
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Content based on active tab */}
        {activeTab === "news" && (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search for any financial news... (e.g., 'Apple stock', 'Bitcoin', 'inflation')"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                    variant="money"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="text-center p-4 bg-bullish/10 border-bullish/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-bullish">📈 Stonks</div>
                  <div className="text-sm text-muted-foreground">Going Up!</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-accent/10 border-accent/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-accent">🧠 Simplified</div>
                  <div className="text-sm text-muted-foreground">For Everyone</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">⚡ Fresh</div>
                  <div className="text-sm text-muted-foreground">Daily Updates</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-neutral/10 border-neutral/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-neutral">🎯 No BS</div>
                  <div className="text-sm text-muted-foreground">Just Facts</div>
                </CardContent>
              </Card>
            </div>

            {/* Stock Charts */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Live Market Vibes 📊
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockStockData.map((stock, index) => (
                  <StockChart key={index} {...stock} />
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* News Feed */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-accent" />
                  Latest Financial Tea ☕
                </h3>
                <Badge variant="outline" className="text-sm">
                  {filteredNews.length} stories simplified
                </Badge>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg font-medium">Loading financial tea... ☕</span>
                </div>
              ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredNews.map((article, index) => (
                    <NewsCard
                      key={index}
                      title={article.title}
                      summary={article.description || "No summary available"}
                      kidExplanation={simplifyForKids(article.title, article.description || "")}
                      category={getCategoryForArticle(article.title, article.description || "")}
                      sentiment={getSentiment()}
                      publishedAt={article.publishedAt}
                      source={article.source.name}
                      url={article.url}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <CardContent>
                    <div className="text-6xl mb-4">🤷‍♀️</div>
                    <h3 className="text-xl font-bold mb-2">No financial drama in this category!</h3>
                    <p className="text-muted-foreground mb-4">
                      Try switching categories, searching for something, or refreshing for the latest money news.
                    </p>
                    <Button variant="money" onClick={() => fetchNews(apiKey)}>
                      Get Some Tea! ☕
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {activeTab === "link" && <LinkSummarizer />}
        
        {activeTab === "chat" && <GrokChat />}
      </div>
    </div>
  );
};

export default Index;
