import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface StockChartProps {
  symbol: string;
  data: { time: string; price: number; }[];
  change: number;
  changePercent: number;
}

export const StockChart = ({ symbol, data, change, changePercent }: StockChartProps) => {
  const isPositive = change >= 0;
  const emoji = isPositive ? '🚀' : '📉';
  const colorClass = isPositive ? 'text-bullish' : 'text-bearish';
  const bgClass = isPositive ? 'bg-bullish/10' : 'bg-bearish/10';

  return (
    <Card className={`${bgClass} border-2 ${isPositive ? 'border-bullish/20' : 'border-bearish/20'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            {emoji} {symbol}
            <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
              {isPositive ? "Stonks Up" : "Oof Down"}
            </Badge>
          </CardTitle>
          <div className={`text-right ${colorClass}`}>
            <div className="font-bold text-lg">
              {isPositive ? '+' : ''}{change.toFixed(2)}
            </div>
            <div className="text-sm">
              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="time" 
                hide 
              />
              <YAxis hide />
              <Tooltip 
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? 'hsl(var(--bullish))' : 'hsl(var(--bearish))'} 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: isPositive ? 'hsl(var(--bullish))' : 'hsl(var(--bearish))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-muted-foreground">
            {isPositive ? 
              "📈 Money printer go brrr! 💰" : 
              "💸 Wallet feeling lighter today 😅"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};