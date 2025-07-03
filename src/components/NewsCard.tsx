import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  kidExplanation: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  publishedAt: string;
  source: string;
  url: string;
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case 'bullish':
      return <TrendingUp className="w-4 h-4" />;
    case 'bearish':
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <DollarSign className="w-4 h-4" />;
  }
};

const getSentimentEmoji = (sentiment: string) => {
  switch (sentiment) {
    case 'bullish':
      return '🚀📈';
    case 'bearish':
      return '📉😰';
    default:
      return '🤔💭';
  }
};

const getCategoryEmoji = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'Stock Drama': '🎭📊',
    'Money Moves': '💰🏃‍♂️',
    'Earnings Tea': '☕📈',
    'Crypto Chaos': '🪙🌪️',
    'Market Vibes': '📈✨',
    'default': '📰💼'
  };
  return categoryMap[category] || categoryMap['default'];
};

export const NewsCard = ({ 
  title, 
  summary, 
  kidExplanation, 
  category, 
  sentiment, 
  publishedAt, 
  source,
  url 
}: NewsCardProps) => {
  const sentimentColors = {
    bullish: 'text-bullish',
    bearish: 'text-bearish',
    neutral: 'text-neutral'
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="w-full hover:shadow-card transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {getCategoryEmoji(category)} {category}
              </Badge>
              <div className={`flex items-center gap-1 ${sentimentColors[sentiment]}`}>
                {getSentimentIcon(sentiment)}
                <span className="text-xs font-medium">{getSentimentEmoji(sentiment)}</span>
              </div>
            </div>
            <CardTitle className="text-lg font-bold leading-tight mb-2 line-clamp-2">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{source}</span>
              <span>•</span>
              <span>{formatTimeAgo(publishedAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 border-l-3 border-l-accent">
            <h4 className="text-sm font-semibold text-accent mb-2">
              🧠 For Big Brains (Original):
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {summary}
            </p>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-3 border-l-3 border-l-primary">
            <h4 className="text-sm font-semibold text-primary mb-2">
              🍼 5-Year-Old Explanation:
            </h4>
            <p className="text-sm font-medium">
              {kidExplanation}
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(url, '_blank')}
            >
              Read Full Story 📖
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                👍 {Math.floor(Math.random() * 50) + 10}
              </Button>
              <Button variant="ghost" size="sm">
                💬 {Math.floor(Math.random() * 20) + 5}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};