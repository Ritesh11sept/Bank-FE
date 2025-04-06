import BoxHeader from "../../BoxHeader";
import { useGetKpisQuery } from "../../state/api";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";

const Row1 = () => {
  const { data, error, isLoading } = useGetKpisQuery();

  console.log('Row1 - Data:', data);
  console.log('Row1 - Loading:', isLoading);
  if (error) console.error('Row1 - Error:', error);

  const revenue = useMemo(() => {
    return (
      data &&
      data[0]?.monthlyData?.map(({ month, revenue }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
        };
      })
    );
  }, [data]);

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0]?.monthlyData?.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses,
        };
      })
    );
  }, [data]);

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0]?.monthlyData?.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          profit: (revenue - expenses).toFixed(2),
        };
      })
    );
  }, [data]);

  const gradientColors = {
    revenue: {
      start: '#10B981',
      end: 'rgba(16, 185, 129, 0.1)',
    },
    expenses: {
      start: '#6366F1',
      end: 'rgba(99, 102, 241, 0.1)',
    },
    profit: {
      start: '#3B82F6',
      end: 'rgba(59, 130, 246, 0.1)',
    },
  };

  // If the component isn't wrapped in a Redux Provider
  if (error?.message?.includes("react-redux context value")) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center">
        <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">Loading...</div>
      ) : error ? (
        <div className="flex items-center justify-center p-4 text-red-500">Error loading data</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-lg p-4" style={{ gridArea: "a" }}>
            <BoxHeader
              title="Revenue and Expenses"
              subtitle="top line represents revenue, bottom line represents expenses"
              sideText="+4%"
            />
            <div className="w-full h-full">
              {revenueExpenses ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueExpenses}
                    margin={{
                      top: 15,
                      right: 25,
                      left: -10,
                      bottom: 60,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.revenue.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.revenue.end} stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColors.expenses.start} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={gradientColors.expenses.end} stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={{ strokeWidth: "0" }}
                      style={{ fontSize: "10px", fill: '#666666' }}
                      domain={[8000, 23000]}
                    />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      dot={true}
                      stroke={gradientColors.revenue.start}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      dot={true}
                      stroke={gradientColors.expenses.start}
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4" style={{ gridArea: "b" }}>
            <BoxHeader
              title="Profit and Revenue"
              subtitle="top line represents revenue, bottom line represents expenses"
              sideText="+4%"
            />
            <div className="w-full h-full">
              {revenueProfit ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueProfit}
                    margin={{
                      top: 20,
                      right: 0,
                      left: -10,
                      bottom: 55,
                    }}
                  >
                    <CartesianGrid vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }} />
                    <Legend
                      height={20}
                      wrapperStyle={{
                        margin: "0 0 10px 0",
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="profit"
                      stroke={gradientColors.profit.start}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke={gradientColors.revenue.start}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4" style={{ gridArea: "c" }}>
            <BoxHeader
              title="Revenue Month by Month"
              subtitle="graph representing the revenue month by month"
              sideText="+4%"
            />
            <div className="w-full h-full">
              {revenue ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenue}
                    margin={{
                      top: 17,
                      right: 15,
                      left: -5,
                      bottom: 58,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={gradientColors.revenue.start}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={gradientColors.revenue.end}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      style={{ fontSize: "10px", fill: '#666666' }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }} />
                    <Bar dataKey="revenue" fill={gradientColors.revenue.start} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Row1;
