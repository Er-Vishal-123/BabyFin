
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LinkInputProps {
  url: string;
  loading: boolean;
  onUrlChange: (url: string) => void;
  onSummarize: () => void;
}

export const LinkInput = ({ url, loading, onUrlChange, onSummarize }: LinkInputProps) => {
  return (
    <Card className="shadow-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔗 Paste Your News Link Here
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/financial-news-article..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={onSummarize}
            disabled={loading}
            variant="default"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "✨"} 
            Summarize Now
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          📝 Works best with news articles from major financial websites • Real-time processing
        </p>
      </CardContent>
    </Card>
  );
};
