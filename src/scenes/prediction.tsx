import DashboardLayout from "@/components/DashboardLayout";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery } from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
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
import regression, { DataPoint } from "regression";

const Predictions = () => {
  const { palette } = useTheme();
  const [isPredictions, setIsPredictions] = useState(false);
  const { data: kpiData } = useGetKpisQuery();

  const formattedData = useMemo(() => {
    if (!kpiData) return [];
    const monthData = kpiData[0].monthlyData;
    
    console.log("Monthly Data:", monthData); // Debug log

    const formatted: Array<DataPoint> = monthData.map(
      ({ revenue }, i: number) => {
        return [i, revenue];
      }
    );
    const regressionLine = regression.linear(formatted);
    
    console.log("Regression Line:", regressionLine); // Debug log

    const result = monthData.map(({ month, revenue }, i: number) => {
      const predictedValue = regressionLine.predict(i + 12)[1];
      console.log(`Prediction for ${month}:`, predictedValue); // Debug log
      
      return {
        name: month,
        "Actual Revenue": revenue,
        "Regression Line": regressionLine.points[i][1],
        "Predicted Revenue": predictedValue,
      };
    });

    console.log("Formatted Data:", result); // Debug log
    return result;
  }, [kpiData]);

  return (
    <DashboardLayout>
      <Box
        width="100%"
        height="100%"
        p="1.5rem 2rem"
        sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DashboardBox
          width="100%"
          height="calc(100vh - 120px)"
          p="1.5rem"
          overflow="hidden"
          sx={{
            borderRadius: '1rem',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            background: 'white',
          }}
        >
          <FlexBetween mb="2rem">
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '1.75rem',
                  mb: '0.5rem'
                }}
              >
                Revenue and Predictions
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748B',
                  fontWeight: 400 
                }}
              >
                Charted revenue and predicted revenue based on a simple linear regression model
              </Typography>
            </Box>
            <Button
              onClick={() => setIsPredictions(!isPredictions)}
              sx={{
                color: 'white',
                backgroundColor: '#10B981',
                px: '1.5rem',
                py: '0.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0px 2px 4px rgba(16, 185, 129, 0.2)',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              {isPredictions ? 'Hide' : 'Show'} Predicted Revenue
            </Button>
          </FlexBetween>

          <Box 
            height="calc(100% - 100px)"
            sx={{
              '.recharts-wrapper': {
                mb: '-20px'  // Adjust chart positioning
              }
            }}
          >
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
          </Box>
        </DashboardBox>
      </Box>
    </DashboardLayout>
  );
};

export default Predictions;
