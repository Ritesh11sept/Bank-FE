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
      <>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "g" }}>
          <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "h" }}>
          <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "i" }}>
          <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "j" }}>
          <p className="text-red-500">Redux Provider not found. Please ensure the app is wrapped in a Redux Provider.</p>
        </div>
      </>
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
      <>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "g" }}>
          <p>Loading data...</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "h" }}>
          <p>Loading data...</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "i" }}>
          <p>Loading data...</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "j" }}>
          <p>Loading data...</p>
        </div>
      </>
    );
  }

  if (errorKpi || errorProduct || errorTransaction) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "g" }}>
          <p className="text-red-500">Error loading data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "h" }}>
          <p className="text-red-500">Error loading data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "i" }}>
          <p className="text-red-500">Error loading data</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-full" style={{ gridArea: "j" }}>
          <p className="text-red-500">Error loading data</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ gridArea: "g", height: "100%" }}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-slate-800 font-semibold text-sm md:text-base">List of Products</h3>
          <span className="text-slate-600 text-xs md:text-sm">{productData?.length || 0} products</span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full w-full overflow-auto">
            {productData && productData.length > 0 ? (
              <DataGrid
                className="border-none text-slate-700"
                columnHeaderHeight={25}
                rowHeight={30}
                headerHeight={30}
                hideFooter={true}
                rows={productData ? productData.slice(0, 10) : []}
                columns={productColumns}
                disableColumnMenu
                disableColumnSelector
                disableSelectionOnClick
                autoHeight={false}
                style={{ height: '100%', width: '100%', maxHeight: '170px' }}
                density="compact"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col" style={{ gridArea: "h", height: "100%" }}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-slate-800 font-semibold text-sm md:text-base">Recent Orders</h3>
          <span className="text-slate-600 text-xs md:text-sm">{transactionData?.length || 0} latest transactions</span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full w-full overflow-auto">
            {transactionData && transactionData.length > 0 ? (
              <DataGrid
                className="border-none text-slate-700"
                columnHeaderHeight={25}
                rowHeight={30}
                headerHeight={30}
                hideFooter={true}
                rows={transactionData ? transactionData.slice(0, 10) : []}
                columns={transactionColumns}
                disableColumnMenu
                disableColumnSelector
                disableSelectionOnClick
                autoHeight={false}
                style={{ height: '100%', width: '100%', maxHeight: '170px' }}
                density="compact"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No transactions available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 flex flex-col" style={{ gridArea: "i", height: "100%" }}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-slate-800 font-semibold text-sm md:text-base">Expense Breakdown By Category</h3>
          <span className="text-emerald-500 text-xs md:text-sm">+4%</span>
        </div>
        <div className="flex-1 flex flex-wrap justify-center items-center gap-2 overflow-auto">
          {pieChartData && pieChartData.length > 0 ? (
            pieChartData.map((data, i) => (
              <div key={`${data[0].name}-${i}`} className="flex flex-col items-center flex-shrink-0">
                <PieChart width={80} height={70}>
                  <Pie
                    stroke="none"
                    data={data}
                    innerRadius={13}
                    outerRadius={27}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
                <h5 className="text-slate-700 font-medium text-xs">{data[0].name}</h5>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full">
              <p className="text-sm">No expense data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 flex flex-col" style={{ gridArea: "j", height: "100%" }}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-slate-800 font-semibold text-sm md:text-base">Overall Summary</h3>
          <span className="text-emerald-500 text-xs md:text-sm">+15%</span>
        </div>
        <div className="mx-2 mt-2 mb-1">
          <div className="h-[10px] bg-gray-200 rounded-full">
            <div className="h-full w-[40%] bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="mx-2 text-slate-700 overflow-auto flex-1">
          <p className="text-xs md:text-sm line-clamp-3">
            Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam
            ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas
            molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare
            sed. In volutpat nullam at est id cum pulvinar nunc.
          </p>
        </div>
      </div>
    </>
  );
};

export default Row3;
