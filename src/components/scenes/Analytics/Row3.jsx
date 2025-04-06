import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "../../state/api";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const Row3 = () => {
  const pieColors = ['#10B981', '#6366F1'];

  const { data: kpiData, isLoading: isLoadingKpi, error: errorKpi } = useGetKpisQuery();
  const { data: productData, isLoading: isLoadingProduct, error: errorProduct } = useGetProductsQuery();
  const { data: transactionData, isLoading: isLoadingTransaction, error: errorTransaction } = useGetTransactionsQuery();

  // Check for Redux Provider error
  if (errorKpi?.message?.includes("react-redux context value") ||
      errorProduct?.message?.includes("react-redux context value") ||
      errorTransaction?.message?.includes("react-redux context value")) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
        <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
      </div>
    );
  }

  const pieChartData = useMemo(() => {
    if (kpiData && kpiData[0]?.expensesByCategory) {
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
    return [];
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
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params) => `$${params.value}`,
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
      renderCell: (params) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params) => (params.value ? params.value.length : 0),
    },
  ];

  if (isLoadingKpi || isLoadingProduct || isLoadingTransaction) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (errorKpi || errorProduct || errorTransaction) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-red-500">Error loading data</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-semibold">List of Products</h3>
          <span className="text-slate-600">{productData?.length || 0} products</span>
        </div>
        <div className="h-[75%] mt-2 px-2">
          <div className="h-full overflow-auto">
            {productData && productData.length > 0 ? (
              <DataGrid
                className="border-none text-slate-700"
                columnHeaderHeight={25}
                rowHeight={35}
                hideFooter={true}
                rows={productData || []}
                columns={productColumns}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-semibold">Recent Orders</h3>
          <span className="text-slate-600">{transactionData?.length || 0} latest transactions</span>
        </div>
        <div className="h-[80%] mt-4 px-2">
          <div className="h-full overflow-auto">
            {transactionData && transactionData.length > 0 ? (
              <DataGrid
                className="border-none text-slate-700"
                columnHeaderHeight={25}
                rowHeight={35}
                hideFooter={true}
                rows={transactionData || []}
                columns={transactionColumns}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No transactions available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-semibold">Expense Breakdown By Category</h3>
          <span className="text-emerald-500">+4%</span>
        </div>
        <div className="flex justify-between items-center mt-2 gap-2 px-4 text-center">
          {pieChartData && pieChartData.length > 0 ? (
            pieChartData.map((data, i) => (
              <div key={`${data[0].name}-${i}`}>
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
                <h5 className="text-slate-700 font-medium">{data[0].name}</h5>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full">
              <p>No expense data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-semibold">Overall Summary</h3>
          <span className="text-emerald-500">+15%</span>
        </div>
        <div className="mx-4 mt-5 mb-2">
          <div className="h-[15px] bg-gray-200 rounded-full">
            <div className="h-full w-[40%] bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <p className="mx-4 text-slate-700">
          Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam
          ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas
          molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare
          sed. In volutpat nullam at est id cum pulvinar nunc.
        </p>
      </div>
    </>
  );
};

export default Row3;
