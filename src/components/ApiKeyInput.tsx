import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("ad0f21e19ff6499f8072a5e313e0529e");

  // Auto-submit with provided API key on component mount
  useEffect(() => {
    const providedKey = "ad0f21e19ff6499f8072a5e313e0529e";
    if (providedKey) {
      localStorage.setItem('newsApiKey', providedKey);
      // Small delay to show the key is being used
      setTimeout(() => {
        onApiKeySubmit(providedKey);
      }, 500);
    }
  }, [onApiKeySubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('newsApiKey', apiKey.trim());
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-money bg-clip-text text-transparent">
            🚀 Money News for Gen Z
          </CardTitle>
          <p className="text-muted-foreground">
            Your daily dose of financial news, but make it simple! 📈✨
          </p>
        </CardHeader>
        
        <CardContent>
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <AlertDescription className="text-sm">
              <strong>Need a News API key?</strong> Get your free API key from{" "}
              <a 
                href="https://newsapi.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                newsapi.org
              </a>
              {" "}to start reading simplified financial news! 🔑
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                News API Key 🗝️
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your News API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never shared 🔒
              </p>
            </div>
            
            <Button 
              type="submit" 
              variant="money" 
              size="lg" 
              className="w-full"
              disabled={!apiKey.trim()}
            >
              Start Reading Financial News! 🎉
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              No backend needed - your API key stays in your browser! 
              <br />
              Made with 💚 for understanding money stuff
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};