import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load statistics');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-8">Loading stats...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  
  return (
    <div className="min-h-screen bg-red-50 p-8">
      <h1 className="text-3xl font-bold mb-12 text-center text-red-800 border-b-2 border-red-200 pb-4">
        Admin Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {/* Total Ads Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-red-100/50 border border-red-100">
          <h2 className="text-xl font-semibold mb-6 text-red-700">Total Ads</h2>
          <div className="text-5xl font-bold text-red-600">
            {stats.total}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg shadow-red-100/50 border border-red-100">
          <h2 className="text-xl font-semibold mb-6 text-red-700">Ads by Category</h2>
          <div className="h-72">
            <Pie
              data={{
                labels: stats.byCategory.map(c => c.category),
                datasets: [{
                  data: stats.byCategory.map(c => c.count),
                  backgroundColor: [
                    '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626'
                  ],
                  borderColor: '#FFF',
                  borderWidth: 2
                }]
              }}
            />
          </div>
        </div>

        {/* Latest Ads */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg shadow-red-100/50 border border-red-100">
          <h2 className="text-xl font-semibold mb-6 text-red-700">Recent Ads</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  <th className="p-4 text-left text-red-800 font-medium">Title</th>
                  <th className="p-4 text-left text-red-800 font-medium">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.latest.map(ad => (
                  <tr key={ad.created_at} className="hover:bg-red-50/50 transition-colors">
                    <td className="p-4 border-t border-red-100">{ad.title}</td>
                    <td className="p-4 border-t border-red-100">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;