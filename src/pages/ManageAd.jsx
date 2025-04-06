import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const ManageAd = () => {
  const [accessCode, setAccessCode] = useState('');
  const [ad, setAd] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.title || formData.title.length > 10) {
      errors.title = 'Title must be 1-10 characters';
    }
    if (!formData.description || formData.description.length > 25) {
      errors.description = 'Description must be 1-25 characters';
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (!/^0[5-7]\d{8}$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid Moroccan phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFetchAd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/ads/${accessCode}`);
      setAd(response.data);
      setError('');
      setValidationErrors({});
    } catch (err) {
      setError('Ad not found. Please check your access code.');
      setAd(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm(ad)) return;

    const formData = new FormData();
    formData.append('title', ad.title);
    formData.append('description', ad.description);
    formData.append('price', ad.price);
    formData.append('category', ad.category);
    formData.append('phone_number', ad.phone_number);
    formData.append('existingImage', ad.image_path);

    if (ad.newImage) {
      formData.append('image', ad.newImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/ads/${accessCode}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Ad updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Update failed. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ad? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/ads/${accessCode}`);
        navigate('/');
      } catch (err) {
        setError('Delete failed. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setAd({ ...ad, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    setAd({ ...ad, newImage: e.target.files[0] });
  };

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Manage Your Ad</h2>
          <form onSubmit={handleFetchAd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter 6-digit access code"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                pattern="\d{6}"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Find Ad
            </button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white mt-10 mb-10 rounded-lg shadow-md p-8 w-full max-w-2xl">
          <h2 style={{fontFamily:'Rouge Script' , fontSize:'38px'} } className="text-2xl font-bold text-red-800 mb-6 text-center">Edit Your Ad</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={ad.title}
                onChange={handleChange}
                maxLength={10}
                className={`w-full px-4 py-2 border rounded-md ${validationErrors.title ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={ad.description}
                onChange={handleChange}
                maxLength={25}
                className={`w-full px-4 py-2 border rounded-md ${validationErrors.description ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (MAD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={ad.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-md ${validationErrors.price ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={ad.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {['potteries', 'jewelries', 'carpets', 'zelliges', 'others'].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={ad.phone_number}
                onChange={handleChange}
                pattern="0[5-7][0-9]{8}"
                className={`w-full px-4 py-2 border rounded-md ${validationErrors.phone_number ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
              />
              {validationErrors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex flex-col items-center gap-4">
                <img
                  src={`http://localhost:5000/uploads/${ad.image_path}`}
                  alt="Current product"
                  className="h-32 w-32 object-cover rounded-md border"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500">Leave empty to keep current image</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Update Ad
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Ad
              </button>
            </div>

            {/* Status Messages */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageAd;