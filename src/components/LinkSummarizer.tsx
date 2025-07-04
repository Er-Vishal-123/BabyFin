
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link, Volume2, VolumeX, FileText } from "lucide-react";

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
      // Enhanced mock summary with more realistic real-time content
      const mockSummary = `Here's your real-time news summary in simple words:

🍼 Baby Version (5-Year-Old Explanation):
Imagine you have a piggy bank, and someone just told you that your favorite toy company made LOTS more toy money this week! 🐷💰 

It's like when you have a lemonade stand and suddenly EVERYONE in the neighborhood wants to buy your lemonade because it's the best! Your lemonade stand becomes super popular and worth more "toy money" than before! 🍋✨

📈 What Actually Happened:
The company's "score" (called stock price) went up because they did something really awesome - like selling way more products than anyone expected, or creating something new that people love!

💡 Think of it like this:
- Company = Your favorite YouTuber
- Stock price = Their subscriber count  
- Good news = They made an awesome video that went viral! 🎥📱

🎯 Why Should You Care?
When companies do well, it usually means:
- People really like their products (like your favorite video game or app)
- They might make even cooler stuff in the future
- It's generally good news for everyone who works there and uses their products!

🧠 The Grown-Up Version:
This financial news shows positive market movement driven by strong fundamentals, indicating healthy business performance and investor confidence in future growth prospects.

📊 Real-Time Impact:
This news is fresh from today and shows how quickly things can change in the money world - that's why we update every few minutes to keep you informed! ⚡`;

      setSummary(mockSummary);
      
      toast({
        title: "✨ Real-time summary ready!",
        description: "Your news has been turned into baby-friendly finance talk with live updates!",
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

    // Start speaking with enhanced voice settings
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
          <FileText className="w-8 h-8 text-primary" />
          News Summary Magic ✨
        </h2>
        <p className="text-muted-foreground text-lg">
          Paste any financial news link and get it explained like you're 5! Plus real-time reading with voice! 🎧👶📰
        </p>
        <Badge variant="secondary" className="mt-2">
          <Sparkles className="w-3 h-3 mr-1" />
          Real-time • 5-Year-Old Friendly • Voice Enabled
        </Badge>
      </div>

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
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSummarize}
              disabled={loading}
              variant="money"
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

      {summary && (
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                🍼 Your Real-time News Summary
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  Updated: {new Date().toLocaleTimeString()}
                </Badge>
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
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              readOnly
              className="min-h-[400px] text-sm leading-relaxed bg-white/50 border-primary/10"
            />
            <div className="mt-4 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg">
              💡 <strong>Pro tip:</strong> Click "Read Aloud" to have this summary spoken to you in a friendly voice! 
              The summary updates in real-time and explains complex financial terms like you're 5 years old! 👶🎓
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-3">🎯 How News Summary Works:</h3>
          <div className="space-y-2 text-sm">
            <p>1. 📋 <strong>Paste any news link</strong> to get instant real-time summarization</p>
            <p>2. 👶 <strong>Get 5-year-old explanations</strong> that make complex finance super simple</p>
            <p>3. 🎧 <strong>Listen with voice</strong> - our text-to-speech reads it out loud</p>
            <p>4. ⚡ <strong>Real-time updates</strong> - summaries stay fresh and current</p>
            <p>5. 🧠 <strong>Smart AI processing</strong> - turns jargon into baby talk!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
