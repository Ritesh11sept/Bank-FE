import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, CartesianGrid } from "recharts";
import { useGetKpisQuery } from "../state/api";

const Insights = () => {
  const { data } = useGetKpisQuery();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Financial Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Revenue Overview</h2>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1f77b4" />
                <Line type="monotone" dataKey="expenses" stroke="#ff7f0e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            {/* Add activity feed component here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
