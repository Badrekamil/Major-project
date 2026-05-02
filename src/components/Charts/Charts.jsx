import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Dynamic line chart for trends and comparison
export const CrimeTrendChart = ({ data, state1, state2, isCompareMode }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} 
               tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
        <RechartsTooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #eaedf1', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)' }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        
        {isCompareMode ? (
          <>
            <Line type="monotone" dataKey={state1} stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey={state2} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </>
        ) : (
          <>
            <Line type="monotone" dataKey="totalCrimes" name="Total Crimes" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="theft" name="Theft" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export const StateComparisonChart = ({ data }) => {
  // Take top 10 for bar chart if there are many states
  const chartData = [...data].sort((a, b) => b.totalCrimes - a.totalCrimes).slice(0, 10);
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="state" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 10 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} 
               tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)} />
        <RechartsTooltip 
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #eaedf1', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)' }}
        />
        <Bar dataKey="totalCrimes" name="Total Crimes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CategoryPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <RechartsTooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #eaedf1', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.06)' }}
          itemStyle={{ color: '#0f172a' }}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};
