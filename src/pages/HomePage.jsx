import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function HomePage() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/ads');
                setAds(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load ads. Please try again later.');
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatPhone = (phone) => {
        return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3-$4-$5');
    };

    // Filter ads based on search and category
    const filteredAds = ads.filter(ad => {
        const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             ad.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? ad.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories from ads
    const categories = [...new Set(ads.map(ad => ad.category))].sort();

    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <h1 style={{ fontFamily: 'Rouge Script' }} className="text-4xl font-bold text-red-800">
                            Recent Handicraft Ads:
                        </h1>
                        
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/manage"
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                Manage Ads
                            </Link>
                            <Link
                                to="/add"
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                Add New Ad
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search ads..."
                            className="px-4 py-2 border rounded flex-grow max-w-xs border-red-500 focus:border-red-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="px-4 py-2 border rounded border-red-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {loading && <p className="text-center text-gray-600">Loading ads...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAds.map(ad => (
                            <div key={ad.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-60 w-full overflow-hidden">
                                    <img
                                        src={`http://localhost:5000/uploads/${ad.image_path}`}
                                        alt={ad.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-semibold text-gray-800">{ad.title}</h2>
                                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                            {ad.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">{ad.description}</p>

                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-lg font-bold text-red-600">{ad.price} MAD</p>
                                        <p className="text-sm text-gray-500">{formatDate(ad.created_at)}</p>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg
                                            className="w-5 h-5 mr-2 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span>{formatPhone(ad.phone_number)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;