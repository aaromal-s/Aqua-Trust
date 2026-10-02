import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { time: '00:00', pH: 7.2, turbidity: 4.2, temp: 24.1 },
  { time: '04:00', pH: 7.1, turbidity: 4.5, temp: 23.8 },
  { time: '08:00', pH: 7.3, turbidity: 4.1, temp: 24.5 },
  { time: '12:00', pH: 7.4, turbidity: 4.8, temp: 25.2 },
  { time: '16:00', pH: 7.3, turbidity: 5.2, temp: 25.8 },
  { time: '20:00', pH: 7.2, turbidity: 4.9, temp: 24.9 },
  { time: '24:00', pH: 7.1, turbidity: 4.4, temp: 24.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-lg shadow-xl">
        <p className="text-slate-500 text-sm mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WaterQualityChart = () => {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">24h Water Quality Trends</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-slate-900/10 text-xs font-medium hover:bg-slate-900/10 transition-colors">pH</button>
          <button className="px-3 py-1 rounded bg-aqua-500/20 text-aqua-400 text-xs font-medium border border-aqua-500/30">Turbidity</button>
          <button className="px-3 py-1 rounded bg-slate-900/10 text-xs font-medium hover:bg-slate-900/10 transition-colors">Temp</button>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTurbidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="turbidity" 
              name="Turbidity (NTU)" 
              stroke="#00f2fe" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTurbidity)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterQualityChart;
