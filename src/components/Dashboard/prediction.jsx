import DashboardLayout from "./DashboardLayout";
import DashboardBox from "../DashboardBox";
import FlexBetween from "../FlexBetween";
import { useGetKpisQuery } from "../state/api";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import regression from "regression";

const Predictions = () => {
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;
    
    console.log("Monthly Data:", monthData);

    const formatted = monthData.map(
      ({ revenue }, i) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);
    
    console.log("Regression Line:", regressionLine);

    const result = monthData.map(({ month, revenue }, i) => {
      const predictedValue = regressionLine.predict(i + 12)[1];
      console.log(`Prediction for ${month}:`, predictedValue);
      
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": predictedValue,
      };
    });

    console.log("Formatted Data:", result);
    return result;
  }, [kpiData]);

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6 bg-white/90 backdrop-blur-lg">
        <div className="w-full h-[calc(100vh-120px)] p-6 rounded-2xl shadow-sm bg-white overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[1.75rem] font-semibold text-gray-800 mb-2">
                Revenue and Predictions
              </h3>
              <p className="text-gray-500">
                Charted revenue and predicted revenue based on a simple linear regression model
              </p>
            </div>
            <button
              onClick={() => setIsPredictions(!isPredictions)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-colors"
            >
              {isPredictions ? 'Hide' : 'Show'} Predicted Revenue
            </button>
          </div>

          <div className="h-[calc(100%-100px)] -mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{
                  top: 10,
                  right: 40,
                  left: 0,
                  bottom: 55,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  style={{ fontSize: "10px", fill: '#666666' }}
                >
                  <Label value="Month" offset={-5} position="insideBottom" fill="#666666" />
                </XAxis>
                <YAxis
                  domain={[12000, 26000]}
                  axisLine={{ strokeWidth: "0" }}
                  style={{ fontSize: "10px", fill: '#666666' }}
                  tickFormatter={(v) => `$${v}`}
                >
                  <Label
                    value="Revenue in USD"
                    angle={-90}
                    offset={-5}
                    position="insideLeft"
                    fill="#666666"
                  />
                </YAxis>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB' 
                  }}
                />
                <Legend verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="Actual Revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ strokeWidth: 5, fill: '#10B981' }}
                />
                <Line
                  type="monotone"
                  dataKey="Regression Line"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
                {isPredictions && (
                  <Line
                    strokeDasharray="5 5"
                    dataKey="Predicted Revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    connectNulls={true}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Predictions;
