import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryEmojis: { [key: string]: string } = {
  'All': '🌟',
  'Stock Drama': '🎭',
  'Money Moves': '💰',
  'Earnings Tea': '☕',
  'Crypto Chaos': '🪙',
  'Market Vibes': '📈'
};

export const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-background to-muted/30 rounded-lg border shadow-sm">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "money" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="flex items-center gap-1 transition-all duration-300 hover:scale-105"
        >
          <span>{categoryEmojis[category] || '📰'}</span>
          <span className="font-medium">{category}</span>
          {activeCategory === category && <span className="ml-1">✨</span>}
        </Button>
      ))}
    </div>
  );
};