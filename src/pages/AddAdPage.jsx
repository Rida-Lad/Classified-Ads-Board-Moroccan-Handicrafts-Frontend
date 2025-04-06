import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const AdForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'potteries',
        phone_number: '',
        image: null
    });
    const [accessCode, setAccessCode] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        else if (formData.title.length > 10) newErrors.title = 'Title must be ≤10 characters';

        if (!formData.description.trim()) newErrors.description = 'Description is required';
        else if (formData.description.length > 25) newErrors.description = 'Description must be ≤25 characters';

        if (!formData.price) newErrors.price = 'Price is required';
        else if (formData.price <= 0) newErrors.price = 'Price must be > 0 MAD';

        if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
        else if (!/^0[5-7]\d{8}$/.test(formData.phone_number)) newErrors.phone_number = 'Invalid Moroccan number';

        if (!formData.image) newErrors.image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('phone_number', formData.phone_number);
        data.append('image', formData.image);

        try {
            const res = await axios.post('http://localhost:5000/api/ads', data);
            setAccessCode(res.data.accessCode);
            setErrors({});
        } catch (err) {
            setErrors({ server: 'Submission failed. Please try again.' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg mt-10 shadow-md">
                <h1 style={{fontFamily:'Rouge Script', fontSize:'38px'}} className="text-2xl font-bold mb-6 text-red-800">Create Your Handicraft Ad</h1>

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="Traditional Pot"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none sm:text-sm ${errors.title ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                {/* Description Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={25}
                        placeholder="Handmade with care"
                        className={`mt-1 block w-full rounded-md border-gray-300 focus:outline-none shadow-sm sm:text-sm ${errors.description ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                {/* Price Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (MAD) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        placeholder="250.00"
                        className={`mt-1 block w-full rounded-md border-gray-300 focus:outline-none shadow-sm sm:text-sm ${errors.price ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                {/* Category Select */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 focus:outline-none shadow-sm sm:text-sm"
                    >
                        {['potteries', 'jewelries', 'carpets', 'zelliges', 'others'].map(opt => (
                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {/* Phone Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        pattern="0[5-7][0-9]{8}"
                        placeholder="0612345678"
                        className={`mt-1 block w-full rounded-md border-gray-300 focus:outline-none shadow-sm sm:text-sm ${errors.phone_number ? 'border-red-500' : ''
                            }`}
                    />
                    {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>

                {/* File Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="image"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 "
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="image"
                                        name="image"
                                        type="file"
                                        onChange={handleFile}
                                        accept="image/*"
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                    </div>
                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Create Ad
                </button>

                {accessCode && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                        Your access code: <strong>{accessCode}</strong> (Save this to manage your ad)
                    </div>
                )}

                {errors.server && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{errors.server}</div>
                )}
            </form>
        </>
    );
};

export default AdForm;