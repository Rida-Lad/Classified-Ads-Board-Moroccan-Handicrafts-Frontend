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

    // Updated color constants to light red theme
    const chartColors = {
        primary: '#F87171', // Light red
        secondary: '#FECACA', // Lighter red
        accent: '#FCA5A5', // Different shade of light red
        danger: '#EF4444', // Darker red
        purple: '#FB7185'  // Pink-red
    };

    if (loading) return <div className="flex justify-center items-center p-8 min-h-screen">Loading stats...</div>;
    if (error) return <div className="flex justify-center items-center p-8 min-h-screen text-red-700">{error}</div>;

    return (
        <div className="min-h-screen bg-red-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-red-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Total Ads Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
                    <h2 className="text-xl font-semibold mb-4 text-red-800">Total Ads</h2>
                    <div className="flex justify-center items-center">
                        <div className="text-5xl font-bold text-red-600">
                            {stats?.total || 0}
                        </div>
                    </div>
                </div>

                {/* Top Contributors */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
                    <h2 className="text-xl font-semibold mb-4 text-red-800">Top Contributors</h2>
                    <div className="h-64">
                        <Bar
                            data={{
                                labels: stats.topContributors.map(c => c.phone_number),
                                datasets: [{
                                    label: 'Number of Ads',
                                    data: stats.topContributors.map(c => c.ad_count),
                                    backgroundColor: chartColors.primary,
                                    borderColor: chartColors.primary,
                                    borderWidth: 1
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="mt-4 space-y-2">
                        {stats.topContributors.map((contributor, index) => (
                            <div key={contributor.phone_number} className="flex justify-between">
                                <span className="font-medium text-red-800">
                                    {index + 1}. {contributor.phone_number}
                                </span>
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                                    {contributor.ad_count} ads
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Distribution - Updated colors */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-red-200">
                    <h2 className="text-xl font-semibold mb-4 text-red-800">Ads by Category</h2>
                    <div className="h-64 flex justify-center items-center">
                        <Pie
                            data={{
                                labels: stats.byCategory.map(c => c.category.toUpperCase()),
                                datasets: [{
                                    data: stats.byCategory.map(c => c.count),
                                    backgroundColor: [
                                        chartColors.primary,
                                        chartColors.secondary,
                                        chartColors.accent,
                                        chartColors.danger,
                                        chartColors.purple
                                    ]
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>

                {/* Latest Ads */}
                <div className="md:col-span-3 lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-red-200">
                    <h2 className="text-xl font-semibold mb-4 text-center text-red-800">Recent Ads</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-red-200">
                                    <th className="pb-2 text-red-700">Title</th>
                                    <th className="pb-2 text-red-700">Date Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.latest.map(ad => (
                                    <tr key={ad.created_at} className="border-b border-red-100 hover:bg-red-50">
                                        <td className="py-2 text-red-800">{ad.title}</td>
                                        <td className="py-2 text-red-600">
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