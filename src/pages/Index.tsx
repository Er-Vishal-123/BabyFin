import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { NewsCard } from "@/components/NewsCard";
import { StockChart } from "@/components/StockChart";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { LinkSummarizer } from "@/components/link-summarizer/LinkSummarizer";
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

  const categories = ["All", "Stock Drama", "Money Moves", "Earnings Tea", "Crypto Chaos", "Market Vibes"];

  // Mock stock data for demonstration
  const mockStockData = [
    {
      symbol: "AAPL",
      data: Array.from({ length: 7 }, (_, i) => ({
        time: `Day ${i + 1}`,
        price: 150 + Math.random() * 20
      })),
      change: 5.23,
      changePercent: 3.21
    },
    {
      symbol: "TSLA", 
      data: Array.from({ length: 7 }, (_, i) => ({
        time: `Day ${i + 1}`,
        price: 200 + Math.random() * 50
      })),
      change: -12.45,
      changePercent: -5.67
    }
  ];

  // Enhanced real-time news fetching with proper dependencies
  useEffect(() => {
    const savedApiKey = localStorage.getItem('newsApiKey');
    const providedKey = "ad0f21e19ff6499f8072a5e313e0529e";
    
    if (providedKey) {
      setApiKey(providedKey);
      localStorage.setItem('newsApiKey', providedKey);
      fetchLatestNews(providedKey);

      // Set up real-time updates every 1 minute for more frequent updates
      let interval: NodeJS.Timeout | null = null;
      
      if (isRealTime) {
        console.log('Setting up real-time news updates every 60 seconds');
        interval = setInterval(() => {
          console.log('Real-time update triggered');
          fetchLatestNews(providedKey);
        }, 60 * 1000); // Changed to 1 minute for faster updates
      }

      return () => {
        if (interval) {
          console.log('Clearing news update interval');
          clearInterval(interval);
        }
      };
    } else if (savedApiKey) {
      setApiKey(savedApiKey);
      fetchLatestNews(savedApiKey);
    }
  }, [isRealTime]); // Added isRealTime to dependencies

  const fetchLatestNews = async (key: string) => {
    console.log('Fetching latest news..., real-time mode:', isRealTime);
    setLoading(true);
    try {
      // Enhanced financial queries for more comprehensive coverage
      const financialQueries = [
        'stock market today',
        'breaking financial news',
        'earnings report today',
        'cryptocurrency news today',
        'Federal Reserve news',
        'market updates today',
        'financial markets breaking',
        'economic news today',
        'nasdaq today',
        'dow jones today'
      ];
      
      const randomQuery = financialQueries[Math.floor(Math.random() * financialQueries.length)];

      // Get today's date for fresher news
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const fromDate = yesterday.toISOString().split('T')[0];
      
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(randomQuery)}&language=en&sortBy=publishedAt&from=${fromDate}&pageSize=50&apiKey=${key}`;
      const fullUrl = proxyUrl + encodeURIComponent(apiUrl);
      
      console.log('Fetching latest news with query:', randomQuery, 'from date:', fromDate);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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

      // Filter for valid and recent articles only
      const validArticles = (data.articles || []).filter((article: NewsArticle) => 
        article.title && 
        article.title !== '[Removed]' && 
        article.description && 
        article.description !== '[Removed]' && 
        article.url && 
        new Date(article.publishedAt) > new Date(Date.now() - 48 * 60 * 60 * 1000) // Only articles from last 48 hours
      ).slice(0, 30); // Limit to 30 most recent articles

      setNews(validArticles);
      setLastUpdate(new Date());
      
      toast({
        title: "🎉 Fresh financial tea served!",
        description: `Found ${validArticles.length} hot financial stories from the last 48 hours! ☕📈`
      });
    } catch (error) {
      console.error('Error fetching latest news:', error);

      // Enhanced fallback with more recent mock data
      const mockNewsData = [
        {
          title: "Breaking: Apple Stock Surges to New All-Time High After Strong Q4 Earnings",
          description: "Apple's stock price reached unprecedented levels today following better-than-expected quarterly earnings and strong iPhone sales guidance for the upcoming holiday season.",
          url: "https://example.com/apple-stock-surge",
          publishedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          source: { name: "Financial Times" }
        },
        {
          title: "Bitcoin Breaks $70K Again: Crypto Market Rally Continues",
          description: "Bitcoin has crossed the $70,000 threshold once more as institutional investors show renewed confidence in cryptocurrency markets amid regulatory clarity.",
          url: "https://example.com/bitcoin-70k",
          publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          source: { name: "Crypto Weekly" }
        },
        {
          title: "Federal Reserve Signals Potential Rate Changes in Latest Meeting",
          description: "The Federal Reserve's latest policy meeting hints at upcoming adjustments to interest rates as inflation data shows signs of stabilizing.",
          url: "https://example.com/fed-rates-latest",
          publishedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
          source: { name: "Economic Daily" }
        },
        {
          title: "Tesla Delivers Record Numbers: Stock Jumps 8% in After-Hours Trading",
          description: "Tesla reported record vehicle deliveries this quarter, sending shares soaring in extended trading as investors celebrate the milestone achievement.",
          url: "https://example.com/tesla-record-deliveries",
          publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          source: { name: "Market Watch" }
        },
        {
          title: "Gold Hits New High: Safe Haven Demand Surges Amid Market Uncertainty",
          description: "Gold prices reached new record levels as investors seek safe-haven assets during a period of increased market volatility and geopolitical tensions.",
          url: "https://example.com/gold-new-high",
          publishedAt: new Date(Date.now() - 9000000).toISOString(), // 2.5 hours ago
          source: { name: "Commodity News" }
        }
      ];
      
      setNews(mockNewsData);
      setLastUpdate(new Date());
      
      toast({
        title: "📰 Using latest demo financial news",
        description: "Showing fresh sample stories with real-time updates! The 5-year-old explanations are ready! 👶💡"
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced kid-friendly explanations with more variety
  const simplifyForKids = (title: string, description: string): string => {
    const keywords = (title + " " + description).toLowerCase();

    // More specific explanations based on content
    if (keywords.includes('apple') || keywords.includes('iphone')) {
      return "Apple (the company that makes iPhones) did really well and made lots of money! It's like when your lemonade stand sells way more cups than expected! 📱💰";
    }
    if (keywords.includes('bitcoin') || keywords.includes('crypto')) {
      return "Bitcoin is like digital money that lives in computers. Sometimes lots of people want it (price goes up 📈) and sometimes fewer people want it (price goes down 📉)! It's like trading cards but on computers! 💻🪙";
    }
    if (keywords.includes('tesla')) {
      return "Tesla makes really cool electric cars (like big remote control cars but for grown-ups!). When they sell lots of cars, everyone gets excited and wants to own a piece of the company! 🚗⚡";
    }
    if (keywords.includes('federal reserve') || keywords.includes('fed')) {
      return "The Federal Reserve is like the piggy bank boss for the whole country! They decide if it's easier or harder for people to borrow money - kinda like your parents deciding your allowance! 🏦💰";
    }
    if (keywords.includes('gold')) {
      return "When people get worried about money stuff, they buy gold because it's shiny and valuable - like how you might keep your favorite toy safe when things get crazy! ✨🏆";
    }

    // General explanations
    const generalExplanations = [
      "A company did something awesome and now everyone wants to be their friend (buy their stock)! 🎉📈",
      "It's like when your favorite YouTuber gets more subscribers - their 'company score' goes up! 📱⭐",
      "Think of companies like Pokemon cards - sometimes they're worth more, sometimes less! 🃏💫",
      "Money news happened and some grown-ups are doing their happy dance! 💃🕺",
      "It's like a video game where company scores go up and down, but with real money! 🎮💵"
    ];
    return generalExplanations[Math.floor(Math.random() * generalExplanations.length)];
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
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const fromDate = yesterday.toISOString().split('T')[0];
      
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&from=${fromDate}&pageSize=30&apiKey=${apiKey}`;
      const fullUrl = proxyUrl + encodeURIComponent(apiUrl);
      
      console.log('Searching latest news with query:', searchQuery);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
        article.title && article.title !== '[Removed]' && 
        article.description && article.description !== '[Removed]' && 
        article.url
      );

      setNews(validArticles);
      setLastUpdate(new Date());
      
      toast({
        title: "🔍 Latest search results ready!",
        description: `Found ${validArticles.length} fresh articles about "${searchQuery}"! 📰`
      });
    } catch (error) {
      console.error('Error searching news:', error);
      toast({
        title: "😅 Search had a hiccup",
        description: "Let's try a different search term or check back later!"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = activeCategory === "All" ? news : news.filter(article => 
    getCategoryForArticle(article.title, article.description) === activeCategory
  );

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
              <h1 className="text-2xl font-bold bg-gradient-money bg-clip-text text-transparent">BabyFin</h1>
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
                onClick={() => {
                  console.log('Toggling real-time mode from', isRealTime, 'to', !isRealTime);
                  setIsRealTime(!isRealTime);
                }}
              >
                {isRealTime ? "⏸️ Pause" : "▶️ Resume"} Real-time
              </Button>
              <Button 
                variant="money" 
                size="sm" 
                onClick={() => fetchLatestNews(apiKey)} 
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
              onClick={() => setActiveTab("summary")} 
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === "summary" 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📋 News Summary
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
        <div className="h-64 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">
                BabyFin: Your First Finance Friend! 👶💰
              </h2>
              <p className="text-xl opacity-90">
                Making money stuff as easy as baby talk! Get real-time news, summaries, and chat about finance! 
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
                  <div className="text-2xl font-bold text-bullish">📈 Live</div>
                  <div className="text-sm text-muted-foreground">Real-time Updates</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-accent/10 border-accent/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-accent">👶 Simple</div>
                  <div className="text-sm text-muted-foreground">5-Year-Old Friendly</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-primary/10 border-primary/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">⚡ Fresh</div>
                  <div className="text-sm text-muted-foreground">Latest Stories</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4 bg-neutral/10 border-neutral/20">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-neutral">🎯 Smart</div>
                  <div className="text-sm text-muted-foreground">AI Explanations</div>
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
                  Latest Financial Tea ☕ (Real-time)
                </h3>
                <Badge variant="outline" className="text-sm">
                  {filteredNews.length} stories with 5-year-old explanations
                </Badge>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-lg font-medium">Loading fresh financial tea... ☕</span>
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
                    <h3 className="text-xl font-bold mb-2">No fresh financial drama in this category!</h3>
                    <p className="text-muted-foreground mb-4">
                      Try switching categories, searching for something, or refreshing for the latest money news.
                    </p>
                    <Button variant="money" onClick={() => fetchLatestNews(apiKey)}>
                      Get Fresh Tea! ☕
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {activeTab === "summary" && <LinkSummarizer />}
        
        {activeTab === "chat" && <GrokChat />}
      </div>
    </div>
  );
};

export default Index;
