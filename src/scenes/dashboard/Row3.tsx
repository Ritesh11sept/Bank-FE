import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = ['#10B981', '#6366F1'];

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value,
            },
          ];
        }
      );
    }
  }, [kpiData]);

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  const chartColors = {
    text: '#1E293B',
    subtext: '#64748B',
    border: '#E2E8F0',
    accent: ['#10B981', '#6366F1'],
    background: {
      header: 'rgba(16, 185, 129, 0.1)',
      hover: 'rgba(16, 185, 129, 0.05)'
    }
  };

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader 
          title="List of Products" 
          sideText={`${productData?.length} products`}
          titleStyles={{ color: chartColors.text }}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: chartColors.text,
              border: "none",
              "& .MuiDataGrid-row:hover": {
                backgroundColor: chartColors.background.hover
              }
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${chartColors.border} !important`,
              color: chartColors.subtext,
              fontSize: "13px"
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${chartColors.border} !important`,
              backgroundColor: chartColors.background.header,
              color: chartColors.text,
              fontWeight: 600
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden"
            },
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px"
            },
            "&::-webkit-scrollbar-track": {
              background: chartColors.border
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#34D399", // Updated to emerald-400
              borderRadius: "4px",
              "&:hover": {
                background: "#10B981" // Darker shade on hover
              }
            }
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
          titleStyles={{ color: chartColors.text }}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: chartColors.text,
              border: "none",
              "& .MuiDataGrid-row:hover": {
                backgroundColor: chartColors.background.hover
              }
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${chartColors.border} !important`,
              color: chartColors.subtext,
              fontSize: "13px"
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${chartColors.border} !important`,
              backgroundColor: chartColors.background.header,
              color: chartColors.text,
              fontWeight: 600
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden"
            },
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px"
            },
            "&::-webkit-scrollbar-track": {
              background: chartColors.border
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#34D399", // Updated to emerald-400
              borderRadius: "4px",
              "&:hover": {
                background: "#10B981" // Darker shade on hover
              }
            }
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={110} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary"
          sideText="+15%"
        />
        <Box
          height="15px"
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor="#E5E7EB"
          borderRadius="1rem"
        >
          <Box
            height="15px"
            bgcolor="#10B981"
            borderRadius="1rem"
            width="40%"
          />
        </Box>
        <Typography margin="0 1rem" variant="h6">
          Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam
          ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas
          molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare
          sed. In volutpat nullam at est id cum pulvinar nunc.
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
