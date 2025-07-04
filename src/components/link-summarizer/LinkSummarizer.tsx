
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Sparkles } from "lucide-react";
import { LinkInput } from "./LinkInput";
import { SummaryDisplay } from "./SummaryDisplay";
import { InfoCard } from "./InfoCard";
import { createSpeechUtterance, stopSpeech, fetchArticleContent, summarizeArticle } from "./utils";

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

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "🔗 Invalid URL!",
        description: "Please enter a valid news article URL (starting with http:// or https://)",
      });
      return;
    }

    setLoading(true);
    try {
      toast({
        title: "📖 Reading article...",
        description: "Fetching content from the provided URL...",
      });

      // Fetch article content
      const articleContent = await fetchArticleContent(url);
      
      if (!articleContent) {
        throw new Error("Could not extract article content");
      }

      toast({
        title: "🤖 Summarizing...",
        description: "Creating a 5-year-old friendly summary...",
      });

      // Summarize the article content
      const articleSummary = await summarizeArticle(articleContent);
      
      setSummary(articleSummary);
      
      toast({
        title: "✨ Summary ready!",
        description: "Your news has been turned into baby-friendly finance talk with live updates!",
      });
    } catch (error) {
      console.error('Error summarizing:', error);
      toast({
        title: "😅 Oops!",
        description: "Couldn't summarize that link right now. Try another news article URL or check if the link is accessible!",
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
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    const utterance = createSpeechUtterance(summary);
    
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
          Real Content • 5-Year-Old Friendly • Voice Enabled
        </Badge>
      </div>

      <LinkInput
        url={url}
        loading={loading}
        onUrlChange={setUrl}
        onSummarize={handleSummarize}
      />

      <SummaryDisplay
        summary={summary}
        isPlaying={isPlaying}
        onSpeak={handleSpeak}
      />

      <InfoCard />
    </div>
  );
};
