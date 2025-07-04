
import { Card, CardContent } from "@/components/ui/card";

export const InfoCard = () => {
  return (
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
  );
};
