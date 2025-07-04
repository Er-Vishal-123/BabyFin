
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX } from "lucide-react";

interface SummaryDisplayProps {
  summary: string;
  isPlaying: boolean;
  onSpeak: () => void;
}

export const SummaryDisplay = ({ summary, isPlaying, onSpeak }: SummaryDisplayProps) => {
  if (!summary) return null;

  return (
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
              onClick={onSpeak}
              variant={isPlaying ? "destructive" : "default"}
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
  );
};
