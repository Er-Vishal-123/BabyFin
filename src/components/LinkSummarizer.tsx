
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link, Volume2, VolumeX } from "lucide-react";

export const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!url.trim()) {
      toast({
        title: "🤔 Need a link first!",
        description: "Please paste a news article URL to get started!",
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll create a mock summary
      // In a real implementation, you'd use a web scraping service and AI summarization
      const mockSummary = `Here's what this article is about in simple words:

🍼 Baby Version:
Think of this like when you have toy money and someone tells you that your favorite toy company made more toy money this month! That means the company is doing really good, like when you get a gold star for being awesome!

📈 What Happened:
The company's "score" went up because they sold lots of their products. It's like if you had a lemonade stand and sold way more cups than you thought you would - you'd be super happy and have more money to buy more lemons!

💰 Why Should You Care:
When companies do well, it usually means:
- People like their products (like your favorite video game)
- They might make even cooler stuff later
- It's generally good news for everyone!

Think of it like your favorite YouTuber getting more subscribers - it means they're doing something right and people like what they're doing! 🎉`;

      setSummary(mockSummary);
      
      toast({
        title: "✨ Summary ready!",
        description: "Your link has been turned into baby-friendly finance talk!",
      });
    } catch (error) {
      console.error('Error summarizing:', error);
      toast({
        title: "😅 Oops!",
        description: "Couldn't summarize that link right now. Try another one!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!summary) {
      toast({
        title: "🤐 Nothing to read!",
        description: "Get a summary first, then I can read it to you!",
      });
      return;
    }

    if (isPlaying) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Start speaking
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 0.8; // Slower speech for better understanding
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 0.9;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "🔇 Voice had a hiccup!",
        description: "Text-to-speech isn't working right now, but you can still read the summary!",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Link className="w-8 h-8 text-primary" />
          Link Summary Magic ✨
        </h2>
        <p className="text-muted-foreground text-lg">
          Paste any financial news link and get it explained like you're 5! Plus, listen to it too! 🎧👶
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔗 Paste Your Link Here
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/financial-news-article..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSummarize}
              disabled={loading}
              variant="money"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "✨"} 
              Summarize
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            📝 Works best with news articles from major financial websites
          </p>
        </CardContent>
      </Card>

      {summary && (
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                🍼 Your Baby-Friendly Summary
              </CardTitle>
              <Button
                onClick={handleSpeak}
                variant={isPlaying ? "bearish" : "bullish"}
                size="sm"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4 mr-1" />
                    Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-1" />
                    Read Aloud
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              readOnly
              className="min-h-[300px] text-sm leading-relaxed bg-white/50"
            />
            <div className="mt-4 text-xs text-muted-foreground">
              💡 Pro tip: Click "Read Aloud" to have this summary spoken to you in a friendly voice!
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-3">🎯 How This Works:</h3>
          <div className="space-y-2 text-sm">
            <p>1. 📋 <strong>Paste a link</strong> to any financial news article</p>
            <p>2. ✨ <strong>Get instant summary</strong> that explains complex finance stuff simply</p>
            <p>3. 🎧 <strong>Listen to it</strong> with our text-to-speech feature</p>
            <p>4. 🧠 <strong>Understand money news</strong> without the confusing jargon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
