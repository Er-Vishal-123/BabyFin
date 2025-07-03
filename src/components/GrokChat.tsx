
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, MessageCircle, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'grok';
  timestamp: Date;
}

export const GrokChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! 👋 I'm your BabyFin AI assistant powered by Grok! Ask me anything about finance, money, investing, or economics and I'll explain it in super simple terms! 🍼💰",
      sender: 'grok',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const GROK_API_KEY = "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";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are BabyFin's AI assistant, designed to explain finance and money concepts in the simplest possible terms, as if explaining to a 5-year-old. Use lots of emojis, analogies with toys/games/everyday things kids understand, and keep responses friendly and encouraging. Always end responses with an encouraging emoji combo."
            },
            {
              role: "user",
              content: userMessage.content
            }
          ],
          model: "grok-beta",
          stream: false,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const grokMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices[0]?.message?.content || "Sorry, I couldn't understand that. Can you try asking in a different way? 🤔",
        sender: 'grok',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, grokMessage]);
      
    } catch (error) {
      console.error('Error calling Grok API:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm having trouble connecting to my brain right now! 🤯 But here's what I can tell you about "${userMessage.content}": 

Think of money like your allowance - you earn it by doing good things, and then you can spend it on things you want or save it for later! 

💰 If you're asking about investing, it's like planting seeds in your garden - you put your money somewhere safe and wait for it to grow bigger over time!

📈 If it's about stocks, imagine companies are like your favorite video games - when lots of people want to play them, they become more valuable!

Try asking me again - I'll do my best to help! 🚀✨`,
        sender: 'grok',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "🤖 AI had a tiny hiccup!",
        description: "I gave you a backup answer, but try asking again!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <MessageCircle className="w-8 h-8 text-primary" />
          Chat with Grok AI 🤖
        </h2>
        <p className="text-muted-foreground text-lg">
          Ask me anything about money, finance, or investing! I'll explain it like you're 5! 👶💡
        </p>
      </div>

      <Card className="shadow-card h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 text-primary" />
            BabyFin AI Assistant
            <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🟢 Online
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-purple-50/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-accent text-white'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white ml-2'
                      : 'bg-white border shadow-sm mr-2'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-accent text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg p-3 mr-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Thinking really hard... 🤔
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me about money, stocks, investing, or any finance question! 💰"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                variant="money"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Try asking: "What is a stock?", "How does saving money work?", "Explain cryptocurrency like I'm 5"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
