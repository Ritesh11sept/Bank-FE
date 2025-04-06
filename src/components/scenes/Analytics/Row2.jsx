import BoxHeader from "../../BoxHeader";
import DashboardBox from "../../DashboardBox";
import FlexBetween from "../../FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "../../state/api";
import React, { useMemo } from "react"
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const pieColors = ['#10B981', '#6366F1', '#3B82F6'];
  const { data: operationalData, isLoading: isLoadingOperational, error: errorOperational } = useGetKpisQuery();
  const { data: productData, isLoading: isLoadingProduct, error: errorProduct } = useGetProductsQuery();

  // Check for Redux Provider error
  if (errorOperational?.message?.includes("react-redux context value") ||
      errorProduct?.message?.includes("react-redux context value")) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
        </div>
      </div>
    );
  }

  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0]?.monthlyData?.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);

  const chartColors = {
    text: '#1E293B',
    subtext: '#64748B',
    grid: '#E2E8F0',
    accent: ['#10B981', '#6366F1', '#3B82F6'],
  };

  if (isLoadingOperational || isLoadingProduct) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (errorOperational || errorProduct) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-red-500">Error loading data</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        {operationalExpenses ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={operationalExpenses}
              margin={{
                top: 20,
                right: 0,
                left: -10,
                bottom: 55,
              }}
            >
              <CartesianGrid vertical={false} stroke={chartColors.grid} />
              <XAxis
                dataKey="name"
                tickLine={false}
                style={{ fontSize: "10px", fill: chartColors.text }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: chartColors.text }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px", fill: chartColors.text }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: chartColors.text, fontWeight: 600 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Non Operational Expenses"
                stroke={chartColors.accent[1]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Operational Expenses"
                stroke={chartColors.accent[0]}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No operational data available</p>
          </div>
        )}
      </DashboardBox>
      
      <DashboardBox gridArea="e">
        <BoxHeader title="Campaigns and Targets" sideText="+4%" />
        <div className="mt-1 flex justify-between items-center gap-6 pr-4">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          
          <div className="-ml-3 basis-2/5 text-center">
            <h2 className="text-xl font-semibold">Target Sales</h2>
            <p className="my-1.5 text-3xl text-emerald-500">83</p>
            <p className="text-sm">
              Finance goals of the campaign that is desired
            </p>
          </div>
          
          <div className="basis-2/5">
            <h2 className="text-xl font-semibold">Losses in Revenue</h2>
            <p className="text-sm">Losses are down 25%</p>
            <h2 className="mt-2 text-xl font-semibold">Profit Margins</h2>
            <p className="text-sm">
              Margins are up by 30% from last month.
            </p>
          </div>
        </div>
      </DashboardBox>

      <DashboardBox gridArea="f">
        <BoxHeader title="Product Prices vs Expenses" sideText="+4%" />
        {productExpenseData ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 25,
                bottom: 40,
                left: -10,
              }}
            >
              <CartesianGrid stroke={chartColors.grid} />
              <XAxis
                type="number"
                dataKey="price"
                name="price"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: chartColors.text }}
                tickFormatter={(v) => `$${v}`}
              />
              <YAxis
                type="number"
                dataKey="expense"
                name="expense"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: "10px", fill: chartColors.text }}
                tickFormatter={(v) => `$${v}`}
              />
              <ZAxis type="number" range={[20]} />
              <Tooltip formatter={(v) => `$${v}`} />
              <Scatter
                name="Product Expense Ratio"
                data={productExpenseData}
                fill={chartColors.accent[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No product data available</p>
          </div>
        )}
      </DashboardBox>
    </>
  );
};

export default Row2;
